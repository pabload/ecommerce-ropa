import React, { useEffect, useState, useContext } from 'react';
import firebaseService from '../../firebase/firebase-service'
import './productcard.component.css'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/authcontext';
export default function Productcardcomponent({ product }) {
    const { currentUser } = useContext(AuthContext);
    const { userInfo } = useContext(AuthContext);
    const deleteProduct = () => firebaseService.deleteProduct(product.id, product.imageurl);
    const addToCart = () => firebaseService.addToCart(product.id, userInfo.id);
    return (
        <div className="col-lg-3">
            <div class="card card-product d-flex flex-column justify-content-center align-items-center shadow p-3">
                <img class="card-img-top mb-3" src={product.imageurl} alt="Card image cap" />
                <div class="card-body d-flex flex-column justify-content-end w-100">
                    <h5 class="card-title text-center"> {product.name}</h5>
                    <div className="d-flex flex-column justify-content-center">
                        <div className="">
                            {
                                userInfo.type == 'customer' || !currentUser ?
                                    <Link class=" btn btn-secondary w-100 mb-2" to={{ pathname: "/show", state: product }}>
                                        ver mas
                                   </Link> :
                                    <button type="button" onClick={() => { deleteProduct() }} class="btn btn-secondary w-100 mb-2">Eliminar</button>

                            }
                        </div>
                        <div className="">
                            {
                                userInfo.type == 'customer'&& currentUser&&userInfo.cart.includes(product.id)?
                                    <button type="button" onClick={() => {}} class="btn btn-light w-100 mb-2" disabled>Producto ya en carrito</button>
                                    :
                                    userInfo.type == 'customer'&& currentUser&&!userInfo.cart.includes(product.id)?
                                    <button type="button" onClick={() => {addToCart()}} class="btn btn-light w-100 mb-2" >Agregar carrito</button>
                                    :
                                    !currentUser?
                                    <Link class="btn btn-light w-100 mb-2" to='login'>
                                        Agregar al carrito
                                    </Link>:
                                    <Link class=" btn btn-light w-100" to={{ pathname: "/admindashboard/editproduct", state: product }}>
                                        editar
                                    </Link>

                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
