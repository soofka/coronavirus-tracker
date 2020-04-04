import { h } from 'preact';

import { ASSETS_BASE_URL } from 'commons/constants';

import './Background.css';

export const Background = () =>
  <div className="background">
    <img src={`${ASSETS_BASE_URL}virus.webp`}/>
  </div>;
