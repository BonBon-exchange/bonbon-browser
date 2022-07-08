/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/prefer-default-export */
import CloseIcon from '@mui/icons-material/Close';

import { CloseButtonProps } from './Types';

import './style.scss';

export const CloseButton: React.FC<CloseButtonProps> = ({
  handleClose,
}: CloseButtonProps) => {
  return (
    <div className="CloseButton__container" onClick={handleClose}>
      <CloseIcon />
    </div>
  );
};
