import {getFirestore, collection, addDoc, updateDoc, doc, getDocs, query, where } from 'firebase/firestore';

import { app } from './firebaseConfig';

const db = getFirestore(app);

export { collection, addDoc, updateDoc, doc, getDocs, query, where, db };