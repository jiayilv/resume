import React, { useState } from 'react';
import { CertificateItem, LanguageItem } from '../../types';
import { Plus, Trash2, Award, Languages } from 'lucide-react';
import { SectionTitleBar } from './SectionTitleBar';

interface CertificatesLanguagesEditorProps {
  certificates: CertificateItem[];
  languages: LanguageItem[];
  onChangeCertificates: (updated: CertificateItem[]) => void;
  onChangeLanguages: (updated: LanguageItem[]) => void;
  sectionTitle?: string;
  onUpdateSectionTitle?: (newTitle: string) => void;
}

export const CertificatesLanguagesEditor: React.FC<CertificatesLanguagesEditorProps> = ({
  certificates,
  languages,
  onChangeCertificates,
  onChangeLanguages,
  sectionTitle,
  onUpdateSectionTitle,
}) => {
  const [newCertName, setNewCertName] = useState('');
  const [newCertDate, setNewCertDate] = useState('2023.06');
  const [newCertAuthority, setNewCertAuthority] = useState('');

  const [newLangName, setNewLangName] = useState('');
  const [newLangProf, setNewLangProf] = useState('商务流利 (可作为工作语言)');

  const handleAddCert = () => {
    if (!newCertName.trim()) return;
    const item: CertificateItem = {
      id: 'cert_' + Date.now(),
      name: newCertName.trim(),
      date: newCertDate.trim(),
      authority: newCertAuthority.trim(),
    };
    onChangeCertificates([...certificates, item]);
    setNewCertName('');
    setNewCertAuthority('');
  };

  const handleAddLang = () => {
    if (!newLangName.trim()) return;
    const item: LanguageItem = {
      id: 'lang_' + Date.now(),
      language: newLangName.trim(),
      proficiency: newLangProf.trim(),
    };
    onChangeLanguages([...languages, item]);
    setNewLangName('');
  };

  return (
    <div className="space-y-6 text-xs">
      {onUpdateSectionTitle && (
        <SectionTitleBar
          sectionKey="certs"
          currentTitle={sectionTitle}
          onUpdateTitle={onUpdateSectionTitle}
          icon={<Award className="w-4 h-4" />}
          subtitle="可自由修改为：荣誉证书与语言、荣誉资质、资质与语言水平等"
        />
      )}

      {/* Certificates */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-slate-200 pb-1.5">
          <Award className="w-4 h-4 text-blue-600" />
          资格证书与竞赛荣誉
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <input
            type="text"
            value={newCertName}
            onChange={(e) => setNewCertName(e.target.value)}
            placeholder="证书/奖项名称 (如: AWS认证架构师)"
            className="sm:col-span-2 px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div className="flex gap-1.5">
            <input
              type="text"
              value={newCertDate}
              onChange={(e) => setNewCertDate(e.target.value)}
              placeholder="获取年份 (2023.05)"
              className="w-24 px-2 py-1.5 bg-white border border-slate-300 rounded font-mono text-center"
            />
            <button
              type="button"
              onClick={handleAddCert}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              添加
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-lg shadow-2xs"
            >
              <div>
                <span className="font-semibold text-slate-900">{cert.name}</span>
                {cert.authority && <span className="text-slate-500 ml-2">({cert.authority})</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-mono text-[11px]">{cert.date}</span>
                <button
                  type="button"
                  onClick={() => onChangeCertificates(certificates.filter((c) => c.id !== cert.id))}
                  className="text-slate-300 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-slate-200 pb-1.5">
          <Languages className="w-4 h-4 text-blue-600" />
          语言能力
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <input
            type="text"
            value={newLangName}
            onChange={(e) => setNewLangName(e.target.value)}
            placeholder="语言 (如: 英语 / 日语 / 法语)"
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            value={newLangProf}
            onChange={(e) => setNewLangProf(e.target.value)}
            placeholder="熟练度 (如: 雅思7.5 / 商务流利)"
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddLang}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            添加语言
          </button>
        </div>

        <div className="space-y-1.5">
          {languages.map((lang) => (
            <div
              key={lang.id}
              className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-lg shadow-2xs"
            >
              <div>
                <span className="font-semibold text-slate-900">{lang.language}</span>
                <span className="text-slate-600 ml-2">· {lang.proficiency}</span>
              </div>
              <button
                type="button"
                onClick={() => onChangeLanguages(languages.filter((l) => l.id !== lang.id))}
                className="text-slate-300 hover:text-red-500 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
