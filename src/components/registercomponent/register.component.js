import React, { useEffect, useState,useContext} from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from '../../contexts/authcontext';
import firebaseService from '../../firebase/firebase-service';
import './register.component.css'
export default function Registercomponent() {
    const { setUserInfoId } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('Masculino');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [card, setCard] = useState('');
    const [loading, setLoading] = useState(false);
    const [created, setCreated] = useState(false);
    const [error, setError] = useState(null);
    const signIn = async () => {
        setError(null);
        if (name !== '' &&
            lastName !== '' &&
            gender !== '' &&
            email !== '' &&
            password !== '' &&
            card !== '') {
            setLoading(true);
        } else {
            setError('Es necesario llenar todos los datos');
        }

    }
    useEffect(() => {
        const createAccount = async () => {
            if (loading === true) {
                const res = await firebaseService.createAccount(
                    name,
                    lastName,
                    gender,
                    card,
                    email,
                    password
                );
                if (res.status === 'success') {
                     setUserInfoId(res.userinfoid);  
                     setCreated(true);
                }else{
                    setError(res)
                }   
                setLoading(false);
            }
        }
        createAccount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);
    useEffect(() => {
        if (loading === true) {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [created]);
    return (
        <div className='main-container-register'>
            <div className="row justify-content-center align-items-center">
                <div className="col-lg-6 col-10">
                    <h4 className='mt-5'>Completa tus datos</h4>
                    <div className="container-info rounded bordered p-4 bg-white shadow mt-3">
                        {
                            error !== null ?
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div> :
                                null
                        }
                        {
                            loading == true ?
                                <div className="text-center">
                                    <div className="spinner-border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <h3>Espere por favor.......</h3>
                                </div>
                                :
                                created == true ?
                                <div className="w-100 d-flex flex-column justify-content-center">
                                    <h2 className='text-center'>Cuenta creada con éxito</h2>
                                    <i className="text-center far fa-check-circle fa-5x mb-2"></i>
                                    <Link className="btn btn-secondary w-100" to="/">Aceptar</Link>
                                </div>        
                                    :
                                    <div className="row">
                                        <div className="col-lg-6 p-2">
                                            <input type="text" className="form-control" placeholder="Nombre" onChange={(event) => setName(event.target.value)} />
                                        </div>
                                        <div className="col-lg-6 p-2">
                                            <input type="text" className="form-control" placeholder="apellido" onChange={(event) => setLastName(event.target.value)} />
                                        </div>
                                        <div className="col-lg-6 p-2">
                                            <input type="email" className="form-control" placeholder="email" onChange={(event) => setEmail(event.target.value)} />
                                        </div>
                                        <div className="col-lg-6 p-2">
                                            <input type="password" className="form-control" placeholder="contraseña" onChange={(event) => setPassword(event.target.value)} />
                                        </div>
                                        <div className="col-lg-12 p-2">
                                            <input type="text" className="form-control" placeholder="tarjeta" onChange={(event) => setCard(event.target.value)} />
                                        </div>
                                        <div className="col-lg-12 p-2">
                                            <label htmlFor="">Genero del cliente</label>
                                            <select className="form-control" placeholder='Genero' onChange={(event) => setGender(event.target.value)}>
                                                <option>Masculino</option>
                                                <option>Femenino</option>
                                            </select>
                                        </div>
                                        <div className="col-lg-12 p-2 d-flex justify-content-center">
                                            <button onClick={() => { signIn() }} className="btn btn-secondary w-75">Registrarme</button>
                                        </div>
                             </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
