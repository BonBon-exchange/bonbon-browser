/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */

import React from 'react';
import { CloseButton } from 'renderer/App/components/CloseButton';

import { PopupProps } from './Types';

import './style.scss';

export const Popup = ({ children, closePopup, title }: PopupProps) => {
  const handleBackgroundClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };
  return (
    <div className="Popup__overlay" onClick={handleBackgroundClick}>
      <div id="Popup__container">
        <CloseButton handleClose={closePopup} />

        <div id="Popup__title">{title}</div>
        {children}
      </div>
    </div>
  );
};
