import React, { useEffect } from 'react';

export default function Toast({ open, type = 'info', message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);
  if (!open) return null;
  const base = 'fixed top-4 right-4 z-50 min-w-[240px] max-w-sm rounded-lg shadow-lg px-4 py-3 text-sm flex items-start gap-3 ring-1 backdrop-blur-sm';
  const styles = {
    success: 'bg-green-600/20 text-green-200 ring-green-500/40',
    error: 'bg-red-600/20 text-red-200 ring-red-500/40',
    info: 'bg-black/60 text-gray-200 ring-white/20',
  };
  return (
    <div className={`${base} ${styles[type] || styles.info}`}>\n      <span className="flex-1 leading-relaxed">{message}</span>\n      <button onClick={onClose} className="rounded px-2 py-1 text-xs hover:bg-white/10">✕</button>\n    </div>
  );
}

