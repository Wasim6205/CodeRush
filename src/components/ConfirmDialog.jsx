import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title = 'Delete Task',
  message = 'Are you sure you want to delete this task? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = true,
}) {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus confirm button when dialog opens
    const timer = setTimeout(() => {
      confirmBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-full shrink-0 ${
                isDestructive
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-amber-100 text-amber-600'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3
                  id="confirm-dialog-title"
                  className="text-lg font-semibold text-slate-900"
                >
                  {title}
                </h3>
                <button
                  type="button"
                  onClick={onCancel}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-slate-400"
          >
            {cancelText}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 focus:ring-indigo-500'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

