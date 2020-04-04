import { h } from 'preact';
import './Main.css';

export const Main = ({ children }) =>
  <main>
    <div class="wrapper">
      <div class="sections">
        {children}
      </div>
    </div>
  </main>;
