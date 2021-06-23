import React, { useEffect, useState, useContext } from 'react';
import './bottomnav.component.css'
import { Link } from "react-router-dom";
import { AuthContext } from '../../contexts/authcontext';
import firebaseService from '../../firebase/firebase-service';
export default function Bottomnavcomponent() {
    const [width, setwidth] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const { userInfo } = useContext(AuthContext);
    const { setUserInfo } = useContext(AuthContext);
    const { setUserInfoId } = useContext(AuthContext);
    const logOut = async () => {
        await firebaseService.logOut();
        setUserInfo({});
        setUserInfoId(null);
    }
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
            setShowMenu(true);
        } else {
            setShowMenu(false);
        }
    }, [width]);
    return (
        <div>
            {
                showMenu == true ?
                    <div class="main-container-bottomnav bg-dark shadow d-flex justify-content-center position-fixed">
                        {
                            !currentUser ?
                                <div className="row h-100">
                                    <div className="col-7 text-center">
                                        <Link className="text-white" to="/login">Iniciar sesión</Link>
                                    </div>
                                    <div className="col-5 text-center">
                                        <Link className="text-white" to="/register">Registrase</Link>
                                    </div>
                                </div> :
                                currentUser && userInfo.type == 'customer' && userInfo.cart ?
                                    <div className="row w-100 justify-content-center">
                                        <div className="col-3 h-100 text-center border-right p-3">
                                            <Link className="text-white" to="/purchases"><i class="bottom-nav-icon fas fa-shopping-basket"></i></Link>
                                        </div>
                                        <div className="col-3 text-center  border-right p-3">
                                            <Link className="text-white d-flex justify-content-center" to="/cart">
                                                <i class="bottom-nav-icon fas fa-shopping-cart"></i>
                                                <p className='text-center text-white'> ({userInfo.cart.length}) </p>
                                            </Link>
                                        </div>
                                        <div className="col-3 text-center border-right p-3">
                                            <Link className="text-white" to="/account">
                                                <i class="bottom-nav-icon far fa-user-circle"></i>
                                            </Link>
                                        </div>
                                        <div className="col-3 text-center border-right p-3">
                                            <Link onClick={() => { logOut() }} className="text-white" to="/">
                                                <i class="bottom-nav-icon fas fa-sign-out-alt"></i>
                                            </Link>
                                        </div>
                                    </div> :
                                    currentUser && userInfo.type == 'admin'?
                                    <div className="row w-100 justify-content-center">
                                        <div className="col-3 h-100 text-center border-right p-3">
                                            <Link className="text-white" to="/admindashboard"> <i class="fas fa-warehouse mr-2"></i></Link>
                                        </div>
                                        <div className="col-3 text-center  border-right p-3">
                                            <Link className="text-white d-flex justify-content-center" to="/admindashboard/addproduct">
                                            <i class="fas fa-tshirt"></i>
                                            </Link>
                                        </div>
                                        <div className="col-3 text-center border-right p-3">
                                            <Link className="text-white" to="/admindashboard/adminpurchases">
                                            <i class="fas fa-shopping-cart mr-2"></i>
                                            </Link>
                                        </div>
                                        <div className="col-3 text-center border-right p-3">
                                            <Link onClick={() => { logOut() }} className="text-white" to="/">
                                                <i class="bottom-nav-icon fas fa-sign-out-alt"></i>
                                            </Link>
                                        </div>
                                    </div>:
                                    null


                        }
                    </div> :
                    null

            }
        </div>
    )
}
