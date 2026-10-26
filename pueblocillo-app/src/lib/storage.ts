import { HouseholdCensusRecord, VillageSettings } from '@/types/census';
import { INITIAL_CENSUS_RECORDS } from '@/data/seedRecords';

const STORAGE_KEY_RECORDS = 'pueblocillo_census_records_v1';
const STORAGE_KEY_SETTINGS = 'pueblocillo_census_settings_v1';
const STORAGE_KEY_ACTIVE_USER = 'pueblocillo_active_user_v1';

export const loadStoredRecords = (): HouseholdCensusRecord[] => {
  if (typeof window === 'undefined') return INITIAL_CENSUS_RECORDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(INITIAL_CENSUS_RECORDS));
      return INITIAL_CENSUS_RECORDS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load records from localStorage', err);
    return INITIAL_CENSUS_RECORDS;
  }
};

export const saveStoredRecords = (records: HouseholdCensusRecord[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save records to localStorage', err);
  }
};

export const loadStoredSettings = (): VillageSettings => {
  const defaultSettings: VillageSettings = {
    villageName: 'Pueblocillo Village (Brgy. Langkaan, Dasmariñas, Cavite)',
    totalLotsBaseline: 480,
    subdivisionCode: 'PUEBLOCILLO-NDC',
    location: 'Brgy. Langkaan II, Dasmariñas City, Cavite'
  };

  if (typeof window === 'undefined') return defaultSettings;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load settings', err);
    return defaultSettings;
  }
};

export const saveStoredSettings = (settings: VillageSettings): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
};

export const loadActiveUser = (): string => {
  if (typeof window === 'undefined') return 'Encoder 1 (Field Coordinator)';
  return localStorage.getItem(STORAGE_KEY_ACTIVE_USER) || 'Encoder 1 (Field Coordinator)';
};

export const saveActiveUser = (userName: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_ACTIVE_USER, userName);
};
