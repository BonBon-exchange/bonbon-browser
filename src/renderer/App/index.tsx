import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/electron/renderer';

import { App } from './App';

import './index.css';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

Sentry.init({
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
