import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ScheduleModal from '../../components/ScheduleModal';
import type { Provider } from '../../types';
import styles from './Providers.module.css';

export default function Providers() {
  const { state } = useApp();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className={styles.label}>Our Experts</span>
          <h1>Meet Your <span className="gradient-text">Care Team</span></h1>
          <p>World-class providers dedicated to your well-being.</p>
        </motion.div>
      </header>

      <div className={styles.grid}>
        {state.providers.map((provider, i) => (
          <motion.div
            key={provider.id}
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={styles.cardImage}>
              <div className={styles.imagePlaceholder}>
                {provider.imageUrl ? (
                  <img src={provider.imageUrl} alt={provider.name} />
                ) : (
                  <span className={styles.initials}>
                    {provider.name.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
              <div className={styles.verifiedBadge}>
                <Shield size={14} fill="currentColor" /> Verified
              </div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.meta}>
                <span className={styles.specialty}>{provider.specialty}</span>
                <div className={styles.rating}>
                  <Star size={14} fill="currentColor" /> 4.9
                </div>
              </div>

              <h3>{provider.name}</h3>
              <p className={styles.title}>{provider.title}</p>
              
              <div className={styles.location}>
                <MapPin size={16} />
                <span>{provider.address}</span>
              </div>

              <div className={styles.actions}>
                <button 
                  className={styles.bookBtn}
                  onClick={() => setSelectedProvider(provider)}
                >
                  Book Appointment <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ScheduleModal 
        provider={selectedProvider} 
        onClose={() => setSelectedProvider(null)} 
      />
    </div>
  );
}
