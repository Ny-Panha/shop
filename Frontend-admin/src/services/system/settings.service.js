import { adminStore } from '../../data/adminStore';

export const settingsService = {
  get: () => adminStore.getSettings(),
  save: (settings) => adminStore.saveSettings(settings),
};
