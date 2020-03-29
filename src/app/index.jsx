import '../normalize.min.css';
import { h, render } from 'preact';
import { App } from './components/App.jsx';

render(<App/>, document.body);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((reg) => {
        console.log('Service worker registered.', reg);
      });
  });
}
