import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface SiteSettings {
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  heroLocation: string;
  heroVerticalText: string;
  heroImageUrl: string;
  philosophyTitle: string;
  philosophySubtitle: string;
  philosophyDescription: string;
  processTitle: string;
  processSubtitle: string;
  recognitionTitle: string;
  recognitionSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  processSteps: { number: string; title: string; description: string }[];
  awards: { year: string; title: string; organization: string }[];
  testimonials: { name: string; role: string; company: string; content: string }[];
  materialsTitle: string;
  materialsDescription: string;
  materialsItems: { title: string; description: string; imageUrl: string }[];
}

const SETTINGS_DOC_ID = 'global';

export const subscribeToSettings = (callback: (settings: SiteSettings) => void) => {
  return onSnapshot(doc(db, 'settings', SETTINGS_DOC_ID), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as SiteSettings);
    }
  });
};

export const updateSettings = async (settings: Partial<SiteSettings>) => {
  await setDoc(doc(db, 'settings', SETTINGS_DOC_ID), settings, { merge: true });
};

export const getSettings = async () => {
  const snapshot = await getDoc(doc(db, 'settings', SETTINGS_DOC_ID));
  return snapshot.exists() ? snapshot.data() as SiteSettings : null;
};
