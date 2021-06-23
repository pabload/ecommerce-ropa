import React, { useContext, useEffect } from 'react';
import './showproduct.component.css'
import { useLocation, Link, useHistory } from "react-router-dom";
import firebaseService from '../../firebase/firebase-service';
import { AuthContext } from '../../contexts/authcontext';

export default function Showproductcomponent() {
    let history = useHistory();
    let product = useLocation().state;
    const { currentUser } = useContext(AuthContext);
    const { userInfo } = useContext(AuthContext);
    const addToCart = () => firebaseService.addToCart(product.id, userInfo.id);
    return (
        <>
            {
                product != undefined ?
                    <div className='main-container-showproduct'>
                        <div className="row w-100 justify-content-center h-100 pt-5">
                            <div className="col-lg-4 ">
                                <div className="container">
                                    <img className=' show-img-product shadow' src={product.imageurl} alt="" />
                                </div>
                            </div>
                            <div className="col-lg-6 ">
                                <div className="container shadow p-3">
                                    <h1>{product.name}</h1>
                                    <h2> ${product.price} </h2>
                                    <h3>Cantidad disponible: {product.amount} </h3>
                                    <p> {product.description} </p>
                                    {
                                        !currentUser ?
                                            <Link class="btn btn-dark w-100 mb-2" to='login'>
                                                Agregar al carrito
                          </Link> :
                                            currentUser && userInfo.cart && userInfo.cart.includes(product.id) ?
                                                <button type="button" onClick={() => { }} class="btn btn-dark w-100 mb-2" disabled>Producto ya en carrito</button>
                                                :
                                                <button type="button" onClick={() => { addToCart() }} class="btn btn-dark w-100 mb-2">Agregar al carrito</button>

                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="main-container-showproduct row justify-content-center align-items-center">
                        <div className="col-lg-4">
                            <div className="container shadow d-flex justify-content-center flex-column">
                                <h1 className='text-center'>Algo salió mal </h1>
                                <i class="fas fa-exclamation-triangle fa-5x text-center mb-2"></i>
                                <button onClick={() => { history.push('/') }} className="btn btn-secondary mb-2">Aceptar</button>
                            </div>
                        </div>
                    </div>
            }
        </>

    )
}
