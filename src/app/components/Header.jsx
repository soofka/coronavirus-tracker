import { h } from 'preact';

import { SmartSelect } from './SmartSelect.jsx';
import { InstallButton } from './InstallButton.jsx';

import { useLabels } from '../providers/LabelsProvider.jsx';

import { LOCALES, DEFAULT_LOCALE } from '../commons/constants';

import './Header.css';

const LOCALE_QUERY_STRING_KEY = 'locale';
const LOCALE_STORAGE_KEY = 'LOCALE';

const LANGUAGES = {
  [LOCALES.en_EN]: 'English',
  [LOCALES.pl_PL]: 'Polski',
};

export const Header = () => {
  const { locale, setLocale } = useLabels();
  
  return (
    <header>
      <div class="wrapper">
        <nav>
          <ul>
            <li>👑 <span class="virus"><strong>CORONAVIRUS</strong></span> Tracker</li>
            <li>
              <SmartSelect
                value={locale}
                defaultValue={DEFAULT_LOCALE}
                queryStringKey={LOCALE_QUERY_STRING_KEY}
                storageKey={LOCALE_STORAGE_KEY}
                validate={(value) => Object.values(LOCALES).includes(value)}
                onChange={setLocale}
              >
                {Object.values(LOCALES).map(
                  (tempLocale) => <option value={tempLocale}>{LANGUAGES[tempLocale]}</option>
                )}
              </SmartSelect>
            </li>
            <li><InstallButton/></li>
          </ul>
        </nav>
      </div>
    </header>
  )
};
