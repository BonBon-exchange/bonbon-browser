/* eslint-disable import/prefer-default-export */
import { useAppSelector } from 'renderer/App/store/hooks';

export const useSettings = () => {
  const { settings }: { settings: Record<string, any> } = useAppSelector(
    (state) => state.settings
  );

  return settings;
};
