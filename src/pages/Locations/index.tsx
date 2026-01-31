import { Box, Card, CardActionArea, CardContent, Typography, Button } from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PlaceIcon from '@mui/icons-material/Place';
import { useApp } from '../../context/AppContext';

export default function Locations() {
  const { state } = useApp();

  return (
    <Box>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Locations
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Find us and open directions in Google Maps.
      </Typography>

      <Grid container spacing={2}>
        {state.locations?.length ? (
          state.locations.map((loc) => (
            <Grid key={loc.id} item xs={12} sm={6} md={4}>
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardActionArea href={loc.gmapUrl} target="_blank">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <PlaceIcon color="primary" />
                      <Typography fontWeight={900}>{loc.name}</Typography>
                    </Box>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                      {loc.address}
                    </Typography>
                    <Button endIcon={<OpenInNewIcon />} variant="contained">
                      Open in Maps
                    </Button>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography fontWeight={900} sx={{ mb: 1 }}>
                  No locations yet
                </Typography>
                <Typography color="text.secondary">
                  Add locations from the admin panel.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}


