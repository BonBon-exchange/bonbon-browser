/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */

import { CloseButton } from 'renderer/App/components/CloseButton';

import { PopupProps } from './Types';

import './style.scss';

export const Popup: React.FC<PopupProps> = ({
  children,
  closePopup,
  title,
}: PopupProps) => {
  return (
    <div id="Popup__container">
      <CloseButton handleClose={closePopup} />

      <div id="Popup__title">{title}</div>
      {children}
    </div>
  );
};
