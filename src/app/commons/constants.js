const VIRUS_DATA_API_BASE_URL = 'https://covid-tracker-us.herokuapp.com/v2/';

export const GLOBAL_VIRUS_DATA_API_URL = `${VIRUS_DATA_API_BASE_URL}latest`;
export const LATEST_REGIONAL_VIRUS_DATA_API_URL = `${VIRUS_DATA_API_BASE_URL}locations`;
export const HISTORICAL_REGIONAL_VIRUS_DATA_API_BASE_URL = `${VIRUS_DATA_API_BASE_URL}locations/`;
export const ASSETS_BASE_URL = 'assets/';

export const LOCALES = {
  en_EN: 'en_EN',
  pl_PL: 'pl_PL',
};
export const DEFAULT_LOCALE = LOCALES.en_EN;

export const DATA_GRANULARITIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
};

export const DEFAULT_DATA_GRANULARITY = DATA_GRANULARITIES.DAILY;
export const DEFAULT_REGION = 'none';
export const DEFAULT_DATE = 0;