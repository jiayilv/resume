import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 2. AI Polish (STAR Method & Quantification)
app.post("/api/ai/polish", async (req, res) => {
  try {
    const { originalText, roleContext, style = "star" } = req.body;
    if (!originalText || typeof originalText !== "string") {
      return res.status(400).json({ error: "Missing originalText" });
    }

    const ai = getGenAI();
    const prompt = `你是一位拥有15年大厂招聘经验的资深HR总监与职业生涯教练。
请对以下求职者的经历/工作描述进行深度润色优化。
求职者目标背景/角色: ${roleContext || "专业职场人"}
原始描述内容:
"""
${originalText}
"""

优化要求:
1. 严格采用 STAR 法则（情境 Situation、任务 Task、行动 Action、结果 Result）。
2. 使用强劲有力的动词（如：主导、构建、重构、落地、驱动、突破），避免平铺直叙。
3. 重点进行数据量化与成果体现（如效率提升百分比、性能优化倍数、营收或成本控制指标）。
4. 提供 3 个不同风格的高质量改写版本供求职者选择：
   - 版本一：【STAR高管大厂风】突出主导权、架构思维与核心攻坚成果。
   - 版本二：【数据量化驱动风】突出关键技术指标、业务指标、ROI与具体数字前后对比。
   - 版本三：【精炼金句要点风】分条列点，HR 3秒即可抓住亮点的极速阅读版。

请以 JSON 格式返回结果：
{
  "versions": [
    {
      "name": "STAR高管大厂风",
      "text": "改写后的内容",
      "highlights": "说明这个版本的核心亮点与优势"
    },
    {
      "name": "数据量化驱动风",
      "text": "改写后的内容",
      "highlights": "说明这个版本的核心亮点与优势"
    },
    {
      "name": "精炼金句要点风",
      "text": "改写后的内容",
      "highlights": "说明这个版本的核心亮点与优势"
    }
  ],
  "advice": "针对此段经历的1条关键进阶提升建议"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            versions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  text: { type: Type.STRING },
                  highlights: { type: Type.STRING },
                },
                required: ["name", "text", "highlights"],
              },
            },
            advice: { type: Type.STRING },
          },
          required: ["versions", "advice"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI Polish error:", error);
    res.status(500).json({ error: error?.message || "AI 润色生成失败" });
  }
});

// 3. AI Generate Summary / Self-Evaluation
app.post("/api/ai/generate-summary", async (req, res) => {
  try {
    const { resumeData, tone = "professional" } = req.body;
    const ai = getGenAI();

    const profileSummary = `
姓名: ${resumeData?.profile?.name || "求职者"}
求职目标: ${resumeData?.jobIntent?.targetPosition || "未指定"}
工作年限: ${resumeData?.profile?.workYears || "多年经验"}
最高学历: ${resumeData?.profile?.highestDegree || "本科"}
核心技能: ${resumeData?.skills?.map((s: any) => s.name).join(", ") || "综合技能"}
近期经历: ${
      resumeData?.workExperiences
        ?.slice(0, 2)
        .map((w: any) => `${w.company} (${w.position}): ${w.description}`)
        .join("; ") || "丰富实践经验"
    }
`;

    const prompt = `作为猎头专家，请根据以下求职者信息，为其定制撰写一段极具吸引力、展现个人竞争壁垒的【个人总结 / 自我评价】（150-250字）：
求职者画像:
${profileSummary}

要求：
1. 拒绝空洞的陈词滥调（如"吃苦耐劳、有责任心"），必须结合其真实经历与技能输出高价值硬核总结。
2. 包含三层逻辑：1) 年限与核心定位；2) 核心能力壁垒与主导过的业务/技术亮点；3) 团队协作、抗压与持续学习素养。
3. 语气自信、沉稳、专业。
4. 提供 2 种不同侧重点版本（全面专业版、敏捷冲劲版）供选择。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primarySummary: { type: Type.STRING, description: "全面专业版个人总结" },
            alternativeSummary: { type: Type.STRING, description: "敏捷冲劲版个人总结" },
            coreKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "提取的 4-6 个个人标签关键词",
            },
          },
          required: ["primarySummary", "alternativeSummary", "coreKeywords"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI Summary error:", error);
    res.status(500).json({ error: error?.message || "AI 总结生成失败" });
  }
});

// 4. AI Resume Diagnosis & Scoring
app.post("/api/ai/diagnose", async (req, res) => {
  try {
    const { resumeData } = req.body;
    const ai = getGenAI();

    const prompt = `请作为资深招聘官与大厂ATS简历初筛系统，对以下求职者简历进行全方位的【简历体检与深度诊断】：

简历完整数据:
${JSON.stringify(resumeData, null, 2)}

评估维度与标准:
1. 综合得分（0-100分）及评级（S/A/B/C）
2. 细分维度打分（0-100）：
   - completeness: 完整度（信息是否齐全，有无缺失联系方式或时间段断层）
   - atsFriendliness: ATS系统可读性与关键词覆盖度
   - impactQuantification: 成果量化度（是否有明确数据指标）
   - conciseness: 语言精炼度（是否废话过多或行文过于冗长）
3. 发现的优势亮点 (strengths, 3条)
4. 亟待改进的具体缺陷与建议 (improvements, 3-4条)
5. 疑似错别字、口语化表达或用词不当修改建议 (typosAndPhrasing)

请输出标准 JSON：`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "综合评分 0-100" },
            grade: { type: Type.STRING, description: "评级 S/A/B/C" },
            summary: { type: Type.STRING, description: "一句话总体评价与诊断" },
            dimensions: {
              type: Type.OBJECT,
              properties: {
                completeness: { type: Type.NUMBER },
                atsFriendliness: { type: Type.NUMBER },
                impactQuantification: { type: Type.NUMBER },
                conciseness: { type: Type.NUMBER },
              },
              required: ["completeness", "atsFriendliness", "impactQuantification", "conciseness"],
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            typosAndPhrasing: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  suggestion: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ["original", "suggestion", "reason"],
              },
            },
          },
          required: ["score", "grade", "summary", "dimensions", "strengths", "improvements", "typosAndPhrasing"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI Diagnose error:", error);
    res.status(500).json({ error: error?.message || "AI 诊断失败" });
  }
});

// 5. AI Job Description (JD) Match
app.post("/api/ai/match-jd", async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ error: "Missing jobDescription" });
    }

    const ai = getGenAI();
    const prompt = `请对比以下求职者简历与目标岗位JD（Job Description），评估两者之间的匹配契合度，并提供定制化的应聘优化建议。

【目标岗位JD】:
"""
${jobDescription}
"""

【求职者简历】:
"""
${JSON.stringify(resumeData, null, 2)}
"""

请进行深度分析并输出 JSON：
1. matchPercentage: 匹配度百分比 (0 - 100)
2. matchedKeywords: 简历中已命中的核心技能/要求关键词
3. missingKeywords: 目标JD中强调但求职者简历中缺失或薄弱的关键项
4. keyAdvice: 3-5条针对该JD微调简历或面试准备的核心建议
5. recommendedPitch: 为求职者量身定制的一段专属求职打招呼/自荐金句（Cover Letter Pitch），用于boss直聘/猎聘打招呼。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchPercentage: { type: Type.NUMBER },
            matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedPitch: { type: Type.STRING },
          },
          required: ["matchPercentage", "matchedKeywords", "missingKeywords", "keyAdvice", "recommendedPitch"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI JD Match error:", error);
    res.status(500).json({ error: error?.message || "AI 匹配失败" });
  }
});

// 6. AI Translation (Chinese <-> English)
app.post("/api/ai/translate", async (req, res) => {
  try {
    const { resumeData, targetLang = "en" } = req.body;
    const ai = getGenAI();

    const prompt = `请将以下求职者简历数据翻译为高质量、地道的${targetLang === "en" ? "英文 (International Professional English)" : "中文"}简历。
注意保持原有的 JSON 结构键名不变，仅将其中的文本内容（如姓名拼音化/对应、职位、职责、项目描述、学校、专业、总结等）转换为专业行业术语。

原数据：
${JSON.stringify(resumeData)}

要求：
1. 语言表达极其地道、符合海外/跨国企业招聘标准。
2. 保持所有的 id 字段不变。
3. 直接返回完整的 JSON 格式数据。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI Translate error:", error);
    res.status(500).json({ error: error?.message || "AI 翻译失败" });
  }
});

// Vite middleware / Static handling
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Resume Builder Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
