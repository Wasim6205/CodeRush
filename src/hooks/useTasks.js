import { useState, useEffect, useCallback } from 'react';
import {
  STATUSES,
  PRIORITIES,
  generateId,
  INITIAL_DEMO_TASKS,
} from '../utils/taskHelpers.js';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  resetTasksStorage,
  clearTasksStorage,
} from '../utils/storage.js';

export function useTasks() {
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());

  // Keep localStorage synchronized whenever tasks state changes
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  /**
   * Create a new task and add it to the board
   */
  const createTask = useCallback((taskData) => {
    const trimmedTitle = (taskData.title || '').trim();
    if (!trimmedTitle) {
      throw new Error('Task title cannot be empty.');
    }

    const initialStatus = STATUSES.includes(taskData.status) ? taskData.status : 'todo';
    const priority = PRIORITIES.includes(taskData.priority) ? taskData.priority : 'Medium';
    const now = new Date().toISOString();

    const newTask = {
      id: generateId(),
      title: trimmedTitle,
      description: (taskData.description || '').trim(),
      priority,
      dueDate: taskData.dueDate || '',
      status: initialStatus,
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prev) => {
      const updated = [newTask, ...prev];
      saveTasksToStorage(updated);
      return updated;
    });

    return newTask;
  }, []);

  /**
   * Update an existing task without creating a duplicate
   */
  const updateTask = useCallback((id, updatedFields) => {
    if (!id) return;

    setTasks((prev) => {
      const index = prev.findIndex((t) => t.id === id);
      if (index === -1) return prev;

      const current = prev[index];
      const trimmedTitle = updatedFields.title !== undefined
        ? updatedFields.title.trim()
        : current.title;

      if (!trimmedTitle) {
        throw new Error('Task title cannot be empty.');
      }

      const updated = [...prev];
      updated[index] = {
        ...current,
        ...updatedFields,
        title: trimmedTitle,
        description: updatedFields.description !== undefined
          ? (updatedFields.description || '').trim()
          : current.description,
        priority: PRIORITIES.includes(updatedFields.priority)
          ? updatedFields.priority
          : current.priority,
        status: STATUSES.includes(updatedFields.status)
          ? updatedFields.status
          : current.status,
        dueDate: updatedFields.dueDate !== undefined ? (updatedFields.dueDate || '') : current.dueDate,
        updatedAt: new Date().toISOString(),
      };

      saveTasksToStorage(updated);
      return updated;
    });
  }, []);

  /**
   * Delete a task by ID
   */
  const deleteTask = useCallback((id) => {
    if (!id) return;
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTasksToStorage(updated);
      return updated;
    });
  }, []);

  /**
   * Move task to a new column status or specific position (drag & drop or manual mover)
   */
  const moveTask = useCallback((id, newStatus, targetTaskId = null) => {
    if (!id || !STATUSES.includes(newStatus)) return;

    setTasks((prev) => {
      const fromIndex = prev.findIndex((t) => t.id === id);
      if (fromIndex === -1) return prev;

      const movingTask = {
        ...prev[fromIndex],
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      // Remove moving task from list
      const remaining = prev.filter((t) => t.id !== id);

      // If dropped onto a specific target card, insert relative to it
      if (targetTaskId && targetTaskId !== id) {
        const toIndex = remaining.findIndex((t) => t.id === targetTaskId);
        if (toIndex !== -1) {
          remaining.splice(toIndex, 0, movingTask);
          saveTasksToStorage(remaining);
          return remaining;
        }
      }

      // If moving to a status without specific target card, place at beginning of that status
      const targetColumnIndex = remaining.findIndex((t) => t.status === newStatus);
      if (targetColumnIndex !== -1) {
        remaining.splice(targetColumnIndex, 0, movingTask);
      } else {
        remaining.unshift(movingTask);
      }

      saveTasksToStorage(remaining);
      return remaining;
    });
  }, []);

  /**
   * Restore demo tasks
   */
  const resetDemoTasks = useCallback(() => {
    const freshTasks = resetTasksStorage();
    setTasks(freshTasks);
  }, []);

  /**
   * Clear all tasks
   */
  const clearAllTasks = useCallback(() => {
    const emptyTasks = clearTasksStorage();
    setTasks(emptyTasks);
  }, []);

  // Column counts
  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  return {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    resetDemoTasks,
    clearAllTasks,
    stats,
  };
}
