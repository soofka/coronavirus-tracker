import { main } from './main';
import { header } from './header';

export const app = (init = () => {}) => {
  init();
  main();
  header();
};
