import { Box, Card, CardContent, Typography, Stack, Avatar } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import styles from './TestimonialsMarquee.module.css';

export type Testimonial = {
  name: string;
  role?: string;
  avatarUrl: string;
  quote: string;
};

const defaultTestimonials: Testimonial[] = [
  {
    name: 'Jessica M.',
    role: 'Patient',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&q=75',
    quote: '“The booking experience is super smooth — I found a slot in minutes.”',
  },
  {
    name: 'Robert D.',
    role: 'Patient',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=75',
    quote: '“Professional care team. Clear communication and fast follow-up.”',
  },
  {
    name: 'Sarah K.',
    role: 'Patient',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=96&q=75',
    quote: '“The community answers helped me understand my symptoms better.”',
  },
  {
    name: 'Amit S.',
    role: 'Patient',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&q=75',
    quote: '“The UI feels like a real app. Everything is where I expect it.”',
  },
  {
    name: 'Mia W.',
    role: 'Patient',
    avatarUrl: 'https://images.unsplash.com/photo-1520975958225-3f61d3a1c77e?auto=format&fit=crop&w=96&q=75',
    quote: '“Health resources are nicely organized. Great for quick learning.”',
  },
];

function Row({
  testimonials,
  direction,
  durationSec,
}: {
  testimonials: Testimonial[];
  direction: 'left' | 'right';
  durationSec: number;
}) {
  // Duplicate list to create seamless loop (animation moves -50%)
  const list = [...testimonials, ...testimonials];

  return (
    <Box
      className={`${styles.viewport} ${styles.pauseOnHover} ${direction === 'left' ? styles.rowLeft : styles.rowRight}`}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'rgba(0,0,0,0.02)',
      }}
      style={{ ['--marquee-duration' as any]: `${durationSec}s` }}
    >
      <Box className={styles.track}>
        {list.map((t, idx) => (
          <Card
            key={`${t.name}-${idx}`}
            className={styles.card}
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'rgba(0,0,0,0.06)',
              bgcolor: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(14px)',
            }}
          >
            <FormatQuoteIcon className={styles.quote} sx={{ fontSize: 26, color: 'text.primary' }} />
            <CardContent sx={{ p: 2.25 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                <Box className={styles.avatarWrap}>
                  <Avatar
                    src={t.avatarUrl}
                    alt={t.name}
                    sx={{ width: 48, height: 48, borderRadius: '14px' }}
                    imgProps={{ loading: 'lazy', referrerPolicy: 'no-referrer' }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, lineHeight: 1.2 }}>{t.name}</Typography>
                  {t.role ? (
                    <Typography variant="body2" color="text.secondary">
                      {t.role}
                    </Typography>
                  ) : null}
                </Box>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.5 }}>
                {t.quote}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default function TestimonialsMarquee({
  testimonials = defaultTestimonials,
}: {
  testimonials?: Testimonial[];
}) {
  return (
    <Box className={styles.root}>
      <Row testimonials={testimonials} direction="left" durationSec={46} />
      <Row testimonials={[...testimonials].reverse()} direction="right" durationSec={52} />
    </Box>
  );
}


