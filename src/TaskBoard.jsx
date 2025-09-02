// Task Board component for Liora (MUI)
import React, { useState } from 'react';
import { Grid, Paper, Typography, Chip, Box } from '@mui/material';
import { motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const colors = {
  background: '#FFF8F0',
  accent: '#FFD9B3',
  panel: '#D9CFC3',
};

const MotionPaper = motion(Paper);

const initialColumns = {
  'To-Do': [
    { id: 'task-1', name: 'Design UI', tag: 'Energy' },
    { id: 'task-2', name: 'Set up calendar', tag: 'Focus' },
  ],
  'In Progress': [
    { id: 'task-3', name: 'Build Kanban', tag: 'Urgent' },
  ],
  'Done': [
    { id: 'task-4', name: 'Project setup', tag: 'Complete' },
  ],
};

function DroppableColumn({ columnId, tasks, children, isOver }) {
  const { setNodeRef, isOver: dndOver } = useDroppable({ id: columnId });
  return (
    <Grid item xs={12} sm={4} ref={setNodeRef}>
      <Box sx={{
        borderRadius: 4,
        transition: 'box-shadow 0.2s',
        boxShadow: dndOver || isOver ? `0 0 24px ${colors.accent}` : 'none',
        background: dndOver || isOver ? colors.panel : 'transparent',
        p: 1,
      }}>
        {children}
      </Box>
    </Grid>
  );
}

function SortableTask({ task, index }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isSorting } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    boxShadow: isDragging ? `0 0 24px ${colors.accent}` : '0 2px 8px #FFD9B3',
    opacity: isDragging ? 0.8 : 1,
  };
  return (
    <MotionPaper
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      elevation={3}
      sx={{ p: 2, mb: 2, borderRadius: 4, background: colors.background }}
      initial={{ opacity: 0.9, scale: 0.98 }}
      animate={{ scale: isDragging ? 1.05 : 1, boxShadow: isDragging ? `0 0 24px ${colors.accent}` : '0 2px 8px #FFD9B3' }}
      whileHover={{ scale: 1.03, boxShadow: `0 0 16px ${colors.accent}` }}
      whileTap={{ scale: 0.97 }}
      style={style}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>{task.name}</Typography>
        <Chip label={task.tag} color={index % 2 === 0 ? 'info' : 'secondary'} size="small" />
      </Box>
    </MotionPaper>
  );
}

function TaskBoard() {
  const [columns, setColumns] = useState(initialColumns);
  const sensors = useSensors(useSensor(PointerSensor));
  const [activeId, setActiveId] = useState(null);
  const [activeCol, setActiveCol] = useState(null);

  function findTask(id) {
    for (const col of Object.values(columns)) {
      const found = col.find((t) => t.id === id);
      if (found) return found;
    }
    return null;
  }

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    let sourceCol, destCol;
    Object.entries(columns).forEach(([colId, tasks]) => {
      if (tasks.find((t) => t.id === active.id)) sourceCol = colId;
      if (tasks.find((t) => t.id === over.id)) destCol = colId;
      if (colId === over.id) destCol = colId;
    });
    if (!sourceCol || !destCol) return;

    // Reorder within same column
    if (sourceCol === destCol) {
      const oldIndex = columns[sourceCol].findIndex((t) => t.id === active.id);
      const newIndex = columns[sourceCol].findIndex((t) => t.id === over.id);
      setColumns((prev) => ({
        ...prev,
        [sourceCol]: arrayMove(prev[sourceCol], oldIndex, newIndex),
      }));
      return;
    }

    // Move between columns
    const task = columns[sourceCol].find((t) => t.id === active.id);
    setColumns((prev) => {
      const newSource = prev[sourceCol].filter((t) => t.id !== active.id);
      const newDest = [...prev[destCol], task];
      return { ...prev, [sourceCol]: newSource, [destCol]: newDest };
    });
  }

  function handleDragOver(event) {
    const { over } = event;
    if (over) setActiveCol(over.id);
    else setActiveCol(null);
  }

  function handleDragCancel() {
    setActiveCol(null);
    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragCancel={handleDragCancel}
    >
      <Grid container spacing={4} justifyContent="center" sx={{ mb: 4 }}>
        {Object.entries(columns).map(([colId, tasks]) => (
          <DroppableColumn key={colId} columnId={colId} tasks={tasks} isOver={activeCol === colId}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>{colId}</Typography>
            <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              {tasks.map((task, i) => (
                <SortableTask key={task.id} task={task} index={i} />
              ))}
            </SortableContext>
          </DroppableColumn>
        ))}
      </Grid>
      <DragOverlay>
        {activeId ? (
          <SortableTask task={findTask(activeId)} index={0} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default TaskBoard;
