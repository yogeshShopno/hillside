import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Footer from '../../components/Footer';

const groups = [
  {
    name: 'Hillside Primary Care',
    logo: 'https://www.hillsideprimarycare.com/wp-content/uploads/2023/09/hillside-logo.png',
    url: 'https://hillsideprimarycare.com',
    desc: 'Comprehensive primary care focused on long-term wellness.',
  },
  {
    name: "Women's Wellness of SA",
    logo: 'https://www.womenswellnessofsa.com/wp-content/uploads/2024/02/logo.png',
    url: 'https://www.womenswellnessofsa.com/',
    desc: 'Specialized healthcare for women at every stage.',
  },
  {
    name: 'Psych of SA',
    logo: 'https://www.psychofsa.com/wp-content/uploads/2024/04/cropped-logo-t-1.png',
    url: 'https://www.psychofsa.com/',
    desc: 'Mental health therapy and psychiatric evaluations.',
  },
  {
    name: 'Podiatry of SA',
    logo: 'https://podiatryofsa.com/wp-content/uploads/2024/04/brandmark-design__6_-removebg-preview.png',
    url: 'https://podiatryofsa.com/',
    desc: 'Expert foot and ankle care for better mobility.',
  },
  {
    name: 'Physical Therapy of SA',
    logo: 'https://physicaltherapyofsa.com/wp-content/uploads/2024/02/Logo-1.png',
    url: 'https://physicaltherapyofsa.com/',
    desc: 'Rehab services to restore strength and function.',
  },
];

export default function About() {
  return (
    <Box>
      <Typography variant="h2" sx={{ mb: 1 }}>
        About <span className="gradient-text">Hillside</span>
      </Typography>
      <Typography sx={{ mb: 3 }}>
        This app connects patients to Hillside’s integrated healthcare network: providers, community Q&A, and health resources.
      </Typography>

      <Typography variant="h3" sx={{ mb: 2 }}>
        Medical Groups
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {groups.map((g) => (
          <Grid key={g.name} item xs={12} md={6}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box
                  component="img"
                  src={g.logo}
                  alt={g.name}
                  sx={{ width: 84, height: 52, objectFit: 'contain', flexShrink: 0 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {g.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {g.desc}
                  </Typography>
                </Box>
                <Button href={g.url} target="_blank" endIcon={<OpenInNewIcon />} variant="contained">
                  Visit
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Footer should exist ONLY on About page (per your requirement) */}
      <Footer />
    </Box>
  );
}


