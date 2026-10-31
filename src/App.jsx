import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';
import TaskFormModal from './components/TaskFormModal';
import ConfirmDialog from './components/ConfirmDialog';
import { useTasks } from './hooks/useTasks';
import { STATUS_CONFIG } from './utils/taskHelpers';
import { Check, Info, Sparkles, FilterX } from 'lucide-react';

export default function App() {
  const {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    resetDemoTasks,
    clearAllTasks,
    stats,
  } = useTasks();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Form Modal State (Add / Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  // Delete Confirmation State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Transient Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage((current) => (current?.message === message ? null : current));
    }, 3000);
  };

  // Filter tasks based on search and priority
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Priority filter
      if (priorityFilter !== 'All' && task.priority !== priorityFilter) {
        return false;
      }
      // Search query filter (matches title or description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = (task.description || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [tasks, searchQuery, priorityFilter]);

  // Open Add Modal
  const handleOpenAdd = (status = 'todo') => {
    setEditingTask(null);
    setDefaultStatus(status);
    setIsFormOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  // Open Delete Dialog
  const handleOpenDelete = (task) => {
    setTaskToDelete(task);
    setIsConfirmOpen(true);
  };

  // Handle Form Submit (Create or Edit)
  const handleFormSubmit = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      showToast(`Updated "${taskData.title}"`);
    } else {
      const created = createTask(taskData);
      showToast(`Created task "${created.title}"`);
    }
  };

  // Handle Confirmed Delete
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      const title = taskToDelete.title;
      deleteTask(taskToDelete.id);
      setIsConfirmOpen(false);
      setTaskToDelete(null);
      showToast(`Deleted "${title}"`, 'info');
    }
  };

  // Handle Status Move (Drag & drop or manual dropdown/arrow button)
  const handleMoveTask = (id, targetStatus, targetTaskId = null) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      moveTask(id, targetStatus, targetTaskId);
      if (task.status !== targetStatus) {
        showToast(`Moved "${task.title}" to ${STATUS_CONFIG[targetStatus]?.label || targetStatus}`);
      } else if (targetTaskId && targetTaskId !== id) {
        showToast(`Reordered "${task.title}"`);
      }
    }
  };

  // Reset Demo Tasks
  const handleResetDemo = () => {
    resetDemoTasks();
    setSearchQuery('');
    setPriorityFilter('All');
    showToast('Reset board to sample demo tasks');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-medium shadow-xl border border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
          {toastMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Info className="w-4 h-4 text-sky-400" />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Top Application Header */}
      <Header
        stats={stats}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        onAddTask={handleOpenAdd}
        onResetDemo={handleResetDemo}
      />

      {/* Main Board Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Active Filter Notice */}
        {(searchQuery || priorityFilter !== 'All') && (
          <div className="mb-6 px-4 py-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 flex items-center justify-between text-xs text-indigo-900">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">Filtered View:</span>
              <span>
                Showing {filteredTasks.length} of {tasks.length} total tasks
              </span>
              {searchQuery && (
                <span className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 font-medium">
                  Search: "{searchQuery}"
                </span>
              )}
              {priorityFilter !== 'All' && (
                <span className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 font-medium">
                  Priority: {priorityFilter}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setPriorityFilter('All');
              }}
              className="inline-flex items-center gap-1 text-indigo-700 hover:text-indigo-900 font-semibold underline underline-offset-2 cursor-pointer"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}

        {/* Empty Search/Filter State */}
        {filteredTasks.length === 0 && tasks.length > 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/60 p-8 max-w-md mx-auto">
            <div className="p-3.5 rounded-full bg-slate-100 text-slate-400 inline-flex mb-3">
              <FilterX className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No matching tasks</h3>
            <p className="text-xs text-slate-500 mt-1">
              No tasks match your current filter criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setPriorityFilter('All');
              }}
              className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <KanbanBoard
            tasks={filteredTasks}
            onEditTask={handleOpenEdit}
            onDeleteTask={handleOpenDelete}
            onMoveTask={handleMoveTask}
            onAddTask={handleOpenAdd}
          />
        )}
      </main>

      {/* Helpful Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/70 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              <strong>Tip:</strong> Drag and drop cards between columns or use the quick status controls on each card.
            </span>
          </p>
          <p className="text-slate-400">
            Tasks automatically persist in localStorage ({stats.total} total)
          </p>
        </div>
      </footer>

      {/* Task Creation & Editing Modal */}
      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialTask={editingTask}
        defaultStatus={defaultStatus}
      />

      {/* Deletion Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Task"
        message={
          taskToDelete
            ? `Are you sure you want to permanently delete "${taskToDelete.title}"? This action cannot be undone.`
            : 'Are you sure you want to delete this task?'
        }
        confirmText="Delete Task"
        cancelText="Keep Task"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setTaskToDelete(null);
        }}
        isDestructive={true}
      />
    </div>
  );
}
