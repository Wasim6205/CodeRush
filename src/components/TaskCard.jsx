import React, { useState } from 'react';
import {
  Calendar,
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  GripVertical,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import {
  STATUSES,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  getDueDateStatus,
} from '../utils/taskHelpers.js';

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onMove,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOverCard, setIsDragOverCard] = useState(false);

  const priorityConf = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium;
  const dueDateInfo = getDueDateStatus(task.dueDate, task.status);

  // Drag handlers for source
  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Drag handlers for drop target (allows dropping onto a card to reorder or switch status)
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOverCard) setIsDragOverCard(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOverCard(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverCard(false);
    const sourceTaskId = e.dataTransfer.getData('text/plain');
    if (sourceTaskId && sourceTaskId !== task.id) {
      onMove(sourceTaskId, task.status, task.id);
    }
  };

  // Status transitions for quick non-drag buttons
  const currentIndex = STATUSES.indexOf(task.status);
  const prevStatus = currentIndex > 0 ? STATUSES[currentIndex - 1] : null;
  const nextStatus = currentIndex < STATUSES.length - 1 ? STATUSES[currentIndex + 1] : null;

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative bg-white rounded-xl border transition-all duration-150 p-4 select-none ${
        isDragging
          ? 'opacity-40 scale-[0.98] ring-2 ring-indigo-400 shadow-lg border-indigo-300'
          : isDragOverCard
          ? 'border-indigo-400 ring-2 ring-indigo-200 bg-indigo-50/20 shadow-md'
          : 'border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300'
      }`}
      aria-label={`Task: ${task.title}`}
    >
      {/* Top Row: Priority Badge & Drag Handle */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        {/* Priority Badge with Label & Symbol (Accessible, not color alone) */}
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priorityConf.badgeClass}`}
          title={`Priority: ${priorityConf.label}`}
        >
          <span className="text-[10px] leading-none font-bold" aria-hidden="true">
            {priorityConf.symbol}
          </span>
          <span>{priorityConf.label} Priority</span>
        </span>

        {/* Drag Affordance Grip Icon */}
        <div
          className="text-slate-300 group-hover:text-slate-400 p-0.5 rounded cursor-grab active:cursor-grabbing transition-colors"
          title="Drag to move or reorder task"
          aria-hidden="true"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      {/* Task Title */}
      <h3 className="text-sm font-semibold text-slate-800 leading-snug break-words">
        {task.title}
      </h3>

      {/* Description (if present) */}
      {task.description && (
        <p className="mt-1.5 text-xs text-slate-600 leading-relaxed line-clamp-3 whitespace-pre-wrap break-words">
          {task.description}
        </p>
      )}

      {/* Due Date Indicator (clearly distinguishing overdue while preserving the date) */}
      {dueDateInfo.hasDueDate && (
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          {dueDateInfo.isOverdue ? (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-100/80 text-rose-700 border border-rose-200"
              title="This task is overdue"
            >
              <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
              <span>Overdue: {dueDateInfo.formatted}</span>
            </span>
          ) : dueDateInfo.isToday ? (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100/80 text-amber-800 border border-amber-200"
              title="This task is due today"
            >
              <Clock className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Due today: {dueDateInfo.formatted}</span>
            </span>
          ) : dueDateInfo.isCompleted ? (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
              title="Due date"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Due: {dueDateInfo.formatted}</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200"
              title="Due date"
            >
              <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
              <span>Due: {dueDateInfo.formatted}</span>
            </span>
          )}
        </div>
      )}

      {/* Card Footer: Non-drag Status Mover & Edit/Delete Actions */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Non-drag Move Action Alternative */}
        <div className="relative">
          <div className="flex items-center gap-1">
            {/* Quick step backward button */}
            {prevStatus && (
              <button
                type="button"
                onClick={() => onMove(task.id, prevStatus)}
                className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title={`Move to ${STATUS_CONFIG[prevStatus].label}`}
                aria-label={`Move backward to ${STATUS_CONFIG[prevStatus].label}`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Quick dropdown or selector for direct column hop */}
            <div className="relative inline-block">
              <select
                value={task.status}
                onChange={(e) => onMove(task.id, e.target.value)}
                className="text-[11px] font-medium text-slate-600 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 rounded-lg px-2 py-1 pr-5 appearance-none cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-indigo-400 transition-colors"
                aria-label="Change column status without dragging"
                title="Change column without dragging"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_CONFIG[s].label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick step forward button */}
            {nextStatus && (
              <button
                type="button"
                onClick={() => onMove(task.id, nextStatus)}
                className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title={`Move to ${STATUS_CONFIG[nextStatus].label}`}
                aria-label={`Move forward to ${STATUS_CONFIG[nextStatus].label}`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Edit and Delete Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 transition-colors cursor-pointer"
            title="Edit task"
            aria-label={`Edit task "${task.title}"`}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 active:bg-rose-100 transition-colors cursor-pointer"
            title="Delete task"
            aria-label={`Delete task "${task.title}"`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
