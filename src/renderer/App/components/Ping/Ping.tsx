import { useEffect } from 'react';

import { useAnalytics } from 'renderer/App/hooks/useAnalytics';

export const Ping = () => {
  const { anal } = useAnalytics();
  useEffect(() => {
    anal.logEvent('ping');
    setInterval(() => {
      anal.logEvent('ping');
    }, 60000);
  }, [anal]);

  return <div />;
};
