import { useMemo, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useApp } from '../../context/AppContext';

const categories = [
  'Primary Care',
  'Mental Health',
  'Feet Health',
  'Weight Loss',
  "Women's Health",
  'Physical Therapy',
  'Other',
];

export default function Community() {
  const { state, actions } = useApp();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [question, setQuestion] = useState('');

  // Public should only see answered questions that have passed review.
  const publicQuestions = useMemo(
    () => state.questions.filter((q) => q.status === 'answered'),
    [state.questions],
  );

  const reset = () => {
    setStep(0);
    setName('');
    setCategory(categories[0]);
    setQuestion('');
  };

  const submit = async () => {
    await actions.addQuestion({
      authorName: name.trim(),
      category,
      text: question.trim(),
    });
    setOpen(false);
    reset();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <Box>
          <Typography variant="h2" sx={{ mb: 0.5 }}>
            Community <span className="gradient-text">Q&A</span>
          </Typography>
          <Typography color="text.secondary">
            Ask a question. It will be reviewed by admin first, then answered and published here.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<QuestionAnswerIcon />} onClick={() => setOpen(true)}>
          Ask a Question
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {publicQuestions.length === 0 ? (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography fontWeight={900} sx={{ mb: 1 }}>
              No published answers yet
            </Typography>
            <Typography color="text.secondary">
              Be the first to ask — your question will go to the admin for review.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gap: 1 }}>
          {publicQuestions.map((q) => (
            <Accordion key={q.id} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 900, lineHeight: 1.25 }} noWrap>
                      {q.text}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      Asked by {q.authorName}
                    </Typography>
                  </Box>
                  <Chip label={q.category} color="secondary" variant="outlined" />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: 'background.default' }}>
                <Chip label="Hillside Team Reply" color="success" sx={{ mb: 1 }} />
                <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
                  {q.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      <Dialog open={open} onClose={() => (setOpen(false), reset())} fullWidth maxWidth="sm">
        <DialogTitle>Ask a question</DialogTitle>
        <DialogContent>
          <Stepper activeStep={step} sx={{ mt: 1, mb: 2 }}>
            <Step>
              <StepLabel>Name</StepLabel>
            </Step>
            <Step>
              <StepLabel>Question</StepLabel>
            </Step>
          </Stepper>

          {step === 0 ? (
            <TextField
              autoFocus
              label="Your name"
              placeholder="Enter your full name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              helperText="Required — we ask this before the question."
            />
          ) : (
            <Box sx={{ display: 'grid', gap: 2 }}>
              <TextField
                select
                label="Category"
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Your question"
                placeholder="Type your health question…"
                fullWidth
                multiline
                minRows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                helperText="This will be sent to admin for review before it is published."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {step === 0 ? (
            <>
              <Button onClick={() => (setOpen(false), reset())}>Cancel</Button>
              <Button variant="contained" onClick={() => setStep(1)} disabled={name.trim().length < 2}>
                Continue
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setStep(0)}>Back</Button>
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={submit}
                disabled={name.trim().length < 2 || question.trim().length < 10}
              >
                Submit for review
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
