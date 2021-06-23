import React, { useEffect, useState, useContext } from 'react';
import './adminmenu.component.css'
import { AuthContext } from '../../contexts/authcontext';
import { Link } from 'react-router-dom';
import firebaseService from '../../firebase/firebase-service';
export default function Adminmenucomponent() {
    const { setUserInfo } = useContext(AuthContext);
    const { setUserInfoId } = useContext(AuthContext);
    const logOut = async () => {
        firebaseService.logOut();
        setUserInfo({});
        setUserInfoId(null);
    }
    return (
        <div className='main-container-adminmenu shadow'>
            <ul class="menu-container d-flex flex-lg-column flex-sm-row  p-0">
                <Link class="list-group-item w-sm-25 w-lg-100" to="/admindashboard">
                    <div className="d-flex justify-content-center">
                        <i class="fas fa-warehouse mr-2"></i>
                        <h5 className='d-none d-lg-block'>Inventario global</h5>
                    </div>
                </Link>
                <Link class="list-group-item w-sm-25 w-lg-100" to="/admindashboard/addproduct">
                    <div className="d-flex">
                        <i class="fas fa-tshirt"></i>
                        <h5 className='d-none d-lg-block'>Registrar producto</h5>
                    </div>
                </Link>
                <Link class="list-group-item w-sm-25 w-lg-100" to="/admindashboard/adminpurchases">
                    <div className="d-flex">
                        <i class="fas fa-shopping-cart mr-2"></i>
                        <h5 className='d-none d-lg-block'>Compras hechas</h5>
                    </div>
                </Link>
                <Link onClick={() => { logOut() }} class="list-group-item w-sm-25 w-lg-100" to="/">
                    <div className="d-flex">
                        <i class="fas fa-sign-out-alt mr-2"></i>
                        <h5 className='d-none d-lg-block'>Cerrar sesión</h5>
                    </div>
                </Link>
            </ul>
        </div>
    )
}
