import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import SettingsIcon from '@mui/icons-material/Settings';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import EditIcon from '@mui/icons-material/Edit';
import { motion } from 'framer-motion';
import './App.css';
import TaskBoard from './TaskBoard';


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

const MotionPaper = motion(Paper);

function TopBar() {
  return (
    <AppBar position="static" color="transparent" elevation={2} sx={{ borderRadius: 4, mb: 4, background: colors.panel }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Good morning, Liora</Typography>
        <Typography>{new Date().toLocaleDateString()}</Typography>
        <Box>
          <IconButton color="primary" aria-label="settings">
            <SettingsIcon />
          </IconButton>
          <IconButton color="primary" aria-label="focus mode">
            <WbSunnyIcon />
          </IconButton>
          <IconButton color="primary" aria-label="reflection/journaling">
            <EditIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function KanbanBoard() {
  const columns = [
    { title: 'To-Do', tasks: ['Design UI', 'Set up calendar'] },
    { title: 'In Progress', tasks: ['Build Kanban'] },
    { title: 'Done', tasks: ['Project setup'] },
  ];
  return (
    <Grid container spacing={4} justifyContent="center" sx={{ mb: 4 }}>
      {columns.map((col) => (
        <Grid item key={col.title} xs={12} sm={4}>
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
          <Grid item key={i} xs={12} sm={1.7}>
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
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', background: colors.background, p: 2 }}>
        <TopBar />
        <TaskBoard />
        <CalendarPanel />
      </Box>
    </ThemeProvider>
  );
}

export default App
