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
import { useDroppable } from '@dnd-kit/core';
import { useSortable, SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const colors = {
  background: '#FFF8F0',
  accent: '#FFD9B3',
  panel: '#D9CFC3',
};

const MotionPaper = motion.create(Paper);

const initialColumns = {
  'To-Do': [
    { id: 'task-1', name: 'Design UI', tag: 'Energy', priority: 'Medium' },
    { id: 'task-2', name: 'Set up calendar', tag: 'Focus', priority: 'High' },
  ],
  'In Progress': [
    { id: 'task-3', name: 'Build Kanban', tag: 'Urgent', priority: 'Low' },
  ],
  'Done': [
    { id: 'task-4', name: 'Project setup', tag: 'Complete' },
  ],
};

function DroppableColumn({ columnId, tasks, children, isOver }) {
  const { setNodeRef, isOver: dndOver } = useDroppable({ id: columnId });
  return (
  <Grid ref={setNodeRef} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{
        borderRadius: 4,
        transition: 'box-shadow 0.2s',
        boxShadow: 'none',
  background: 'transparent',
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
  boxShadow: isDragging ? `0 0 24px ${colors.accent}` : 'none',
    opacity: isDragging ? 0.8 : 1,
  };
  // Priority label styles and microcopy
  const priorityStyles = {
    Low:   { bg: '#D6EAD7', color: '#3E4C41', text: 'Can do anytime 🌱' },
    Medium:{ bg: '#FFE5D0', color: '#6E4C3B', text: 'Worth focusing 🌸' },
    High:  { bg: '#E9D9FF', color: '#4C3B6E', text: 'Matters most ✨' },
    Neutral:{ bg: '#FFF8F0', color: '#5A5A5A', text: '' },
  };
  const prio = task.priority ? priorityStyles[task.priority] : priorityStyles.Neutral;
  return (
    <MotionPaper
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      elevation={3}
      sx={{ p: 2, mb: 2, borderRadius: 1.5, background: colors.background, minHeight: 64, minWidth: 220, maxWidth: 340 }}
      initial={{ opacity: 0.9, scale: 0.98 }}
      animate={{ scale: isDragging ? 1.05 : 1, boxShadow: isDragging ? `0 0 24px ${colors.accent}` : '0 2px 8px #FFD9B3' }}
      whileHover={{ scale: 1.03, boxShadow: `0 0 16px ${colors.accent}` }}
      whileTap={{ scale: 0.97 }}
      style={style}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
        <Typography>{task.name}</Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Chip label={task.tag} color={index % 2 === 0 ? 'info' : 'secondary'} size="small" />
          <Box sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 99,
            fontSize: 12,
            background: prio.bg,
            color: prio.color,
            fontWeight: 500,
            letterSpacing: '0.02em',
            boxShadow: 'none',
            border: 'none',
            display: 'inline-block',
            minWidth: 0,
            textAlign: 'center',
          }}>
            {task.priority ? prio.text : ''}
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button style={{
          background: colors.accent,
          color: '#3E2C41',
          border: 'none',
          borderRadius: 12,
          padding: '4px 12px',
          fontSize: 13,
          cursor: 'pointer',
          fontFamily: 'inherit',
          boxShadow: '0 1px 4px #FFD9B3',
          transition: 'background 0.2s',
        }}>Add to Calendar</button>
      </Box>
    </MotionPaper>
  );
}

function TaskBoard() {
  const [columns, setColumns] = useState(initialColumns);
  const [activeId, setActiveId] = useState(null);
  const [activeCol, setActiveCol] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor));

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
    <Box sx={{ width: 900, maxWidth: 900, minWidth: 900, mx: 'auto', mt: 0, position: 'relative', top: 0, height: 600, minHeight: 600, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragCancel={handleDragCancel}
      >
        <Grid container spacing={4} justifyContent="center" sx={{ mb: 4, height: '100%' }}>
          {Object.entries(columns).map(([colId, tasks]) => (
            <DroppableColumn key={colId} columnId={colId} tasks={tasks} isOver={activeCol === colId}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center', width: '100%' }}>{colId}</Typography>
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
    </Box>
  );
}

export default TaskBoard;
