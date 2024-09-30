import { useEffect } from 'react';
import { useMessaging } from 'renderer/App/hooks/useMessaging';

export const SettingsStateSynced = () => {
  const { connectedUsers } = useMessaging();
  useEffect(() => {
    console.log({ connectedUsers });
  }, [connectedUsers]);

  return <div />;
};
