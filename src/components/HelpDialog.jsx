import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, CircularProgress, IconButton, Typography, Tooltip, Button } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import UnderConstruction from 'pages/maintenance/under-construction';
import CloseIcon from '@mui/icons-material/Close';
import { fetcher } from 'utils/axiosCms';

export default function HelpDialog({ id, text }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState({ title: '', body: '' });
  const [error, setError] = useState(false);

  const openDialog = () => {
    setError(false);
    setPage({ title: '', body: '' });
    setOpen(true);
  };
  const closeDialog = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);

    (async () => {
      try {
        const { data } = await fetcher(`helpdocs/help/${id}/`);
        setPage(data);
      } catch (err) {
        console.error('Help page load failed:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, id]);

  return (
    <>
      {text ? (
        <Button onClick={openDialog} variant="text" sx={{ textTransform: 'none', p: 0 }}>
          {text}
        </Button>
      ) : (
        <Tooltip title="Help">
          <IconButton onClick={openDialog} size="small">
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="lg">
        <DialogTitle>
          {loading ? 'Loading…' : error ? 'Coming Soon' : page.title}
          <IconButton aria-label="close" onClick={closeDialog} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ minHeight: 200, position: 'relative' }}>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <>
              <UnderConstruction />
              <Typography variant="caption" color="text.secondary" sx={{ position: 'absolute', bottom: 8, right: 16 }}>
                Ref: {id}
              </Typography>
            </>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: page.body }} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

HelpDialog.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string
};

HelpDialog.defaultProps = {
  text: null
};
