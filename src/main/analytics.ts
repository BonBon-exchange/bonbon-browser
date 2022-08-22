/* eslint-disable import/prefer-default-export */
import Nucleus from 'nucleus-analytics';

import { Event, Page } from 'types/analytics';

export const event: Event = (eventName, params) => {
  Nucleus.track(eventName, params);
};

export const page: Page = (pageName, params) => {
  Nucleus.page(pageName, params || {});
};
