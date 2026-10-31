CodeRush Hackathon --- Smart Kanban Task Board
Build brief for Antigravity

Create a polished, fully working Kanban task-management web
application that satisfies the CodeRush Round 1 challenge. Prioritize
working functionality, speed, clarity, and a responsive interface. Do
not add unnecessary features that risk the 45-minute build target.

1. Challenge overview
Small teams need a simple way to organize work, priorities, and
deadlines.

Build a task board with three columns:
- To Do
- In Progress
- Completed
The CodeRush brief requires users to create tasks, view them in the
three columns, move tasks between columns (preferably with drag and
drop), edit and delete tasks, and retain tasks after a page refresh.

Time limit: 45 minutes
Round 1 maximum score: 100 points
2. Recommended technology
Use this stack unless the existing project already has an equivalent
setup:
- React with Vite
- JavaScript
- Tailwind CSS for styling
- localStorage for persistence
- Native HTML Drag and Drop API for moving tasks
Keep this as a frontend-only application. Do not add a backend,
authentication, database, or external API: none is required by the
supplied Round 1 brief.
3. Core requirements
3.1 Create a task
Provide a clear Add Task action that opens a modal or form.

Each task must support:

  Field         Requirement
  Title         Required, non-empty text
Description   Optional text
Priority      Priority selection, such as Low, Medium, High
Due date      Date input
Status        One of To Do, In Progress, Completed

On submission:
- Validate the title.
- Create a unique task ID.
- Set the initial status to To Do.
- Update the board immediately.
- Save the updated task list to localStorage.
- Close and reset the form after a successful save.
3.2 Display tasks in three columns
Show three clearly labelled columns:
1. To Do
2. In Progress
3. Completed
Each column should display only tasks whose status matches that column.
Show an empty state when a column has no tasks. Display a task count in
each column header.

Each task card should show:
- Title
- Description, when present
- Priority
- Due date, when present
- An Edit action
- A Delete action
Use visual priority indicators, but do not rely on color alone to
communicate priority.
3.3 Move tasks between columns
Implement drag and drop so a task can be moved from one status column to
another.
- A task should remain in the board after it is dropped.
- Its status must update to the destination column.
- The change must be persisted.
- Provide a non-drag alternative, such as a status selector or move
  action, so the board remains usable without drag and drop.
3.4 Edit a task
- Open the form with the selected task's current values.
- Allow title, description, priority, and due date to be changed.
- Save changes to the existing task; do not create a duplicate.
- Update the board and localStorage immediately.
3.5 Delete a task
- Allow a task to be deleted.
- Ask for confirmation before permanent deletion.
- Remove the task from the board and localStorage.
3.6 Persist tasks after refresh
Use localStorage as the source of persistence.

Suggested key: coderush-kanban-tasks
- Load saved tasks when the app starts.
- If no saved data exists, start with an empty board or a small
  clearly identified demo dataset.
- Save after every create, edit, delete, or status change.
- Handle invalid or malformed stored JSON safely without crashing the
  app.
4. Suggested data model
Use a consistent task shape:
{
  id: "unique-id",
  title: "Prepare project demo",
  description: "Finish the main user flow",
  priority: "High",
  dueDate: "2026-11-01",
  status: "todo",
  createdAt: "2026-10-31T08:00:00.000Z",
  updatedAt: "2026-10-31T08:00:00.000Z"
}
Use these exact status values internally:
const STATUSES = ["todo", "in-progress", "completed"];
Map them to the visible labels To Do, In Progress, and
Completed.

Suggested priority values:
const PRIORITIES = ["Low", "Medium", "High"];
5. UI and design direction
Create a clean, modern productivity dashboard.
Overall layout
- A top header with the product name TaskFlow and a short
  subtitle.
- A prominent Add Task button.
- A responsive three-column board on desktop.
- On small screens, stack the columns vertically or allow horizontal
  scrolling with clear affordances.
- Use consistent spacing, readable typography, subtle borders, and
  restrained shadows.
- Keep the interface uncluttered; task actions should be easy to find.
Task cards
- Make cards visually distinct from the column background.
- Display priority with a small labelled badge.
- Make due dates readable.
- Clearly distinguish overdue dates without hiding the actual date.
- Keep Edit and Delete actions accessible.
- Provide hover, focus, and drag states.
Forms and feedback
- Use a modal or a clearly separated form panel.
- Show validation messages near invalid fields.
- Provide feedback after important actions where appropriate.
- Ensure buttons and inputs have accessible labels and visible
  keyboard focus.
Avoid spending time on decorative animations. A reliable, polished
workflow is more important.
6. Suggested component structure
Organize the code into small, understandable components. Adapt the
structure if the project already has a sensible organization.
src/
  components/
    Header.jsx
    KanbanBoard.jsx
    KanbanColumn.jsx
    TaskCard.jsx
    TaskFormModal.jsx
    ConfirmDialog.jsx
  hooks/
    useTasks.js
  utils/
    storage.js
    taskHelpers.js
  App.jsx
  main.jsx
  index.css
Responsibilities:
- App.jsx: page composition and top-level state.
- KanbanBoard.jsx: renders the three columns.
- KanbanColumn.jsx: renders one status column and handles drop
  events.
- TaskCard.jsx: displays a task and exposes edit, delete, and drag
  actions.
- TaskFormModal.jsx: create/edit form with validation.
- ConfirmDialog.jsx: delete confirmation.
- useTasks.js: task state and task operations.
- storage.js: safe localStorage read/write helpers.
- taskHelpers.js: IDs, status constants, and small pure helpers.
Do not create unnecessary abstractions if they slow down implementation.
7. Implementation guidance
A practical implementation order:
1. Inspect the existing project and preserve its setup where possible.
2. Build the page layout and the three status columns.
3. Implement task creation and card rendering.
4. Implement editing and deletion.
5. Add drag-and-drop status changes and a non-drag status control.
6. Add localStorage loading and saving.
7. Test the full workflow and fix visual or functional bugs.
Use a single clear source of truth for tasks. Keep task updates
immutable. Avoid duplicating task state inside individual cards or
columns.
8. Acceptance checklist
The implementation is complete only when all required checks pass:
- [x] The app starts successfully using the documented command.
- [x] The board displays To Do, In Progress, and Completed columns.
- [x] A task can be created with title, description, priority, and due
  date.
- [x] A task appears in the correct column.
- [x] Tasks can be moved between columns using drag and drop.
- [x] Tasks can also be moved without drag and drop.
- [x] A task can be edited without creating a duplicate.
- [x] A task can be deleted after confirmation.
- [x] Task changes remain after refreshing the page.
- [x] Empty columns show a useful empty state.
- [x] The layout works on desktop and mobile widths.
- [x] No major console errors or broken interactions remain.
9. Run the project
For a new Vite project:
npm create vite@latest coderush-kanban -- --template react
cd coderush-kanban
npm install
npm install -D tailwindcss @tailwindcss/vite
npm run dev
Configure Tailwind according to the version installed. If the repository
already exists, inspect its package.json and use its existing scripts
and styling setup rather than recreating the project.
10. Instructions to Antigravity
Act as an experienced frontend engineer working under a strict hackathon
time limit.
1. Inspect the current repository before changing files.
2. If it is an empty repository, scaffold the React + Vite application.
3. Implement every item in the Core requirements and Acceptance
   checklist.
4. Keep the app runnable throughout development.
5. Prefer simple, reliable code over unnecessary libraries or
   architecture.
6. Do not introduce a backend or features not required by this brief.
7. Do not leave placeholder buttons or TODO-only functionality.
8. Run the available build or lint checks and fix errors.
9. At the end, provide a concise summary of what was built, the
   commands to run it, and any limitations that remain.
10. If a requirement is ambiguous, choose the simplest user-friendly
    implementation and document the choice rather than blocking the
    build.
11. Scope note
This README is based on the supplied CodeRush Hackathon PDF's Round
1 challenge, R1-01 --- Smart Kanban Task Board. The PDF describes
the overall event as three feature rounds plus a final product round,
but it does not provide the specific challenge statements for Rounds 2,
3, or the Final. This brief therefore covers Round 1 only and does not
invent requirements for the other rounds.