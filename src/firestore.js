import { 
  getFirestore,
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  deleteDoc } from 'firebase/firestore';
import { app } from './firebaseConfig';

const db = getFirestore(app);

const checkTokenInDatabase = async (token) => {
  const qrDoc = await findQRByToken(token);
  return qrDoc !== null;
};


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

const removeTokenFromUserQRList = async (uid, token) => {
  const userDoc = await findUserByUid(uid);

  if (userDoc) {
    const qrList = userDoc.data().Qrlist;
    const updatedQRList = qrList.filter((qrToken) => qrToken !== token);
    await updateDoc(doc(db, "users", userDoc.id), { Qrlist: updatedQRList });
  }
};

const findAdminByUid = async (uid) => {
  const adminsRef = collection(db, "admins");
  const q = query(adminsRef, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0];
  }

  return null;
};

const printFirestoreDataTree = async () => {
  // Recuperar las colecciones principales
  const mainCollections = ['qrCodes', 'users'];
  let dataTree = {};

  for (const collectionName of mainCollections) {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);

    dataTree[collectionName] = {};

    snapshot.forEach((doc) => {
      const docData = doc.data();
      dataTree[collectionName][doc.id] = docData;
    });
  }

};

// Encuentra un usuario por su UID
const findUserByUid = async (uid) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("useruid", "==", uid));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0];
  }

  return null;
};

// Agrega el token a la lista QRlist del usuario actual
const addTokenToUserQRList = async (uid, token) => {
  const userDoc = await findUserByUid(uid);

  if (userDoc) {
    const qrList = userDoc.data().Qrlist;

    // Verifica si el token ya está en la lista
    if (!qrList.includes(token)) {
      qrList.push(token);
      await updateDoc(doc(db, "users", userDoc.id), { Qrlist: qrList });
    }
  }
};

// Elimina un token de QRlist de un usuario dado su useruid y el token a eliminar
const deleteTokenFromUserQRList = async (useruid, token) => {
  const userDoc = await findUserByUid(useruid);

  if (userDoc) {
    const qrList = userDoc.data().Qrlist;
    const updatedQRList = qrList.filter((qrToken) => qrToken !== token);
    await updateDoc(doc(db, "users", userDoc.id), { Qrlist: updatedQRList });
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

  const getAllAdmins = async () => {
  const adminsRef = collection(db, "admins");
  const adminSnapshot = await getDocs(adminsRef);
  const adminList = adminSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return adminList;
};

const getAllUsers = async () => {
  const usersRef = collection(db, "users");
  const userSnapshot = await getDocs(usersRef);
  const userList = userSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return userList;
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
  printFirestoreDataTree,
  checkTokenInDatabase,
  removeTokenFromUserQRList,
  updateDoc,
  doc,
  deleteTokenFromUserQRList,
  findAdminByUid,
  getAllAdmins,
  getAllUsers
};
