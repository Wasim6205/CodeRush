export const STATUSES = ['todo', 'in-progress', 'completed'];

export const STATUS_CONFIG = {
  todo: {
    id: 'todo',
    label: 'To Do',
    description: 'Tasks waiting to be started',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dotClass: 'bg-indigo-500',
    dropHighlightClass: 'border-indigo-400 bg-indigo-50/40 ring-2 ring-indigo-300',
    accentBorder: 'border-t-4 border-t-indigo-500',
  },
  'in-progress': {
    id: 'in-progress',
    label: 'In Progress',
    description: 'Work currently underway',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
    dropHighlightClass: 'border-amber-400 bg-amber-50/40 ring-2 ring-amber-300',
    accentBorder: 'border-t-4 border-t-amber-500',
  },
  completed: {
    id: 'completed',
    label: 'Completed',
    description: 'Finished tasks',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
    dropHighlightClass: 'border-emerald-400 bg-emerald-50/40 ring-2 ring-emerald-300',
    accentBorder: 'border-t-4 border-t-emerald-500',
  },
};

export const PRIORITIES = ['Low', 'Medium', 'High'];

export const PRIORITY_CONFIG = {
  High: {
    label: 'High',
    level: 3,
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    indicatorDot: 'bg-rose-500',
    symbol: '▲',
  },
  Medium: {
    label: 'Medium',
    level: 2,
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    indicatorDot: 'bg-amber-500',
    symbol: '■',
  },
  Low: {
    label: 'Low',
    level: 1,
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    indicatorDot: 'bg-sky-500',
    symbol: '▼',
  },
};

export const STORAGE_KEY = 'coderush-kanban-tasks';

export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return dateString;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getDueDateStatus(dueDate, status) {
  if (!dueDate) {
    return { hasDueDate: false, isOverdue: false, isToday: false, formatted: '' };
  }

  const formatted = formatDate(dueDate);

  // If already completed, not considered overdue
  if (status === 'completed') {
    return {
      hasDueDate: true,
      isOverdue: false,
      isToday: false,
      formatted,
      isCompleted: true,
    };
  }

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const isToday = dueDate === todayStr;
  const isOverdue = dueDate < todayStr;

  return {
    hasDueDate: true,
    isOverdue,
    isToday,
    formatted,
    isCompleted: false,
  };
}

export function getTodayDateString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function getFutureDateString(daysAhead = 1) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getPastDateString(daysAgo = 2) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const INITIAL_DEMO_TASKS = [
  {
    id: 'demo-task-1',
    title: 'Design user onboarding flow',
    description: 'Create wireframes and interactive prototypes for first-time sign-in walkthrough.',
    priority: 'High',
    dueDate: getFutureDateString(3),
    status: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-task-2',
    title: 'Audit accessibility compliance',
    description: 'Ensure color contrast ratios, keyboard navigation, and ARIA labels satisfy WCAG 2.1 AA.',
    priority: 'Medium',
    dueDate: getPastDateString(1), // Demonstrates overdue indicator cleanly
    status: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-task-3',
    title: 'Implement drag-and-drop task movement',
    description: 'Wire up native HTML5 drag and drop events across board columns with drop target feedback.',
    priority: 'High',
    dueDate: getTodayDateString(), // Demonstrates due today indicator
    status: 'in-progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-task-4',
    title: 'Refactor state management hook',
    description: 'Optimize task updates and ensure safe localStorage synchronization with error boundary.',
    priority: 'Low',
    dueDate: getFutureDateString(5),
    status: 'in-progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-task-5',
    title: 'Project scaffold and Tailwind setup',
    description: 'Initialize Vite + React development environment and verify production build assets.',
    priority: 'Medium',
    dueDate: getPastDateString(2),
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

