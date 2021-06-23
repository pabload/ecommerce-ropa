import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import logo from '../../assets/logo.png'
import './navbar.component.css'
import { AuthContext } from '../../contexts/authcontext'
import firebaseService from '../../firebase/firebase-service';

export default function Navbarcomponent() {
    const { currentUser } = useContext(AuthContext);
    const { userInfo } = useContext(AuthContext);
    const { setUserInfo } = useContext(AuthContext);
    const { setUserInfoId } = useContext(AuthContext);
    const [hiddeMenu, setHiddeMenu] = useState(false);
    const [width, setwidth] = useState(0);
    useEffect(() => {
        const updateWindowDimensions = () => {
            const newWidth = window.innerWidth;
            setwidth(newWidth);
        };
        window.addEventListener("resize", updateWindowDimensions);
        updateWindowDimensions();
    }, []);
    useEffect(() => {
        if (width <= 768 && width != 0) {
            console.log('entro');
            setHiddeMenu(true);
        } else {
            setHiddeMenu(false);
        }
    }, [width]);
    const logOut = async () => {
        await firebaseService.logOut();
        setUserInfo({});
        setUserInfoId(null);
    }
    return (
        <nav  class="fixed-top navbar bg-dark row">
            <div className="col-lg-8">
                <Link to='/' class="d-flex">
                    <h3 className='title text-white '>CUIDADO CON EL GATO</h3>
                    <img  className='logo' src={logo} alt="" />
                </Link>
            </div>
            <div className="col-lg-4">
                {  
                        !currentUser&&hiddeMenu!==true?
                        <div className="">
                          <ul class="d-flex flex-row justify-content-around navbar-nav mr-auto mt-2 mt-lg-0">
                                <li class="nav-item active">
                                <Link className="text-white" to="/login">Iniciar sesión</Link>
                                </li>
                                <li class="nav-item">
                                <Link className="text-white" to="/register">Registrarme</Link>
                                </li>
                            </ul>       
                        </div>:
                               currentUser && userInfo.type === 'customer'&&hiddeMenu==false?
                               <div className="">
                                   <ul class="d-flex flex-row justify-content-around navbar-nav mr-auto mt-2 mt-lg-0">
                                       <li class="nav-item active">
                                       <Link className="text-white" to="/purchases">Compras hechas</Link>
                                       </li>
                                       <li class="nav-item">
                                       <Link className="text-white" to="/cart">Mi carrito ({userInfo.cart.length}) </Link>
                                       </li>
                                       <li class="nav-item">
                                       <Link className="text-white" to="/account">Mi cuenta</Link>
                                       </li>
                                       <li class="nav-item">
                                       <Link onClick={() => { logOut() }} className="text-white" to="/">Cerrar sesión</Link>
                                       </li>
                                   </ul>                 
                               </div>:
                               null
                }
            </div>
        </nav>

    )
}
