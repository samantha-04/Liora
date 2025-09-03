// ...existing imports...
function TabSeparator() {
  return (
    <span style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      fontWeight: 400,
      color: '#3E2C41',
      fontSize: '18.2px',
      margin: '0 16px',
      lineHeight: 1,
      position: 'relative',
  top: '11px', // move down a tiny bit more
    }}>
      |
    </span>
  );
}


import { createTheme, ThemeProvider } from '@mui/material/styles';
import Heading from './Heading';
import Calendar from './Calendar';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { motion, AnimatePresence } from 'framer-motion';
function BackgroundGlow() {
  const shapes = [
    { top: '10%', left: '15%', size: 220, color: 'rgba(255, 233, 200, 0.45)' },
    { top: '60%', left: '70%', size: 180, color: 'rgba(233, 217, 255, 0.35)' },
    { top: '40%', left: '30%', size: 140, color: 'rgba(255, 217, 179, 0.35)' },
    { top: '75%', left: '20%', size: 120, color: 'rgba(255, 255, 200, 0.25)' },
    { top: '20%', left: '80%', size: 160, color: 'rgba(255, 217, 255, 0.25)' },
  ];
  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0 }}>
      {shapes.map((s, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: s.color,
            filter: 'blur(32px)',
            opacity: 0.7,
          }}
        />
      ))}
    </Box>
  );
}

import TaskBoard from './TaskBoard';

import Paper from '@mui/material/Paper';


const colors = {
  background: '#FFF8F0',
  accent: '#FFD9B3',
  secondary: '#E9D9FF',
  micro: '#FFE28A',
  panel: '#D9CFC3',
};

const theme = createTheme({
  palette: {
    background: {
      default: colors.background,
      paper: colors.panel,
    },
    primary: {
      main: colors.accent,
    },
    secondary: {
      main: colors.secondary,
    },
    info: {
      main: colors.micro,
    },
    text: {
      primary: '#3B2F2F',
    },
  },
  shape: {
    borderRadius: 16,
  },
});

const MotionPaper = motion.create(Paper);


function KanbanBoard() {
  const columns = [
    { title: 'To-Do', tasks: ['Design UI', 'Set up calendar'] },
    { title: 'In Progress', tasks: ['Build Kanban'] },
    { title: 'Done', tasks: ['Project setup'] },
  ];
  return (
    <Grid container spacing={4} justifyContent="center" sx={{ mb: 4 }}>
      {columns.map((col) => (
  <Grid key={col.title}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>{col.title}</Typography>
          {col.tasks.map((task, i) => (
            <MotionPaper
              key={task}
              elevation={3}
              sx={{ p: 2, mb: 2, borderRadius: 4, background: colors.panel, opacity: 0.95 }}
              initial={{ opacity: 0.8, scale: 0.98 }}
              whileHover={{ scale: 1.02, boxShadow: `0 0 12px ${colors.accent}` }}
              whileTap={{ scale: 0.97 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>{task}</Typography>
                <Chip label={i % 2 === 0 ? 'Energy' : 'Focus'} color={i % 2 === 0 ? 'info' : 'secondary'} size="small" />
              </Box>
            </MotionPaper>
          ))}
        </Grid>
      ))}
    </Grid>
  );
}

function CalendarPanel() {
  return (
    <Paper elevation={2} sx={{ borderRadius: 4, p: 4, mx: 4, background: colors.secondary }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Calendar (Preview)</Typography>
      <Grid container spacing={2}>
        {[...Array(7)].map((_, i) => (
          <Grid key={i}>
            <MotionPaper
              elevation={1}
              sx={{ p: 2, borderRadius: 2, background: colors.panel, minWidth: 80 }}
              initial={{ opacity: 0.9 }}
              whileHover={{ scale: 1.03, boxShadow: `0 0 8px ${colors.secondary}` }}
            >
              <Typography>Day {i + 1}</Typography>
            </MotionPaper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

function App() {
  const [tab, setTab] = useState(0); // 0 = Taskboard, 1 = Calendar
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          minHeight: '100vh',
          minWidth: '100vw',
          background: 'linear-gradient(120deg, #FFF8F0 0%, #FFD9B3 60%, #E9D9FF 100%)',
          p: 0,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <BackgroundGlow />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Heading />
        </Box>
        {/* Tab Bar - now directly under header, center aligned, transparent background, plum outline/text */}
  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 0, mb: 0.2, zIndex: 2 }}>
          <Box sx={{ borderRadius: 99, px: 2, py: 1, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto' }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              TabIndicatorProps={{ style: { display: 'none' } }}
              sx={{
                minHeight: 0,
                '& .MuiTab-root': {
                  borderRadius: 99,
                  px: 3,
                  py: 1,
                  mx: 0.5,
                  fontWeight: 600,
                  fontSize: '12.6px',
                  color: '#3E2C41',
                  background: 'transparent',
                  border: 'none',
                  transition: 'background 0.2s',
                },
                '& .Mui-selected': {
                  background: 'transparent',
                  color: '#3E2C41',
                  border: 'none',
                  textDecoration: 'underline',
                },
              }}
            >
              <Tab label={<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Taskboard</span>} />
              <TabSeparator />
              <Tab label={<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Calendar</span>} />
            </Tabs>
          </Box>
        </Box>
        {/* Main Content Area */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100%', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
          <AnimatePresence mode="wait">
            {tab === 0 && (
              <motion.div
                key="taskboard"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto' }}>
                  <TaskBoard />
                </Box>
              </motion.div>
            )}
            {tab === 1 && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto' }}>
                  <Calendar />
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App
