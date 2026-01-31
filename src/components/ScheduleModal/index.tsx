import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { fetchSchedule } from '../../services/scheduleService';
import type { Provider, ScheduleDay } from '../../types';
import toast from 'react-hot-toast';
import styles from './ScheduleModal.module.css';

interface ScheduleModalProps {
  provider: Provider | null;
  onClose: () => void;
}

export default function ScheduleModal({ provider, onClose }: ScheduleModalProps) {
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  useEffect(() => {
    if (provider) {
      // Reset state
      setStep(1);
      setSelectedTime(null);
      // Fetch data
      fetchSchedule(provider).then(setSchedule);
    }
  }, [provider]);

  if (!provider) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className={styles.modal}
          initial={{ scale: 0.9, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 100 }}
          onClick={e => e.stopPropagation()}
        >
          <div className={styles.header}>
            <div>
              <h2>Book Appointment</h2>
              <p>with {provider.name}</p>
            </div>
            <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
          </div>

          <div className={styles.content}>
            {/* Step 1: Date & Time */}
            {step === 1 && (
              <div className={styles.stepContainer}>
                <div className={styles.dateScroll}>
                  {schedule.map((day, i) => (
                    <button
                      key={i}
                      className={`${styles.dateBtn} ${selectedDay === i ? styles.selectedDay : ''}`}
                      onClick={() => setSelectedDay(i)}
                      disabled={day.isClosed}
                    >
                      <span className={styles.dayName}>{day.dayName}</span>
                      <span className={styles.dayNum}>{day.dayNum}</span>
                    </button>
                  ))}
                </div>

                <div className={styles.timeGrid}>
                  {schedule[selectedDay]?.slots.map(time => (
                    <button
                      key={time}
                      className={`${styles.timeBtn} ${selectedTime === time ? styles.selectedTime : ''}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                  {schedule[selectedDay]?.slots.length === 0 && (
                    <p className={styles.empty}>No slots available for this date.</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Form would go here (Simplified for now) */}
          </div>

          <div className={styles.footer}>
            <button 
              className={styles.primaryBtn}
              disabled={!selectedTime}
              onClick={() => {
                if (selectedTime) {
                  toast.success('Booking feature coming soon!');
                  onClose();
                }
              }}
            >
              Confirm Booking <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
