import assert from 'node:assert';
import {
  STATUSES,
  PRIORITIES,
  generateId,
  formatDate,
  getDueDateStatus,
  INITIAL_DEMO_TASKS,
  STORAGE_KEY,
} from '../src/utils/taskHelpers.js';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  resetTasksStorage,
  clearTasksStorage,
} from '../src/utils/storage.js';

console.log('🧪 Starting Verification Tests...\n');

// 1. Verify Statuses
assert.deepStrictEqual(
  STATUSES,
  ['todo', 'in-progress', 'completed'],
  'STATUSES must match ["todo", "in-progress", "completed"]'
);
console.log('✓ STATUSES check passed');

// 2. Verify Priorities
assert.deepStrictEqual(
  PRIORITIES,
  ['Low', 'Medium', 'High'],
  'PRIORITIES must match ["Low", "Medium", "High"]'
);
console.log('✓ PRIORITIES check passed');

// 3. Verify Unique ID generation
const id1 = generateId();
const id2 = generateId();
assert.ok(id1 && typeof id1 === 'string', 'generateId must return a string');
assert.notStrictEqual(id1, id2, 'generateId must generate unique IDs');
console.log('✓ generateId uniqueness check passed');

// 4. Verify Date Formatting & Due Date Status
assert.strictEqual(formatDate('2026-11-01'), 'Nov 1, 2026');
console.log('✓ formatDate check passed');

// Past date should be overdue if not completed
const pastDue = getDueDateStatus('2020-01-01', 'todo');
assert.strictEqual(pastDue.isOverdue, true, 'Past date must be overdue');
assert.strictEqual(pastDue.hasDueDate, true);

// Past date should NOT be overdue if completed
const pastCompleted = getDueDateStatus('2020-01-01', 'completed');
assert.strictEqual(pastCompleted.isOverdue, false, 'Completed tasks must never be marked overdue');
assert.strictEqual(pastCompleted.isCompleted, true);

console.log('✓ getDueDateStatus overdue and completed checks passed');

// 5. Test Mock localStorage and Storage Resilience
const mockStore = {};
globalThis.window = {
  localStorage: {
    getItem: (key) => mockStore[key] ?? null,
    setItem: (key, val) => {
      mockStore[key] = String(val);
    },
    removeItem: (key) => {
      delete mockStore[key];
    },
  },
};

// Initial load without existing data should return demo tasks and seed storage
const initial = loadTasksFromStorage();
assert.ok(Array.isArray(initial) && initial.length > 0, 'Should load demo tasks on clean start');
assert.ok(mockStore[STORAGE_KEY], 'Should persist demo tasks to storage');
console.log('✓ Initial localStorage seeding check passed');

// Save modified tasks
const testTasks = [
  {
    id: 'test-1',
    title: 'Test Task 1',
    description: 'Test desc',
    priority: 'High',
    dueDate: '2026-12-01',
    status: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
saveTasksToStorage(testTasks);
const reloaded = loadTasksFromStorage();
assert.strictEqual(reloaded.length, 1);
assert.strictEqual(reloaded[0].title, 'Test Task 1');
console.log('✓ saveTasksToStorage & loadTasksFromStorage check passed');

// Malformed JSON should not crash and should safely recover
mockStore[STORAGE_KEY] = 'INVALID_JSON{{{';
const recoveredFromMalformed = loadTasksFromStorage();
assert.ok(Array.isArray(recoveredFromMalformed), 'Must return array on corrupt JSON without throwing');
console.log('✓ Malformed JSON recovery check passed');

// Non-array JSON should not crash
mockStore[STORAGE_KEY] = JSON.stringify({ not: 'an array' });
const recoveredFromNonArray = loadTasksFromStorage();
assert.ok(Array.isArray(recoveredFromNonArray), 'Must return array on non-array JSON without throwing');
console.log('✓ Non-array JSON recovery check passed');

console.log('\n🎉 ALL LOGIC AND PERSISTENCE TESTS PASSED SUCCESSFULLY!');

