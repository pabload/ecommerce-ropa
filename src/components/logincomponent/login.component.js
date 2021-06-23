import React, { useEffect, useState, useContext } from 'react';
import firebaseService from '../../firebase/firebase-service';
import { AuthContext } from '../../contexts/authcontext'
import { Link } from "react-router-dom";
import { useHistory } from "react-router"

import './login.component.css'
export default function Logincomponent() {
    const history = useHistory();
    const { setUserInfoId } = useContext(AuthContext);
    const { userInfoId } = useContext(AuthContext);
    const { userInfo } = useContext(AuthContext);
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [error, seterror] = useState(null);
    const signIn = async () => {
        seterror(null)
        if (email !== '' && password !== '') {
            const res = await firebaseService.signIn(email, password);
            if (res.status == 'error') {
                console.log(res.message);
                return seterror(res.message);
            }
            console.log(userInfoId);
            setUserInfoId(res.userinfoid);

        } else {
            seterror('Debes llenar todos los datos');
        }

    }
    useEffect(() => {
        console.log('entro'+userInfo.type);
        if(userInfo.type){
            if(userInfo.type==='admin'){
                return history.push('/admindashboard')
            }
             history.push('/')
        }
    }, [userInfo]);
    return (
        <div className='main-container-login d-flex justify-content-center'>
            <div className="row w-100 justify-content-center">
                <div className="col-lg-6 col-md-6 mt-5">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className='text-center'>Inicio de sesión</h3>
                            {
                                error !== null ?
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div> :
                                    null
                            }
                            <div className="form-group">
                                <label>Correo</label>
                                <input type="email" className="form-control" onChange={(event) => setemail(event.target.value)} />
                            </div>
                            <div className="form-group">
                                <label >Contraseña</label>
                                <input type="password" className="form-control" onChange={(event) => setpassword(event.target.value)} />
                            </div>
                            <button onClick={() => { signIn() }} className="btn btn-secondary w-100 mb-2">Ingresar</button>
                            <Link className="btn btn-light w-100" to="/register">Registrarme</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
