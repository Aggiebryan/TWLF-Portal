import { AppState } from '../types';
import { INITIAL_PAGES, DEFAULT_SETTINGS } from '../constants';

const STORAGE_KEY = 'twlf_portal_data_v1';

export const loadState = (): AppState => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized) {
      const parsed = JSON.parse(serialized);
      // Ensure settings exist for migrated data
      return {
        ...parsed,
        settings: parsed.settings || DEFAULT_SETTINGS
      };
    }
  } catch (e) {
    console.error("Failed to load state", e);
  }
  
  return {
    pages: INITIAL_PAGES,
    activePageId: INITIAL_PAGES[0].id,
    settings: DEFAULT_SETTINGS
  };
};

export const saveState = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
};