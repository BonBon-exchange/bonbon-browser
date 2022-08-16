/* eslint-disable import/prefer-default-export */
import Nucleus from 'nucleus-nodejs';

import { Event } from 'types/analytics';

export const event: Event = (eventName, params) => {
  Nucleus.track(eventName, params);
};
