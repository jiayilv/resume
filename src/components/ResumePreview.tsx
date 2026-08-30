import React, { forwardRef } from 'react';
import { ResumeData, ThemeConfig } from '../types';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { ModernTechTemplate } from './templates/ModernTechTemplate';
import { SidebarEliteTemplate } from './templates/SidebarEliteTemplate';
import { NordicMinimalTemplate } from './templates/NordicMinimalTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { AcademicTemplate } from './templates/AcademicTemplate';

interface ResumePreviewProps {
  data: ResumeData;
  theme: ThemeConfig;
  scale?: number;
  showPageBreakLine?: boolean;
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ data, theme, scale = 1, showPageBreakLine = true }, ref) => {
    const renderTemplate = () => {
      switch (theme.templateId) {
        case 'modern':
          return <ModernTechTemplate data={data} theme={theme} />;
        case 'sidebar':
          return <SidebarEliteTemplate data={data} theme={theme} />;
        case 'minimal':
          return <NordicMinimalTemplate data={data} theme={theme} />;
        case 'executive':
          return <ExecutiveTemplate data={data} theme={theme} />;
        case 'academic':
          return <AcademicTemplate data={data} theme={theme} />;
        case 'classic':
        default:
          return <ClassicTemplate data={data} theme={theme} />;
      }
    };

    return (
      <div className="flex justify-center items-start w-full py-4 overflow-auto">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="transition-transform"
        >
          {/* Printable A4 Canvas Container */}
          <div
            ref={ref}
            id="resume-canvas"
            className="resume-print-wrapper relative bg-white shadow-2xl rounded-sm w-[210mm] min-h-[297mm] mx-auto text-slate-800 selection:bg-blue-100"
            style={{
              boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.08)',
            }}
          >
            {/* Template Body */}
            {renderTemplate()}

            {/* Subtle A4 Page Height Guide (Hidden in Print) */}
            {showPageBreakLine && (
              <div 
                className="no-print absolute left-0 right-0 pointer-events-none border-b-2 border-dashed border-red-300/60 z-30"
                style={{ top: '297mm' }}
              >
                <span className="absolute right-2 -top-5 bg-red-50 text-red-600 border border-red-200 text-[10px] px-2 py-0.5 rounded font-mono shadow-xs">
                  --- A4 第一页截断线 ---
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';
