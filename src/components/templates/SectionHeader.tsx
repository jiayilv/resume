import React from 'react';
import { HeaderStyle } from '../../types';

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  primaryColor?: string;
  headerStyle?: HeaderStyle;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  primaryColor = '#1e40af',
  headerStyle = 'underline',
  className = '',
}) => {
  switch (headerStyle) {
    case 'left-bar':
      return (
        <div className={`flex items-center gap-2 pb-1 mb-2.5 ${className}`}>
          <span
            className="w-1.5 h-4.5 rounded-xs shrink-0"
            style={{ backgroundColor: primaryColor }}
          />
          {icon && <span style={{ color: primaryColor }}>{icon}</span>}
          <h2
            className="font-bold text-sm tracking-wide uppercase text-slate-900"
          >
            {title}
          </h2>
        </div>
      );

    case 'pill':
      return (
        <div className={`flex items-center mb-2.5 ${className}`}>
          <div
            className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-white text-xs font-bold shadow-2xs"
            style={{ backgroundColor: primaryColor }}
          >
            {icon && <span className="scale-90">{icon}</span>}
            <span>{title}</span>
          </div>
        </div>
      );

    case 'double-line':
      return (
        <div
          className={`flex items-center justify-between border-y py-1 mb-2.5 ${className}`}
          style={{ borderColor: `${primaryColor}40` }}
        >
          <div className="flex items-center gap-2">
            {icon && <span style={{ color: primaryColor }}>{icon}</span>}
            <h2
              className="font-bold text-sm tracking-wider uppercase"
              style={{ color: primaryColor }}
            >
              {title}
            </h2>
          </div>
          <span className="text-[10px] text-slate-300 tracking-widest">///</span>
        </div>
      );

    case 'minimal':
      return (
        <div className={`flex items-center gap-2 mb-2 ${className}`}>
          {icon && <span style={{ color: primaryColor }}>{icon}</span>}
          <h2
            className="font-bold text-sm tracking-wide uppercase text-slate-900"
          >
            {title}
          </h2>
        </div>
      );

    case 'academic':
      return (
        <div className={`flex items-center gap-3 my-2 ${className}`}>
          <div className="flex-1 h-px bg-slate-300" />
          <div className="flex items-center gap-1.5">
            {icon && <span style={{ color: primaryColor }}>{icon}</span>}
            <h2
              className="font-bold text-xs tracking-widest uppercase text-slate-900"
            >
              {title}
            </h2>
          </div>
          <div className="flex-1 h-px bg-slate-300" />
        </div>
      );

    case 'underline':
    default:
      return (
        <div
          className={`flex items-center gap-2 border-b pb-1 mb-2.5 ${className}`}
          style={{ borderColor: `${primaryColor}40` }}
        >
          {icon && <span style={{ color: primaryColor }}>{icon}</span>}
          <h2
            className="font-bold text-sm tracking-wide uppercase"
            style={{ color: primaryColor }}
          >
            {title}
          </h2>
        </div>
      );
  }
};
