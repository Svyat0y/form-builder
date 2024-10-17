//mui
import { Box, Button } from '@mui/material';
//components
import { Icons } from '@components/CustomIcons/CustomIcons';

export const SocialLoginBox = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Button
        fullWidth
        variant="outlined"
        onClick={() => alert('Sign in with Google')}
        startIcon={<Icons.Google />}
        // className={styles.button}
        sx={{
          border: '1px solid var(--border-shadow-color)',
          color: 'var(--text-color-primary)',
          borderRadius: '8px', // Заменяем SCSS переменную на значение
        }}
      >
        Sign in with Google
      </Button>
      <Button
        fullWidth
        variant="outlined"
        onClick={() => alert('Sign in with Facebook')}
        startIcon={<Icons.Facebook />}
        // className={styles.button}
        sx={{
          border: '1px solid var(--border-shadow-color)',
          color: 'var(--text-color-primary)',
          borderRadius: '8px', // Заменяем SCSS переменную на значение
        }}
      >
        Sign in with Facebook
      </Button>
    </Box>
  );
};
