/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { useEffect } from 'react';

import { CloseButton } from 'renderer/App/components/CloseButton';

import { NotificationProps } from './Types';

import './style.scss';

export const Notification = ({ children, closePopup, className }: NotificationProps) => {

  useEffect(() => {
    setTimeout(() => {
      closePopup()
    }, 1500)
  }, [closePopup])

  return (
    <div id="Notification__container" className={className}>
      <CloseButton handleClose={closePopup} />
      {children}
    </div>
  );
};
