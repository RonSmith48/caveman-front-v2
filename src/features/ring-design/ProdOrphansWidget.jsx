import { useState, useEffect } from 'react';
import { useNotifier } from 'contexts/NotifierContext';
import {
  AppBar,
  Box,
  Grid,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  Toolbar
} from '@mui/material';
import HelpDialog from 'components/HelpDialog';
import CloseIcon from '@mui/icons-material/Close';
import HoverSocialCard from 'components/cards/HoverSocialCard';
import MainCard from 'components/MainCard';
import { fetcher } from 'utils/axiosBack'; // Assuming fetcher is configured for axios
import { ColumnWidthOutlined } from '@ant-design/icons';
import { enqueueSnackbar } from 'notistack';
import ProdOrphans from 'features/ring-design/ProdOrphans';

export default function ProdOrphansWidget() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const [orphanCount, setOrphanCount] = useState(0);
  const [orphansData, setOrphansData] = useState([]);
  const { notify, subscribe } = useNotifier();

  const fetchOrphanCount = async () => {
    try {
      const response = await fetcher('api/prod-actual/orphaned-rings/');
      if (response && Array.isArray(response.data)) {
        setOrphanCount(response.data.length);
        setOrphansData(response.data);
      }
    } catch (error) {
      console.error('Error fetching orphaned rings:', error);
      enqueueSnackbar('Error fetching orphaned rings', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchOrphanCount(); // initial fetch

    const unsub = subscribe('orphans/refresh', fetchOrphanCount); // listen for updates
    return unsub;
  }, []);

  const handleProcessClick = async () => {
    try {
      setLoading(true);
      const response = await fetcher('api/prod-actual/orphaned-rings/process/');
      if (response?.data?.msg?.body) {
        enqueueSnackbar(response.data.msg.body, { variant: 'success' });
        notify('summary/refresh');
      } else {
        enqueueSnackbar('Orphaned rings processed', { variant: 'success' });
      }

      // Always refetch the orphan list afterwards
      await fetchOrphanCount();
    } catch (error) {
      console.error('Error processing orphaned rings:', error);
      enqueueSnackbar('Error processing orphaned rings', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFullScreenOpen = async () => {
    await fetchOrphanCount(); // refresh data before showing
    setFullScreenOpen(true);
  };

  const handleFullScreenClose = () => setFullScreenOpen(false);

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <>
      <MainCard>
        <Grid item xs={12}>
          <HoverSocialCard
            primary="Orphaned Production Rings"
            secondary={orphanCount}
            iconPrimary={ColumnWidthOutlined}
            color="primary.main"
          />
        </Grid>
        <Grid container item direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
          <Grid item>
            <Button variant="outlined" onClick={handleProcessClick} disabled={loading}>
              {loading ? 'Processing' : 'Process'}
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={handleFullScreenOpen}>
              View Table
            </Button>
          </Grid>
          <Grid item sx={{ ml: 1 }}>
            <Typography>Match designed and concept rings</Typography>
            <Box display="flex" justifyContent="flex-end">
              <HelpDialog id={10} text="Learn more" />
            </Box>
          </Grid>
        </Grid>
      </MainCard>

      {/* Dialog box */}
      <Dialog fullScreen open={fullScreenOpen} onClose={handleFullScreenClose}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              Orphaned Production Rings
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleFullScreenClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <ProdOrphans data={orphansData} />
        </DialogContent>
      </Dialog>
    </>
  );
}
