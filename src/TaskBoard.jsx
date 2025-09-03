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
  // If more than 4 tasks, show vertical scrollbar
  const isCrowded = tasks.length > 4;
  return (
    <Grid ref={setNodeRef} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Column header/title (not scrolling) */}
      <Box sx={{ width: '100%' }}>
        {children[0]}
      </Box>
      {/* Tasks list (scrolls if crowded) */}
      <Box sx={{
        borderRadius: 0,
        transition: 'box-shadow 0.2s',
        boxShadow: 'none',
        background: 'transparent',
        p: 1,
        maxHeight: isCrowded ? 420 : 'none',
        overflowY: isCrowded ? 'auto' : 'visible',
        width: '100%',
      }}>
        {/* Render all children except the first (header) */}
        {children.slice(1)}
      </Box>
    </Grid>
  );
}

function SortableTask({ task, index, onDelete, onEdit }) {
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
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuPos, setMenuPos] = React.useState({ x: 0, y: 0 });

  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuOpen(true);
    setMenuPos({ x: e.clientX, y: e.clientY });
  };
  const handleCloseMenu = () => setMenuOpen(false);
  const handleDelete = (e) => {
    e.stopPropagation();
    handleCloseMenu();
    if (onDelete) onDelete(task.id);
  };
  const handleEdit = (e) => {
    e.stopPropagation();
    handleCloseMenu();
    if (onEdit) onEdit(task);
  };

  // Delete and edit handlers will be passed from parent
  return (
    <>
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
        onContextMenu={handleContextMenu}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
          <Typography>{task.name}</Typography>
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
      </MotionPaper>
      {menuOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            background: 'transparent',
          }}
          onClick={handleCloseMenu}
        >
          <Box
            sx={{
              position: 'absolute',
              top: menuPos.y,
              left: menuPos.x,
              background: colors.panel,
              borderRadius: 2,
              boxShadow: '0 2px 12px #E9D9FF',
              p: 1,
              minWidth: 120,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <button style={{
              background: colors.accent,
              color: '#3E2C41',
              border: 'none',
              borderRadius: 6,
              padding: '6px 8px',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: 4,
              minWidth: 80,
              maxWidth: 110,
            }} onClick={handleEdit}>Edit Task</button>
            <button style={{
              background: '#FFF8F0',
              color: '#C0392B',
              border: 'none',
              borderRadius: 6,
              padding: '6px 8px',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              minWidth: 80,
              maxWidth: 110,
            }} onClick={handleDelete}>Delete Task</button>
          </Box>
        </Box>
      )}
    </>
  );
}

function TaskBoard({ addedTasks }) {
  const [columns, setColumns] = useState(initialColumns);
  const [activeId, setActiveId] = useState(null);
  const [activeCol, setActiveCol] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState({ name: '', priority: '', addToCalendar: false });
  const sensors = useSensors(useSensor(PointerSensor));

  React.useEffect(() => {
    if (Array.isArray(addedTasks) && addedTasks.length > 0) {
      setColumns(prev => {
        // Filter out any tasks already present by id
        const newToDo = [
          ...addedTasks.filter(t => !prev['To-Do'].some(existing => existing.id === t.id)),
          ...prev['To-Do']
        ];
        return {
          ...prev,
          'To-Do': newToDo,
        };
      });
    }
  }, [addedTasks]);

  // Delete a task by id from all columns
  const handleDeleteTask = (id) => {
    setColumns(prev => {
      const updated = {};
      for (const col in prev) {
        updated[col] = prev[col].filter(t => t.id !== id);
      }
      return updated;
    });
  };

  // Edit a task: open popup
  const handleEditTask = (task) => {
    setEditTask(task);
    setEditTaskData({
      name: task.name,
      priority: task.priority,
      addToCalendar: !!task.addToCalendar,
    });
    setEditPopupOpen(true);
  };

  const handleEditPopupSave = () => {
    setColumns(prev => {
      const updated = {};
      for (const col in prev) {
        updated[col] = prev[col].map(t =>
          t.id === editTask.id ? { ...t, ...editTaskData } : t
        );
      }
      return updated;
    });
    setEditPopupOpen(false);
    setEditTask(null);
  };

  const handleEditPopupCancel = () => {
    setEditPopupOpen(false);
    setEditTask(null);
  };

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
                  <SortableTask key={task.id} task={task} index={i} onDelete={handleDeleteTask} onEdit={handleEditTask} />
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
      {/* Edit Task Popup Dialog */}
      {editPopupOpen && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, background: 'rgba(60,40,80,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper elevation={6} sx={{ minWidth: 340, maxWidth: 380, p: 4, borderRadius: 4, background: colors.background, boxShadow: '0 4px 32px #E9D9FF' }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: '#3E2C41', fontWeight: 700 }}>Edit Task</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <input
                type="text"
                placeholder="Task name"
                value={editTaskData.name}
                onChange={e => setEditTaskData({ ...editTaskData, name: e.target.value })}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #E9D9FF',
                  fontSize: '15px',
                  marginBottom: '8px',
                }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500, mb: 0.5 }}>Priority</Typography>
                <select
                  value={editTaskData.priority}
                  onChange={e => setEditTaskData({ ...editTaskData, priority: e.target.value })}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: '1px solid #FFD9B3',
                    fontSize: '14px',
                  }}
                >
                  <option value="">Select priority...</option>
                  <option value="Low">Low — Can do anytime 🌱</option>
                  <option value="Medium">Medium — Worth focusing 🌸</option>
                  <option value="High">High — Matters most ✨</option>
                </select>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <input
                  type="checkbox"
                  checked={editTaskData.addToCalendar}
                  onChange={e => setEditTaskData({ ...editTaskData, addToCalendar: e.target.checked })}
                />
                <Typography sx={{ fontSize: 14 }}>Add to Calendar</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                <button
                  style={{
                    background: colors.secondary,
                    color: '#3E2C41',
                    border: 'none',
                    borderRadius: 99,
                    padding: '8px 20px',
                    fontSize: '15px',
                    fontWeight: 600,
                    boxShadow: '0 1px 4px #E9D9FF',
                    cursor: 'pointer',
                    marginRight: '8px',
                  }}
                  onClick={handleEditPopupSave}
                >Save</button>
                <button
                  style={{
                    background: '#FFF8F0',
                    color: '#3E2C41',
                    border: '1px solid #E9D9FF',
                    borderRadius: 99,
                    padding: '8px 20px',
                    fontSize: '15px',
                    fontWeight: 600,
                    boxShadow: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={handleEditPopupCancel}
                >Cancel</button>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}

export default TaskBoard;
