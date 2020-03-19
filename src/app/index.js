import { app } from './components/app';
import * as utils from './utils';

app(() => utils.registerServiceWorker('/service-worker.js'));
