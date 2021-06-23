import React, { useContext, useState, useEffect } from 'react'
import './account.component.css'
import { AuthContext } from '../../contexts/authcontext';
import firebaseService from '../../firebase/firebase-service';
import { Modal, Button } from 'react-bootstrap'
import { useHistory } from "react-router-dom"
export default function Accountcomponent() {
    ///modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    ///////
    let history = useHistory();
    const { userInfo, setUserInfo, setUserInfoId } = useContext(AuthContext);
    const [name, setName] = useState();
    const [lastname, setLastName] = useState();
    const [gender, setGender] = useState();
    const [card, setCard] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const updateUserInfo = async () => {
            const res = await firebaseService.updateUserInfo(
                {
                    id: userInfo.id,
                    card,
                    gender,
                    lastname,
                    name,
                }
            );
            if (res != true) { return setError(res) }
            setUpdated(true);
        }

        if (name !== '' &&
            lastname !== '' &&
            gender !== '' &&
            card !== '' &&
            loading === true) {
            updateUserInfo();

        } else {
            if (loading === true) {
                setError('Es necesario llenar todos los datos');
            }
        }
    }, [loading]);
    useEffect(() => {
        const deleteAccount = async () => {
            await firebaseService.deleteAccount(userInfo.id);
            history.push('/');
            setUserInfo({});
            setUserInfoId(null);

        }
        if (loadingDelete) {
            deleteAccount();
        }
    }, [loadingDelete]);
    useEffect(() => {
        setName(userInfo.name);
        setLastName(userInfo.lastname);
        setGender(userInfo.gender);
        setCard(userInfo.card);
    }, [userInfo]);
    useEffect(() => {
        if (updated) {
            setTimeout(() => { setUpdated(false) }, 1000);
        }
    }, [updated]);
    return (
        userInfo.type === 'customer' ?
            <div className='main-container-account p-5'>
                <div className="row justify-content-center">
                    <div className="col-lg-6 ">
                        <div class="card">
                            <div class="card-header">
                                Mi información personal
                           </div>
                            <div class="card-body">
                                <h5 class="card-title">Propietario de la cuenta</h5>
                                {
                                    error != null ?
                                        <div class="alert alert-danger" role="alert">
                                            {error}
                                        </div> :
                                        updated ?
                                            <div class="alert alert-success" role="alert">
                                                información modificada
                                            </div> :
                                            null
                                }
                                <div className="row">
                                    <div className="col-lg-6">
                                        <input type="text" value={name} className="form-control text-center" onChange={(event) => setName(event.target.value)} />
                                    </div>
                                    <div className="col-lg-6">
                                        <input type="text" value={lastname} className="form-control text-center" onChange={(event) => setLastName(event.target.value)} />
                                    </div>
                                </div>
                                <h5 class="card-title">Sexo del propietario</h5>
                                <select value={gender} className="form-control text-center" placeholder='Genero' onChange={(event) => setGender(event.target.value)}>
                                    <option>Masculino</option>
                                    <option>Femenino</option>
                                </select>
                                <h5 class="card-title">Tarjeta Bancaria</h5>
                                <input type="text" value={card} className="form-control text-center" onChange={(event) => setCard(event.target.value)} />
                                <button onClick={() => setLoading(true)} className="btn btn-secondary w-100 mt-3">Modificar información</button>
                                <button onClick={() => handleShow()} className="btn btn-danger w-100 mt-3">Eliminar mi cuenta</button>
                            </div>
                        </div>
                    </div>
                </div>
                <>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>¿Estás seguro de querer borrar tu cuenta?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center"><h3>Se perderá toda tu información dentro de la tienda</h3></Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={() => { setLoadingDelete(true) }}>
                                Continuar
                           </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            </div>
            :
            <div className="no-access-container shadow row justify-content-center align-items-center">
                <div className="col-lg-4">
                    <div className="container shadow d-flex justify-content-center flex-column">
                        <h1 className='text-center'>No tienes acceso a esta sección</h1>
                        <i class="fas fa-exclamation-triangle fa-5x text-center mb-2"></i>
                        <button onClick={() => { history.push('/') }} className="btn btn-secondary mb-2">Aceptar</button>
                    </div>
                </div>
            </div>
    )
}
