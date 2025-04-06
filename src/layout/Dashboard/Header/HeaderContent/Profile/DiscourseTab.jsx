import { useState } from 'react';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// assets
import { BugOutlined, BulbOutlined, QuestionCircleOutlined } from '@ant-design/icons';

// forms (placeholders)
import BugReports from 'features/profile/BugReports';
import Suggestions from 'features/profile/Suggestions';
import Questions from 'features/profile/Questions';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

export default function DiscourseTab({ handleClose }) {
  const [openDialog, setOpenDialog] = useState(null);

  const handleDialogOpen = (dialog) => {
    setOpenDialog(dialog);
  };

  const handleDialogClose = () => {
    setOpenDialog(null);
  };

  return (
    <>
      <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
        <ListItemButton onClick={() => handleDialogOpen('bug')}>
          <ListItemIcon>
            <BugOutlined />
          </ListItemIcon>
          <ListItemText primary="Bug Reports" />
        </ListItemButton>

        <ListItemButton onClick={() => handleDialogOpen('suggestion')}>
          <ListItemIcon>
            <BulbOutlined />
          </ListItemIcon>
          <ListItemText primary="Suggestions" />
        </ListItemButton>

        <ListItemButton onClick={() => handleDialogOpen('question')}>
          <ListItemIcon>
            <QuestionCircleOutlined />
          </ListItemIcon>
          <ListItemText primary="Questions" />
        </ListItemButton>
      </List>

      <Dialog open={openDialog === 'bug'} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Report a Bug
          <IconButton aria-label="close" onClick={handleDialogClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <BugReports />
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'suggestion'} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Make a Suggestion or Feature Request
          <IconButton aria-label="close" onClick={handleDialogClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Suggestions />
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'question'} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Ask a Question
          <IconButton aria-label="close" onClick={handleDialogClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Questions />
        </DialogContent>
      </Dialog>
    </>
  );
}
