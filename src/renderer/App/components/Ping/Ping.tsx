import { useEffect } from 'react';
import { logEvent } from 'firebase/analytics';

import { analytics } from 'renderer/App/firebase';

export const Ping = () => {
  useEffect(() => {
    logEvent(analytics, 'ping');
    setInterval(() => {
      logEvent(analytics, 'ping');
    }, 60000);
  }, []);

  return <div />;
};
