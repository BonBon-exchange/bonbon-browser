/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { Button } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { useTranslation } from 'react-i18next';

import { useAppSelector, useAppDispatch } from 'renderer/App/store/hooks';

import {
  DownloadItem,
  DownloadsState,
  clearDownloads,
} from 'renderer/App/store/reducers/Downloads';

import './style.scss';

export const DownloadsPreview: React.FC = () => {
  const { t } = useTranslation();
  const { items }: DownloadsState = useAppSelector((state) => state.downloads);
  const dispatch = useAppDispatch();

  const handleOnClick = (i: DownloadItem) => {
    window.app.tools.showItemInFolder(i.savePath);
  };

  const handleClear = () => {
    dispatch(clearDownloads());
    window.app.download.hideDownloadsPreview();
  };

  return (
    <div id="DownloadsPreview__container">
      <ul>
        {items.map((i) => {
          return (
            <li
              onClick={() => handleOnClick(i)}
              key={`${i.etag}::${i.startTime}`}
            >
              <div className="DownloadsPreview__item-name">{i.filename}</div>
              {i.state !== 'progressing' && i.state !== 'completed' && (
                <div className="DownloadsPreview__item-state">
                  {i.state ? t(i.state) : ''}
                </div>
              )}
              {i.state !== 'completed' && (
                <LinearProgress
                  variant="determinate"
                  value={i.progress * 100}
                  className="DownloadsPreview__item-progress"
                />
              )}
            </li>
          );
        })}
      </ul>
      <div className="DownloadsPreview__clear" onClick={handleClear}>
        <Button variant="contained">Clear</Button>
      </div>
    </div>
  );
};
