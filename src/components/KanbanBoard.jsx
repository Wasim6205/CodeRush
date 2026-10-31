import React from 'react';
import KanbanColumn from './KanbanColumn';
import { STATUSES } from '../utils/taskHelpers';

export default function KanbanBoard({
  tasks = [],
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onAddTask,
}) {
  return (
    <div className="w-full">
      {/* 3-column responsive layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-start">
        {STATUSES.map((status) => {
          const columnTasks = tasks.filter((task) => task.status === status);
          return (
            <KanbanColumn
              key={status}
              status={status}
              tasks={columnTasks}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onMoveTask={onMoveTask}
              onAddTask={onAddTask}
            />
          );
        })}
      </div>
    </div>
  );
}

