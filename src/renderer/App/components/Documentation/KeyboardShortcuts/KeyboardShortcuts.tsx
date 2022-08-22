/* eslint-disable import/prefer-default-export */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const KeyboardShortcuts: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.app.analytics.page('/documentation/keyboardShortcuts');
  }, []);

  return (
    <>
      <h2>{t('Documentation')}</h2>
      <div className="Documentation__item">
        <div className="Documentation__item-title">
          CTRL + f - Search in a webpage
        </div>
        <div className="Documentation__item-description">
          {t('Pressing CTRL and F at the same time will open a search area.')}
        </div>
      </div>
      <div className="Documentation__item">
        <div className="Documentation__item-title">
          CTRL + t - Open a new webpage
        </div>
        <div className="Documentation__item-description">
          {t(
            'Pressing CTRL and T at the same time will open a new webpage (named Tab in other browsers).'
          )}
        </div>
      </div>
      <div className="Documentation__item">
        <div className="Documentation__item-title">
          CTRL + SHIFT + t - Reopen last closed webpage
        </div>
        <div className="Documentation__item-description">
          {t(
            'Pressing CTRL, SHIFT and T at the same time will reopen a last closed webpage (named Tab in other browsers).'
          )}
        </div>
      </div>
      <div className="Documentation__item">
        <div className="Documentation__item-title">
          CTRL + r - Reload webpage
        </div>
        <div className="Documentation__item-description">
          {t(
            'Pressing CTRL and R at the same time will reload the current focused webpage (named Tab in other browsers).'
          )}
        </div>
      </div>
      <div className="Documentation__item">
        <div className="Documentation__item-title">
          CTRL + w - Close webpage
        </div>
        <div className="Documentation__item-description">
          {t(
            'Pressing CTRL and W at the same time will close the current focused webpage (named Tab in other browsers). If no webpage are open in the collection (upper tabulation), then the collection will be closed.'
          )}
        </div>
      </div>
      <div className="Documentation__item">
        <div className="Documentation__item-title">
          CTRL + SHIFT + w - Close collection
        </div>
        <div className="Documentation__item-description">
          {t(
            'Pressing CTRL, SHIFT and W at the same time will close the current collection (upper tabulation).'
          )}
        </div>
      </div>
      <div className="Documentation__item">
        <div className="Documentation__item-title">
          CTRL + TAB - Focus the next webpage
        </div>
        <div className="Documentation__item-description">
          {t(
            'Pressing CTRL and TAB at the same time will focus the next webpage (named Tab in other browsers).'
          )}
        </div>
      </div>
      <div className="Documentation__item">
        <div className="Documentation__item-title">
          CTRL + SHIFT + TAB - Focus the next collection
        </div>
        <div className="Documentation__item-description">
          {t(
            'Pressing CTRL, SHIFT and TAB at the same time will focus the next collection (upper tabulation).'
          )}
        </div>
      </div>
      <div className="Documentation__item">
        <div className="Documentation__item-title">
          ALT + Scroll - Efficiently scroll in the document
        </div>
        <div className="Documentation__item-description">
          {t(
            'Pressing ALT and Scrolling at the same time will scroll into the document without stopping hover the webpages.'
          )}
        </div>
      </div>
    </>
  );
};
