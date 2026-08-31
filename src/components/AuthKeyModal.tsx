import React, { useState, useEffect, useRef } from 'react';
import { Lock, KeyRound, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';

interface AuthKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// SHA-256 hash of the secret key ("0320")
const AUTHOR_HASH = '1b8ba0b107410f67c70ab6ed4abf4e0ec0e70df78298e41d1670c7c1e94a703f';
export const AUTH_STORAGE_KEY = 'resume_author_unlocked';

// Simple async SHA-256 hasher for client verification
const hashKey = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const isAuthorUnlocked = (): boolean => {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

export const saveAuthorUnlocked = (): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
  } catch (e) {
    console.error('Failed to save auth state to localStorage', e);
  }
};

export const AuthKeyModal: React.FC<AuthKeyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [inputKey, setInputKey] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputKey('');
      setErrorMsg('');
      setIsSuccess(false);
      setIsVerifying(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanKey = inputKey.trim().replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));

    if (!cleanKey) {
      setErrorMsg('请输入授权访问密钥');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    try {
      const hashedInput = await hashKey(cleanKey);
      if (hashedInput === AUTHOR_HASH || cleanKey === '0320') {
        setIsSuccess(true);
        saveAuthorUnlocked();
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 600);
      } else {
        setErrorMsg('密钥错误，无权访问');
        inputRef.current?.select();
      }
    } catch {
      // Fallback
      if (cleanKey === '0320') {
        setIsSuccess(true);
        saveAuthorUnlocked();
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 600);
      } else {
        setErrorMsg('密钥错误，无权访问');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
          title="关闭"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            {isSuccess ? (
              <ShieldCheck className="w-6 h-6 text-emerald-600 animate-bounce" />
            ) : (
              <KeyRound className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              授权验证
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              此功能需要专属授权密钥。验证通过后本设备将永久记住权限。
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              访问密钥
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                ref={inputRef}
                type="password"
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="请输入访问密钥"
                maxLength={20}
                className={`w-full pl-9.5 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-mono tracking-widest text-slate-900 focus:outline-hidden transition-all ${
                  errorMsg 
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/20' 
                    : isSuccess
                    ? 'border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-emerald-50/20'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              />
            </div>
            {errorMsg && (
              <div className="flex items-center gap-1 text-xs text-red-600 mt-1.5 font-medium animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {isSuccess && (
              <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1.5 font-medium animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>验证成功，正在进入...</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSuccess || isVerifying}
              className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-xs hover:shadow-md cursor-pointer transition-all disabled:opacity-80 flex items-center gap-1.5"
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>已解锁</span>
                </>
              ) : isVerifying ? (
                <span>验证中...</span>
              ) : (
                <span>确认</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
