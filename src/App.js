import React, { useState } from 'react';
import './App.css';

const initialTasks = {
  unplanned: Array.from({ length: 10 }, (_, k) => ({
    id: `task-${k + 1}`,
    content: `Task ${k + 1}`
  })),
  today: [],
  tomorrow: [],
  thisWeek: [],
  nextWeek: []
};

const App = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTask, setDraggedTask] = useState(null);

  const onDragStart = (task, sourceColumn) => {
    setDraggedTask({ task, sourceColumn });
  };

  const onDrop = (destinationColumn) => {
    if (!draggedTask) return;

    const { task, sourceColumn } = draggedTask;
    if (sourceColumn !== destinationColumn) {
      setTasks((prev) => {
        const sourceItems = Array.from(prev[sourceColumn]);
        const destinationItems = Array.from(prev[destinationColumn]);
        const taskIndex = sourceItems.findIndex((t) => t.id === task.id);

        if (taskIndex >= 0) {
          sourceItems.splice(taskIndex, 1);
          destinationItems.push(task);
        }

        return {
          ...prev,
          [sourceColumn]: sourceItems,
          [destinationColumn]: destinationItems
        };
      });
    }

    setDraggedTask(null);
  };

  const renderColumn = (columnId, columnTitle) => (
    <div
      key={columnId}
      className="column"
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(columnId)}
    >
      <h3>{columnTitle}</h3>
      {tasks[columnId].map((task) => (
        <div
          key={task.id}
          className="task"
          draggable
          onDragStart={() => onDragStart(task, columnId)}
        >
          {task.content}
        </div>
      ))}
    </div>
  );

  return (
    <div className="App">
      <div className="columns">
        {renderColumn('unplanned', 'Unplanned')}
        {renderColumn('today', 'Today')}
        {renderColumn('tomorrow', 'Tomorrow')}
        {renderColumn('thisWeek', 'This Week')}
        {renderColumn('nextWeek', 'Next Week')}
      </div>
    </div>
  );
};

export default App;
