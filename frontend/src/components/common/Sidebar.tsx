import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

const doctorNavItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.DOCTOR_DASHBOARD },
  { label: 'Patients', icon: <PeopleIcon />, path: '/doctor/patients' },
  { label: 'Vaccinations', icon: <VaccinesIcon />, path: ROUTES.VACCINATION_SCHEDULE },
];

const parentNavItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.PARENT_DASHBOARD },
  { label: 'My Children', icon: <ChildCareIcon />, path: '/parent/children' },
  { label: 'Schedule', icon: <CalendarMonthIcon />, path: ROUTES.VACCINATION_SCHEDULE },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, drawerWidth }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const navItems = user?.role === 'doctor' ? doctorNavItems : parentNavItems;

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          bgcolor: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <LocalHospitalIcon sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
            VacciTrack
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Vaccination Management
          </Typography>
        </Box>
      </Box>

      <Divider />

      <List sx={{ px: 1, py: 2, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: `${theme.palette.primary.main}15`,
                    color: theme.palette.primary.main,
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                    '&:hover': {
                      bgcolor: `${theme.palette.primary.main}25`,
                    },
                  },
                }}
                aria-label={item.label}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: isActive ? 600 : 400, fontSize: '0.9rem' }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.disabled" display="block" textAlign="center">
          VacciTrack v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
