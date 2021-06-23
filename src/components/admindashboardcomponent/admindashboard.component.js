import React, { useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../contexts/authcontext';
import Addproductcomponent from '../addproductcomponent/addproduct.component';
import Adminmenucomponent from '../adminmenucomponent/adminmenu.component'
import Adminpurchasescomponent from '../adminpurchasescomponent/adminpurchases.component';
import Inventorycomponent from '../inventorycomponent/inventory.component'
import { useHistory } from "react-router-dom"
import './admindashboard.component.css'
export default function Admindashboardcomponent({ match }) {
    let history = useHistory();
    const { userInfo } = useContext(AuthContext);
    const { userInfoId } = useContext(AuthContext);
    const { currentUser } = useContext(AuthContext);
    const section = match.params.section;
    useEffect(() => {
        console.log('ola' + userInfoId);
    }, [userInfoId]);
    return (
        userInfo.type === 'admin' ?
            <div className='row'>
                <div className="col-lg-2">
                    <Adminmenucomponent />
                </div>
                <div className="col-lg-10 p-0 mb-5">
                    {
                        section === undefined ?
                            <Inventorycomponent /> :
                            section === 'adminpurchases' ?
                                <Adminpurchasescomponent /> :
                                section === 'addproduct' ?
                                    <Addproductcomponent /> :
                                    section === 'editproduct' ?
                                        <Addproductcomponent /> :
                                        null
                    }
                </div>
            </div>
            :
            <div className="no-access-container shadow row justify-content-center align-items-center">
                <div className="col-lg-4">
                <div className="container shadow d-flex justify-content-center flex-column">
                    <h1 className='text-center'>No tienes acceso a esta sección</h1>
                    <i class="fas fa-exclamation-triangle fa-5x text-center mb-2"></i>
                    <button onClick={() => {history.push('/')}} className="btn btn-secondary mb-2">Aceptar</button>
                </div>
                </div>
            </div>
    )
}
