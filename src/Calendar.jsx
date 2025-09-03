

// Mindful Calendar UI for Liora
// This file implements a pastel-themed calendar with month/week/day views for the Liora productivity app.

// Mindful Calendar UI for Liora
import React, { useState } from 'react';
import { Box, Typography, IconButton, Paper, Grid } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const pastel = {
  cream: '#FFF8F0',
  lavender: '#E9D9FF',
  peach: '#FFD9B3',
  accent: '#B3E9FF',
  todayGlow: 'rgba(179,233,255,0.25)',
};

function DayCell({ day, outOfMonth, isToday, selected, pastel, onClick }) {
  return (
    <Box
      sx={{
        background: outOfMonth
          ? '#f0f0f0'
          : isToday
            ? pastel.todayGlow
            : selected === day
              ? pastel.lavender
              : '#f3f4f6',
        borderRadius: 1,
        minWidth: 110,
        width: 110,
        minHeight: 110,
        height: 110,
        overflow: 'visible',
        boxShadow: outOfMonth ? 'none' : (
          isToday
            ? `0 0 24px ${pastel.accent}`
            : selected === day
              ? `0 0 12px ${pastel.lavender}`
              : '0 2px 8px #FFD9B3'
        ),
        transition: 'background 0.3s, box-shadow 0.3s',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        m: 0,
        p: 0,
        opacity: outOfMonth ? 0.7 : 1,
      }}
      onClick={() => !outOfMonth && onClick(day)}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: outOfMonth ? '#bbb' : '#3E2C41', fontFamily: 'Raleway, sans-serif', mb: 0.5, fontSize: 18 }}>
        {day}
      </Typography>
      {!outOfMonth && (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Paper sx={{ px: 1, py: 0.5, borderRadius: 3, background: pastel.peach, color: '#3E2C41', fontSize: 11, mb: 0.5, whiteSpace: 'normal', wordBreak: 'break-word' }}>Yoga</Paper>
            <Paper sx={{ px: 1, py: 0.5, borderRadius: 3, background: pastel.lavender, color: '#3E2C41', fontSize: 11, mb: 0.5, whiteSpace: 'normal', wordBreak: 'break-word' }}>Meeting</Paper>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.3, mt: 0.5 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: pastel.accent }} />
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: pastel.peach }} />
          </Box>
        </Box>
      )}
    </Box>
  );
}

function Calendar() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState(null);
  const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthLabels = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calculate days for 7x6 grid, starting on Monday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let firstDayOfWeek = new Date(year, month, 1).getDay();
  firstDayOfWeek = firstDayOfWeek === 0 ? 7 : firstDayOfWeek; // Sunday becomes 7
  // Previous month's days
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const prevMonthDays = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
  // Fill leading days (to Monday)
  const leadingDays = Array.from({ length: firstDayOfWeek - 1 }, (_, i) => ({
    day: prevMonthDays - (firstDayOfWeek - 2) + i,
    outOfMonth: true,
    month: prevMonth,
    year: prevMonthYear
  }));
  // Current month days
  const currentDays = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    outOfMonth: false,
    month,
    year
  }));
  // Trailing days
  const totalCells = 42;
  const trailingDaysCount = totalCells - (leadingDays.length + currentDays.length);
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;
  const trailingDays = Array.from({ length: trailingDaysCount }, (_, i) => ({
    day: i + 1,
    outOfMonth: true,
    month: nextMonth,
    year: nextMonthYear
  }));
  const calendarDays = [...leadingDays, ...currentDays, ...trailingDays];

  function handlePrevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
          <Box sx={{ width: '100%', borderRadius: 2, background: pastel.cream, p: 2, mt: 4 }}>
            <Grid container columns={7} sx={{ borderRadius: 2, minHeight: 660, p: 0, m: 0 }}>
              {Array.from({ length: 6 }).map((_, rowIdx) => (
                <React.Fragment key={rowIdx}>
                  {calendarDays.slice(rowIdx * 7, rowIdx * 7 + 7).map((cell, colIdx) => (
                    <Grid key={colIdx + rowIdx * 7} sx={{ p: 0, m: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                      <DayCell
                        day={cell.day}
                        outOfMonth={cell.outOfMonth}
                        isToday={cell.day === today.getDate() && cell.month === today.getMonth() && cell.year === today.getFullYear()}
                        selected={selected}
                        pastel={pastel}
                        onClick={setSelected}
                      />
                    </Grid>
                  ))}
                </React.Fragment>
              ))}
            </Grid>
          </Box>


            }
          }
        }
// ...existing code...
export default Calendar;    

