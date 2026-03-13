import { collection, onSnapshot, query, orderBy, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Project } from '../types';

export const subscribeToProjects = (callback: (projects: Project[]) => void) => {
  const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
    callback(projects);
  }, (error) => {
    console.error("Error fetching projects:", error);
  });
};

export const getProject = async (id: string) => {
  const docRef = doc(db, 'projects', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Project;
  }
  return null;
};
