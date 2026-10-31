import React, { useState } from 'react';
import { Plus, Inbox, CheckCircle2, CircleDot, Clock } from 'lucide-react';
import TaskCard from './TaskCard';
import { STATUS_CONFIG } from '../utils/taskHelpers';

export default function KanbanColumn({
  status,
  tasks = [],
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onAddTask,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.todo;

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Check if leaving the column element entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onMoveTask(taskId, status);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'todo':
        return <CircleDot className="w-4 h-4 text-indigo-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return null;
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col bg-slate-100/90 rounded-2xl border transition-all duration-200 min-h-[500px] ${
        isDragOver
          ? 'border-indigo-400 bg-indigo-50/40 ring-2 ring-indigo-300 shadow-md'
          : 'border-slate-200/80 shadow-2xs'
      }`}
      aria-label={`${config.label} column, ${tasks.length} tasks`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-slate-200/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {getStatusIcon()}
          <h2 className="font-semibold text-slate-900 text-sm tracking-tight">
            {config.label}
          </h2>
          {/* Task Count Badge */}
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs min-w-[22px] text-center"
            title={`${tasks.length} tasks in ${config.label}`}
          >
            {tasks.length}
          </span>
        </div>

        {/* Quick Add Task Button for this Column */}
        <button
          type="button"
          onClick={() => onAddTask(status)}
          className="p-1 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white active:bg-slate-200 transition-colors shadow-2xs border border-transparent hover:border-slate-200 cursor-pointer"
          title={`Add task to ${config.label}`}
          aria-label={`Add task to ${config.label}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task List / Drop Zone */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {/* Drop target indicator when dragging over */}
        {isDragOver && (
          <div className="p-3 border-2 border-dashed border-indigo-400 rounded-xl bg-indigo-100/40 text-center text-xs font-medium text-indigo-700 animate-pulse">
            Drop task here to move to {config.label}
          </div>
        )}

        {/* Render Task Cards */}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onMove={onMoveTask}
          />
        ))}

        {/* Empty State */}
        {tasks.length === 0 && !isDragOver && (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200/80 rounded-xl bg-white/40">
            <div className="p-3 rounded-full bg-slate-100 text-slate-400 mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="text-xs font-medium text-slate-600">
              No tasks in {config.label}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[180px]">
              Drag a task here or click below to create one.
            </p>
            <button
              type="button"
              onClick={() => onAddTask(status)}
              className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

