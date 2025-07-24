// client/src/utils/saveUserToFirestore.js
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const saveUserToFirestore = async (user) => {
  if (!user || !user.uid) return;

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const isGuest = user.isAnonymous;
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || null,
      isGuest,
      createdAt: serverTimestamp(),
    });
    console.log('📝 New user saved to Firestore');
  } else {
    console.log('✅ User already exists in Firestore');
  }
};
