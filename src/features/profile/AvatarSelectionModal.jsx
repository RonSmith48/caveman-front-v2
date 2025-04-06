import React, { useState } from 'react';
import { Modal, Grid, IconButton, Box } from '@mui/material';

// List of SVG avatar filenames (all SVGs stored in /public/images/avatars/)
const avatarsList = Array.from({ length: 41 }, (_, i) => `avatar-${String(i + 1).padStart(2, '0')}.svg`);

const AvatarSelectionModal = ({ isOpen, handleClose, handleSelect }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const AVATAR_SIZE = 100;

  // Handle avatar selection
  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar);
    handleSelect(avatar);
    handleClose();
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          width: 700, // Set fixed width for the modal
          maxHeight: '80vh', // Prevent the modal from growing too tall
          overflowY: 'auto', // Enable vertical scrolling
          padding: 4,
          backgroundColor: 'white',
          margin: 'auto',
          borderRadius: '10px'
        }}
      >
        <Grid container spacing={2}>
          {avatarsList.map((avatar, index) => (
            <Grid item xs={4} sm={3} md={2} key={index}>
              <div
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  //   backgroundColor: '#f0f0f0',
                  borderRadius: '50%', // Makes the background a circle
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden' // Ensures the avatar stays inside the circle
                }}
              >
                <IconButton onClick={() => handleAvatarClick(avatar)} sx={{ padding: 7 }}>
                  <img
                    src={`/images/avatars/${avatar}`}
                    alt={`Avatar ${index}`}
                    width={AVATAR_SIZE}
                    height={AVATAR_SIZE}
                    style={{
                      border: selectedAvatar === avatar ? '2px solid blue' : 'none',
                      borderRadius: '50%',
                      backgroundColor: 'transparent' // Placeholder for future background color
                    }}
                  />
                </IconButton>
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Modal>
  );
};

export default AvatarSelectionModal;
