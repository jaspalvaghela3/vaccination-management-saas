import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { showSnackbar, hideSnackbar, markAsRead, markAllAsRead } from '../store/notificationSlice';

export const useNotification = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, unreadCount, snackbar } = useSelector((state: RootState) => state.notifications);

  const notify = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    dispatch(showSnackbar({ message, severity }));
  };

  const closeSnackbar = () => {
    dispatch(hideSnackbar());
  };

  const readNotification = (id: string) => {
    dispatch(markAsRead(id));
  };

  const readAll = () => {
    dispatch(markAllAsRead());
  };

  return {
    notifications,
    unreadCount,
    snackbar,
    notify,
    closeSnackbar,
    readNotification,
    readAll,
  };
};
