import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {HashLoader } from 'react-spinners';

const ExamplePage = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/");
    };

    return (
        <Container 
            className="p-5 text-center d-flex flex-column justify-content-center" 
            style={{ height: '100vh', backgroundColor: '#f5f5f5', width: '100%'}} // Aquí se cambia el color de fondo
        >
            <div className='loader' style={{display: 'flex', justifyContent: 'center', marginBottom: '1em'}}>
            <HashLoader color='purple' size={'100px'}/>
            </div>
            <p className="mb-4">Para editar este QR inicia sesion y utiliza el token personalizado</p>
            <Button variant="primary" style={{backgroundColor: 'purple'}} onClick={goToLogin}>Iniciar Sesión</Button>
        </Container>
    );
}

export default ExamplePage;
