import React from 'react';
import { UserProfile, ThemeConfig } from '../types';

interface ResumeAvatarProps {
  profile: UserProfile;
  theme?: ThemeConfig;
  className?: string;
  size?: 'standard' | 'large' | 'small'; // standard is 25mm x 35mm
}

export const ResumeAvatar: React.FC<ResumeAvatarProps> = ({
  profile,
  theme,
  className = '',
  size = 'standard',
}) => {
  if (!profile.showAvatar) return null;

  const shape = theme?.avatarShape || 'rounded';
  const avatarRadiusClass =
    shape === 'circle' ? 'rounded-full' : shape === 'rounded' ? 'rounded-xl' : 'rounded-none';

  const primaryColor = theme?.primaryColor || '#1e40af';
  const avatarFit = profile.avatarFit || 'cover';
  const avatarScale = profile.avatarScale ?? 100;
  const avatarPosition = profile.avatarPosition || 'center';

  const dimensions =
    size === 'large'
      ? { width: '28mm', height: '39.2mm' }
      : size === 'small'
      ? { width: '22mm', height: '30.8mm' }
      : { width: '25mm', height: '35mm' };

  return (
    <div
      className={`shrink-0 overflow-hidden border shadow-2xs ${avatarRadiusClass} bg-white flex items-center justify-center relative ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        borderColor: primaryColor ? `${primaryColor}60` : '#cbd5e1',
      }}
    >
      {profile.avatar ? (
        <div className="w-full h-full overflow-hidden flex items-center justify-center bg-white relative">
          <img
            src={profile.avatar}
            alt={profile.name || '证件照'}
            style={{
              objectFit: avatarFit,
              objectPosition: avatarPosition,
              transform: `scale(${avatarScale / 100})`,
              transformOrigin:
                avatarPosition === 'top'
                  ? 'top center'
                  : avatarPosition === 'bottom'
                  ? 'bottom center'
                  : 'center center',
            }}
            className={`w-full h-full select-none pointer-events-none transition-transform ${
              avatarFit === 'contain' ? 'p-0.5' : ''
            }`}
          />
        </div>
      ) : (
        <div className="w-full h-full border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 p-1 text-center select-none">
          <span className="text-[9px] font-medium text-slate-500">1寸照片</span>
          <span className="text-[7.5px] text-slate-400">25×35mm</span>
        </div>
      )}
    </div>
  );
};
