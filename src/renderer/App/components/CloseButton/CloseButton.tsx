/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/prefer-default-export */
import CloseIcon from '@mui/icons-material/Close';
import clsx from 'clsx';

import { CloseButtonProps } from './Types';

import './style.scss';

export const CloseButton: React.FC<CloseButtonProps> = ({
  handleClose,
  customClass,
}: CloseButtonProps) => {
  return (
    <div
      className={clsx('CloseButton__container', customClass)}
      onClick={handleClose}
      data-testid="close-button"
    >
      <CloseIcon />
    </div>
  );
};
