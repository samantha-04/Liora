// Heading component for Liora App
// Heading / Greeting Bar for Liora using MUI

// Layout:
// - Place at the top of the app as a full-width AppBar alternative
// - Use MUI Box with display="flex", alignItems="center", justifyContent="space-between"
// - Add padding: theme.spacing(3) (≈24px)
// - Background: gradient linear from peach glow (#FFD9B3) → cream (#FFF8F0)
// - Rounded bottom corners: borderRadius: "0 0 24px 24px"
// - Subtle shadow: theme.shadows[2]

// Greeting Text:
// - Dynamic greeting: "Good Morning / Afternoon / Evening, [UserName]"
// - Use JavaScript Date object to determine greeting (hours < 12 → Morning, 12–17 → Afternoon, else Evening)
// - Typography variant="h4"
// - Font: import Google Font "Poppins" (weight 600) via MUI theme.typography.fontFamily override
// - Text color: #3E2C41 (deep plum) for contrast
// - Add letterSpacing: 0.5px, lineHeight: 1.2
// - Margin-bottom: theme.spacing(1)

// Subtext / Moodline (optional):
// - Below greeting, add Typography variant="subtitle1"
// - Text: uplifting phrase, e.g. "Here’s to a mindful, productive day 🌱"
// - Color: #5A5A5A (muted gray)

// User Avatar (right side):
// - Use MUI Avatar with user initials or profile pic
// - Size: 48px
// - Background color: lavender mist (#E9D9FF) if no image
// - Wrap in IconButton so it’s clickable (for future settings/profile dropdown)

// Responsive Behavior:
// - On mobile: greeting text scales down (variant="h5")
// - Avatar shrinks to 40px
// - Padding reduced to theme.spacing(2)

// Extra Styling:
// - Animate greeting fade-in on mount with Framer Motion
// - Add subtle hover animation on Avatar (scale up 1.05 with transition 0.2s)

import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';

const colors = {
  panel: '#D9CFC3',
  accent: '#FFD9B3',
};



function Heading() {
  // Dynamic greeting logic
  const userName = 'Liora'; // Replace with actual user name if available
  const hour = new Date().getHours();
  let greeting;
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';
  else greeting = 'Good evening';

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
  px: 6,
  pt: '20px', // increased top padding for more space
  pb: '0px', // 30% reduction from 2px
  background: 'transparent',
        borderRadius: 0,
        boxShadow: 'none',
        border: 'none',
        outline: 'none',
        mb: 0,
        mt: 0,
        left: '-37px',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 600,
            color: '#3E2C41',
            letterSpacing: '0.04em',
            lineHeight: 1.2,
            mb: 0.5,
            fontSize: { xs: 28, sm: 36, md: 44 },
            textAlign: 'center',
          }}
        >
          {greeting}, {userName}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: '#5A5A5A', fontSize: { xs: 15, sm: 17 }, mb: 0.5, textAlign: 'center', letterSpacing: '0.02em' }}
        >
          Here’s to a mindful, productive day 🌱
        </Typography>
      </Box>
    </Box>
  );
}


export default Heading;
