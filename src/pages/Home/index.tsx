import { Box, Card, CardActionArea, Skeleton, Typography, Button, Stack, Chip } from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useApp } from '../../context/AppContext';
import TestimonialsMarquee from '../../components/TestimonialsMarquee';

export default function Home() {
  const { state } = useApp();

  return (
    <Box>
      {/* Premium Hero */}
      <Box
        sx={{
          borderRadius: 4,
          p: { xs: 2.5, md: 5 },
          mb: 4,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          position: 'relative',
          background:
            'radial-gradient(1200px 600px at 20% 0%, rgba(138,11,11,0.12), transparent 60%), radial-gradient(900px 500px at 80% 10%, rgba(139,92,246,0.12), transparent 55%), linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.65))',
          backdropFilter: 'blur(14px)',
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label="Integrated care" color="primary" variant="outlined" />
            <Chip label="No signup needed" color="secondary" variant="outlined" />
            <Chip label="Mobile-first app" color="success" variant="outlined" />
          </Stack>

          <Typography variant="h2">
            Hillside <span className="gradient-text">Health Hub</span>
          </Typography>
          <Typography sx={{ maxWidth: 720 }}>
            A modern, app-like experience to book appointments, ask questions (reviewed by admin), and explore health resources.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 1 }}>
            <Button
              href="/providers"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 999 }}
            >
              Book Appointment
            </Button>
            <Button
              href="/community"
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 999 }}
            >
              Ask a Question
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Typography variant="h3" sx={{ mb: 2 }}>
        Our Medical Groups
      </Typography>

      {/* Mobile: 2 square blocks per row */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {(state.partners?.length ? state.partners : Array.from({ length: 5 }).map((_, i) => ({ id: `ph-${i}` } as any))).map(
          (p: any) => (
            <Grid key={p.id} item xs={6} sm={4} md={3}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  aspectRatio: '1 / 1',
                  overflow: 'hidden',
                }}
              >
                <CardActionArea
                  href={p.websiteUrl || undefined}
                  target={p.websiteUrl ? '_blank' : undefined}
                  sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                >
                  {p.logoUrl ? (
                    <Box component="img" src={p.logoUrl} alt={p.name} sx={{ width: '80%', height: 56, objectFit: 'contain' }} />
                  ) : (
                    <Skeleton variant="rounded" width="80%" height={56} />
                  )}
                  <Box sx={{ mt: 1.25, width: '100%', textAlign: 'center' }}>
                    {p.name ? (
                      <Typography sx={{ fontWeight: 900, fontSize: 13, lineHeight: 1.2 }}>
                        {p.name}
                      </Typography>
                    ) : (
                      <Skeleton width="70%" sx={{ mx: 'auto' }} />
                    )}
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ),
        )}
      </Grid>

      {/* Reviews marquee (scrollable / animated like your snippet) */}
      <Typography variant="h3" sx={{ mb: 2 }}>
        Reviews
      </Typography>
      <TestimonialsMarquee />

    </Box>
  );
}
