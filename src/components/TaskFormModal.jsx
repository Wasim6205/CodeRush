import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Flag, AlignLeft, CheckCircle2 } from 'lucide-react';
import {
  STATUSES,
  STATUS_CONFIG,
  PRIORITIES,
  PRIORITY_CONFIG,
  getTodayDateString,
  getFutureDateString,
} from '../utils/taskHelpers';

export default function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialTask = null,
  defaultStatus = 'todo',
}) {
  const isEditing = Boolean(initialTask);
  const titleInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('todo');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  // Initialize or reset form state when modal opens or initialTask changes
  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        setTitle(initialTask.title || '');
        setDescription(initialTask.description || '');
        setPriority(initialTask.priority || 'Medium');
        setDueDate(initialTask.dueDate || '');
        setStatus(initialTask.status || 'todo');
      } else {
        setTitle('');
        setDescription('');
        setPriority('Medium');
        setDueDate('');
        setStatus(STATUSES.includes(defaultStatus) ? defaultStatus : 'todo');
      }
      setError('');
      setTouched(false);

      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialTask, defaultStatus]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    if (!title.trim()) {
      setError('Task title is required.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);

    if (!validate()) {
      titleInputRef.current?.focus();
      return;
    }

    try {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate,
        status,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save task.');
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (touched) {
      if (!e.target.value.trim()) {
        setError('Task title is required.');
      } else {
        setError('');
      }
    }
  };

  const handleSetQuickDate = (dateVal) => {
    setDueDate(dateVal);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in zoom-in-95 duration-150 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Update task details and assign priority or status'
                : 'Add a new task to your Kanban board'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title Field */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              ref={titleInputRef}
              id="task-title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={() => setTouched(true)}
              placeholder="e.g., Conduct customer user interviews"
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl shadow-2xs transition-colors placeholder:text-slate-400 focus:outline-hidden focus:ring-2 ${
                error
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {error && (
              <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1">
                <span>⚠</span> {error}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="task-description"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5"
            >
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
              Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              id="task-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key milestones, acceptance criteria, or links..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl shadow-2xs transition-colors placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-y min-h-[75px]"
            />
          </div>

          {/* Priority Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-slate-400" />
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {PRIORITIES.map((p) => {
                const conf = PRIORITY_CONFIG[p];
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? `${conf.badgeClass} ring-2 ring-offset-1 font-semibold shadow-2xs`
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold">{conf.symbol}</span>
                    <span>{conf.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two-Column Grid: Due Date & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Due Date */}
            <div>
              <label
                htmlFor="task-due-date"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Due Date
              </label>
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl shadow-2xs focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              {/* Quick Date Presets */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleSetQuickDate(getTodayDateString())}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickDate(getFutureDateString(1))}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickDate(getFutureDateString(7))}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                >
                  Next Week
                </button>
                {dueDate && (
                  <button
                    type="button"
                    onClick={() => handleSetQuickDate('')}
                    className="text-[11px] px-2 py-0.5 rounded-md text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Status Field */}
            <div>
              <label
                htmlFor="task-status"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Column Status
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl shadow-2xs focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_CONFIG[s].label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-2">
                Task will appear in the {STATUS_CONFIG[status]?.label || 'selected'} column.
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors shadow-2xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

