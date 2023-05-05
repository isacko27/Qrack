// firestore.js

import { getFirestore, collection, getDoc,addDoc, setDoc, updateDoc, doc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { app } from './firebaseConfig';

const db = getFirestore(app);

// Encuentra un QR por su token
const findQRByToken = async (token) => {
  const qrCodesRef = collection(db, "qrCodes");
  const q = query(qrCodesRef, where("token", "==", token));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0];
  }

  return null;
};

// Encuentra un usuario por su UID
const findUserByUid = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc;
  }

  return null;
};

// Agrega el token a la lista QRlist del usuario actual
const addTokenToUserQRList = async (uid, token) => {
  const userDoc = await findUserByUid(uid);

  if (userDoc) {
    const qrList = userDoc.data().Qrlist;
    qrList.push(token);
    await updateDoc(doc(db, "users", uid), { Qrlist: qrList });
  }
};

// Cambia la URL del QR
const updateQRUrl = async (token, newUrl) => {
  const qrDoc = await findQRByToken(token);

  if (qrDoc) {
    await updateDoc(doc(db, "qrCodes", qrDoc.id), { url: newUrl });
  }
};

// Cambia el nombre del QR
const updateQRName = async (token, newName) => {
  const qrDoc = await findQRByToken(token);

  if (qrDoc) {
    await updateDoc(doc(db, "qrCodes", qrDoc.id), { Qrnombre: newName });
  }
};

export {
  addDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  db,
  findQRByToken,
  findUserByUid,
  addTokenToUserQRList,
  updateQRUrl,
  updateQRName,
};
