import { Theme } from '@mui/material/styles';

export const forgotPasswordStyles = (theme?: Theme) => ({
  wrapper: {
    '& .MuiDialog-paper': {
      borderRadius: '10px',
      border: '1px solid',
      borderColor: theme?.palette.divider,
      '--Paper-overlay': 'none !important',
    },
  },
  content: { display: 'flex', flexDirection: 'column', gap: 2, width: '100%' },
});
