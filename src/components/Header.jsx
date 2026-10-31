import React from 'react';
import {
  Kanban,
  Plus,
  Search,
  RotateCcw,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  CircleDot,
  X,
} from 'lucide-react';
import { PRIORITIES } from '../utils/taskHelpers';

export default function Header({
  stats,
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  onAddTask,
  onResetDemo,
}) {
  return (
    <header className="bg-white border-b border-slate-200/80 shadow-2xs sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar Row */}
        <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm ring-4 ring-indigo-50">
              <Kanban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  TaskFlow
                </h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Kanban
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Organize work, priorities, and deadlines with smart drag & drop
              </p>
            </div>
          </div>

          {/* Action Buttons: Add Task & Reset Demo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onResetDemo}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
              title="Reset sample tasks"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset Demo Tasks</span>
              <span className="sm:hidden">Reset</span>
            </button>

            <button
              type="button"
              onClick={() => onAddTask('todo')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm transition-all hover:shadow-md cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Filter and Metric Overview Sub-row */}
        <div className="py-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Quick Metrics Pills */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-slate-500 font-medium mr-1">Tasks:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              Total {stats.total}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium border border-indigo-200">
              <CircleDot className="w-3 h-3 text-indigo-500" />
              To Do {stats.todo}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-medium border border-amber-200">
              <Clock className="w-3 h-3 text-amber-500" />
              In Progress {stats.inProgress}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              Completed {stats.completed}
            </span>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="p-1 text-slate-400 hover:text-slate-600 absolute right-1.5 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(e) => onPriorityFilterChange(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-pointer focus:bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-colors"
                aria-label="Filter tasks by priority"
              >
                <option value="All">All Priorities</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p} Priority
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

