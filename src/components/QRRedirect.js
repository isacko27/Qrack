import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { db } from '../firestore';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

const QRRedirect = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = location.pathname.split('/qr/')[1];
        console.log('userId:', userId);

        const docRef = doc(db, 'users', userId);
        console.log('docRef:', docRef);

        const docSnapshot = await getDoc(docRef);
        console.log('docSnapshot.exists():', docSnapshot.exists());

        const usersCollectionRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollectionRef);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Lista de usuarios:', usersList);

        for (let i = 0; i < usersList.length; i++) {
            console.log('usersList[i].userid:', usersList[i].userid);
            console.log('userId === usersList[i].userid:', userId === usersList[i].userid);
            if (userId === usersList[i].userid) {
              console.log('Redireccionando a:', usersList[i].url);
              window.location.href = usersList[i].url;
              break;
            } else {
              console.error(`No se encontró una URL para el usuario con ID: ${userId}`);
              navigate('/'); // Redirige al usuario a la página principal
            }
          }

      } catch (e) {
        console.error('Error al obtener el documento:', e);
      }
    };

    fetchData();
  }, [id, navigate, location]);

  return <div>Redireccionando...</div>;
};

export default QRRedirect;
