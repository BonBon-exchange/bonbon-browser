import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase';

export const useAnalytics = () => {
  const anal = {
    logEvent: (name: string, params?: Record<string, any>) => {
      logEvent(analytics, name, params);
    },
  };

  return {
    anal,
  };
};
