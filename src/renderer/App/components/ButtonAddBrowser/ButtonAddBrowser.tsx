/* eslint-disable react/button-has-type */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import AddIcon from '@mui/icons-material/Add';

import { ButtonAddBrowserProps } from './Types';

import './style.css';

export const ButtonAddBrowser = ({ onClick }: ButtonAddBrowserProps) => {
  return <AddIcon id="ButtonAddBrowser" onClick={() => onClick({})} />;
};
