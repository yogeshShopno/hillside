import type { ScheduleDay, Provider } from '../types';

/**
 * Schedule Service
 * 
 * Handles fetching and generating schedule data for providers.
 * 
 * NOTE: Direct scraping from PatientFusion is not possible from client-side
 * due to CORS restrictions. In production, you would need:
 * 
 * 1. A backend proxy server (Node.js, Python, etc.)
 * 2. A serverless function (Firebase Functions, AWS Lambda)
 * 3. An official API from PatientFusion (if available)
 * 
 * The generateMockSchedule function below simulates available slots.
 * Replace it with actual API calls in production.
 */

// Time slots configuration
const WEEKDAY_SLOTS = [
  '7:30am', '8:00am', '8:30am', '9:00am', '9:30am', '10:00am',
  '10:30am', '11:00am', '11:30am', '1:00pm', '1:30pm', '2:00pm',
  '2:30pm', '3:00pm', '3:30pm'
];

const SATURDAY_SLOTS = ['8:00am', '8:30am', '9:00am', '9:30am', '10:00am', '10:30am', '11:00am', '11:30am'];

/**
 * Generate mock schedule data for a provider
 * Uses provider ID and date as seed for consistent (but varied) results
 */
export const generateScheduleData = (providerId: string, days: number = 7): ScheduleDay[] => {
  const today = new Date();
  const schedule: ScheduleDay[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayOfWeek = date.getDay();
    const isSunday = dayOfWeek === 0;
    const isSaturday = dayOfWeek === 6;
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const fullDate = date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
    
    let slots: string[] = [];
    
    if (!isSunday) {
      const availableSlots = isSaturday ? SATURDAY_SLOTS : WEEKDAY_SLOTS;
      
      // Generate pseudo-random but consistent slots based on provider and date
      const seed = (providerId.charCodeAt(0) + dayNum + i) % 10;
      slots = availableSlots.filter((_, idx) => (idx + seed) % 3 === 0);
      
      // Ensure at least 1-2 slots per day
      if (slots.length === 0 && availableSlots.length > 0) {
        slots = [availableSlots[seed % availableSlots.length]];
      }
    }
    
    schedule.push({
      date: fullDate,
      dayName,
      dayNum,
      month,
      isClosed: isSunday,
      slots
    });
  }
  
  return schedule;
};

/**
 * Fetch schedule from PatientFusion via backend proxy
 * 
 * In production, implement this function to call your backend:
 * 
 * export const fetchScheduleFromPatientFusion = async (patientFusionUrl: string): Promise<ScheduleDay[]> => {
 *   const response = await fetch(`/api/schedule?url=${encodeURIComponent(patientFusionUrl)}`);
 *   if (!response.ok) throw new Error('Failed to fetch schedule');
 *   return response.json();
 * };
 */
export const fetchSchedule = async (provider: Provider): Promise<ScheduleDay[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In production, this would call your backend proxy:
  // return fetchScheduleFromPatientFusion(provider.patientFusionUrl);
  
  // For now, return mock data
  return generateScheduleData(provider.id);
};

/**
 * Parse schedule HTML from PatientFusion
 * This would be used on the backend to parse the scraped HTML
 * 
 * Example backend implementation (Node.js with Cheerio):
 * 
 * const cheerio = require('cheerio');
 * 
 * function parseScheduleHtml(html: string): ScheduleDay[] {
 *   const $ = cheerio.load(html);
 *   const schedule: ScheduleDay[] = [];
 *   
 *   // Parse header dates
 *   const dates: string[] = [];
 *   $('.picker-table-thead th span').each((i, el) => {
 *     dates.push($(el).text());
 *   });
 *   
 *   // Parse time slots
 *   const slotsByDay: string[][] = dates.map(() => []);
 *   $('.picker-table-tbody tr').each((rowIdx, row) => {
 *     $(row).find('td').each((colIdx, cell) => {
 *       const time = $(cell).find('.picker-cell-time').attr('data-value');
 *       if (time) {
 *         const date = new Date(time);
 *         const timeStr = date.toLocaleTimeString('en-US', { 
 *           hour: 'numeric', 
 *           minute: '2-digit',
 *           hour12: true 
 *         }).toLowerCase();
 *         slotsByDay[colIdx]?.push(timeStr);
 *       }
 *     });
 *   });
 *   
 *   // Build schedule objects
 *   dates.forEach((dateStr, i) => {
 *     // Parse "Thu, Dec 18" format
 *     const [dayName, monthDay] = dateStr.split(', ');
 *     const [month, dayNum] = monthDay.split(' ');
 *     
 *     schedule.push({
 *       date: `${month} ${dayNum}, ${new Date().getFullYear()}`,
 *       dayName,
 *       dayNum: parseInt(dayNum),
 *       month,
 *       isClosed: slotsByDay[i]?.length === 0 && dayName === 'Sun',
 *       slots: slotsByDay[i] || []
 *     });
 *   });
 *   
 *   return schedule;
 * }
 */

/**
 * Get YouTube video ID from URL
 */
export const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

/**
 * Get YouTube thumbnail URL
 */
export const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  return videoId 
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : '';
};

/**
 * Format time ago string
 */
export const formatTimeAgo = (date: Date | string): string => {
  const now = new Date();
  const past = typeof date === 'string' ? new Date(date) : date;
  const diff = now.getTime() - past.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return past.toLocaleDateString();
};

