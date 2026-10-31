import { STORAGE_KEY, INITIAL_DEMO_TASKS, STATUSES } from './taskHelpers.js';

/**
 * Validates a single task object shape
 */
function isValidTask(task) {
  return (
    task &&
    typeof task === 'object' &&
    typeof task.id === 'string' &&
    task.id.trim() !== '' &&
    typeof task.title === 'string' &&
    task.title.trim() !== '' &&
    STATUSES.includes(task.status)
  );
}

/**
 * Safely loads tasks from localStorage.
 * Returns initial demo tasks if nothing is stored or if stored data is corrupted.
 */
export function loadTasksFromStorage() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return INITIAL_DEMO_TASKS;
  }

  try {
    const rawData = window.localStorage.getItem(STORAGE_KEY);
    if (rawData === null) {
      // First visit - seed with demo tasks and persist
      saveTasksToStorage(INITIAL_DEMO_TASKS);
      return INITIAL_DEMO_TASKS;
    }

    const parsed = JSON.parse(rawData);
    if (Array.isArray(parsed)) {
      // Filter out invalid items to prevent runtime crashes
      const validTasks = parsed.filter(isValidTask);
      return validTasks;
    }

    // Corrupted non-array data
    console.warn(`[TaskFlow] Stored data under key "${STORAGE_KEY}" was not an array. Resetting to demo tasks.`);
    saveTasksToStorage(INITIAL_DEMO_TASKS);
    return INITIAL_DEMO_TASKS;
  } catch (error) {
    console.error(`[TaskFlow] Failed to parse tasks from localStorage:`, error);
    return INITIAL_DEMO_TASKS;
  }
}

/**
 * Safely saves tasks to localStorage.
 */
export function saveTasksToStorage(tasks) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    const serialized = JSON.stringify(tasks);
    window.localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.error(`[TaskFlow] Failed to write tasks to localStorage:`, error);
    return false;
  }
}

/**
 * Resets storage back to initial demo tasks.
 */
export function resetTasksStorage() {
  saveTasksToStorage(INITIAL_DEMO_TASKS);
  return INITIAL_DEMO_TASKS;
}

/**
 * Clears all tasks in storage.
 */
export function clearTasksStorage() {
  saveTasksToStorage([]);
  return [];
}
