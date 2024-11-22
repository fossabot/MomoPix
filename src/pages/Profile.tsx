import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useBoolean } from '@zl-asica/react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import useAuthContext from '@/hooks/useAuthContext';
import useUpdateUserData from '@/hooks/useUpdateUserData';

const Profile = () => {
  const { userData, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !userData) {
      toast.error('请先登录');
      navigate('/login');
    }
  }, [loading, userData, navigate]);

  const { updateBasicInfo } = useUpdateUserData();
  const {
    value: editing,
    setTrue: startEditing,
    setFalse: stopEditing,
  } = useBoolean(false);

  const [displayName, setDisplayName] = useState(userData?.displayName || '');
  const [photoURL, setPhotoURL] = useState(userData?.photoURL || '');
  const [updateStatus, setUpdateStatus] = useState<UpdateStage>('idle');
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || '');
      setPhotoURL(userData.photoURL || '');
    }
  }, [userData]);

  useEffect(() => {
    if (updateStatus === 'success') {
      const timeout = setTimeout(() => setUpdateStatus('idle'), 3000); // 成功状态显示 3 秒
      return () => clearTimeout(timeout);
    }
  }, [updateStatus]);

  const handleSave = async () => {
    setUpdateError(null);
    try {
      setUpdateStatus('updating');
      await updateBasicInfo({ displayName, photoURL });
      setUpdateStatus('success');
      stopEditing();
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : 'Failed to update profile'
      );
      setUpdateStatus('idle');
    }
  };

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      maxWidth={600}
      margin='0 auto'
      padding={3}
    >
      <Typography
        variant='h4'
        gutterBottom
      >
        Profile
      </Typography>

      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        gap={2}
        mb={3}
      >
        <Avatar
          src={photoURL || userData?.photoURL || ''}
          alt={displayName}
          sx={{ width: 100, height: 100 }}
        />
        {editing ? (
          <>
            <TextField
              label='Display Name'
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              fullWidth
            />
            <TextField
              label='Photo URL'
              value={photoURL}
              onChange={(event) => setPhotoURL(event.target.value)}
              fullWidth
              helperText='Paste a valid image URL'
            />
          </>
        ) : (
          <>
            <Typography variant='h6'>
              {displayName || 'No Display Name'}
            </Typography>
            <Typography variant='body2'>{userData?.email}</Typography>
          </>
        )}
      </Box>

      {updateStatus === 'success' && (
        <Alert severity='success'>Profile updated successfully!</Alert>
      )}
      {updateError && <Alert severity='error'>{updateError}</Alert>}

      <Box
        display='flex'
        justifyContent='center'
        gap={2}
      >
        {editing ? (
          <>
            <Button
              variant='contained'
              color='primary'
              onClick={handleSave}
              disabled={updateStatus === 'updating'}
            >
              {updateStatus === 'updating' ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              onClick={stopEditing}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            variant='outlined'
            onClick={startEditing}
          >
            Edit Profile
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Profile;