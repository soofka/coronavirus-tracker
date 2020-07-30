import { h } from 'preact';

import { Text } from 'components/Text';
import { SmartSelect } from 'components/SmartSelect';
import { InstallButton } from 'components/InstallButton';

import { useLabels } from 'components/App/LabelsProvider.jsx';

import { LOCALES, DEFAULT_LOCALE } from 'commons/constants';

import './Header.css';

const LOCALE_QUERY_STRING_KEY = 'locale';
const LOCALE_STORAGE_KEY = 'LOCALE';

const LANGUAGES = {
  [LOCALES.en_EN]: 'English',
  [LOCALES.pl_PL]: 'Polski',
};

export const Header = () => {
  const { locale, setLocale } = useLabels();

  const localeOptions = [];
  Object.values(LOCALES).forEach((tempLocale) => localeOptions.push({ value: tempLocale, text: LANGUAGES[tempLocale] }));
  
  return (
    <header>
      <div class="wrapper">
        <nav>
          <small>
            <ul>
              <li><a href="https://trackcorona.today/">👑 Track<strong><span class="virus">CORONA</span></strong>.today</a></li>
              <li>
                <SmartSelect
                  id="select-language"
                  label={<Text label="navigation.select_language"/>}
                  options={localeOptions}
                  value={locale}
                  setValue={setLocale}
                />
              </li>
              <li><InstallButton/></li>
            </ul>
          </small>
        </nav>
      </div>
    </header>
  );
};
