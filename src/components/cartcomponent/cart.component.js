import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../contexts/authcontext';
import firebaseService from '../../firebase/firebase-service';
import { useLocation, Link } from "react-router-dom";
import './cart.component.css'
import { Paypalcomponent } from '../paypal.component';
import {Modal,Button} from 'react-bootstrap'
export default function Cartcomponent() {

    ///modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { userInfo } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [amountInputs, setAmountInputs] = useState([]);
    const [productsTotal, setProductsTotal] = useState(0);
    const [loading, setloading] = useState(false);
    const [paymentDone, setpaymentDone] = useState(false);
    const [error, setError] = useState(null);
    const deleteProductCart = async (productId) => firebaseService.deleteProductCart(userInfo.id, productId);
    const makePayment = async () => {
        setloading(true);
    }
    const getProductsCart = async () => {
        firebaseService.db.onSnapshot((querySnapshot) => {
            let produ = [];
            let totalPrice = 0;
            querySnapshot.forEach(doc => {
                if (userInfo.cart.includes(doc.id)) {
                    let productInfo = doc.data();
                    productInfo.id = doc.id
                    produ.push(productInfo);
                    console.log(productInfo.price);
                    setAmountInputs(states => {
                        return [...states, 1];
                    });
                }
            });
            setProducts(produ);
        });
    }
    useEffect(() => {
        if (userInfo.cart) {
            getProductsCart();
        }
    }, [userInfo]);
    useEffect(() => {
        if (products.length != 0) {
            let total = 0;
            products.map((pro, index) => {
                total = total + (pro.price * amountInputs[index]);
            });
            setProductsTotal(total);
        } else {
            setProductsTotal(0);
        }
    }, [products, amountInputs]);
    useEffect(() => {
        const makePayment = async () => {
            if (loading == true) {
                const res = await firebaseService.makePayment(products, amountInputs, userInfo.id, productsTotal);
                if (res != true) { return setError(res) }
                setpaymentDone(true);
                setloading(false);
            }
        }
        makePayment();
    }, [loading]);
    const showProducts = products.map((product, index) => {
        return (
            <tr key={index}>
                <th scope="row"> {product.name} </th>
                <td> <input type="number" min={1} max={product.amount} value={amountInputs[index]} class="form-control w-100 text-center" placeholder="Cantidad" onChange={(event) => {
                    setAmountInputs(
                        amountInputs.map((value, j) => {
                            if (index === j) value = event.target.value;
                            return parseInt(value);
                        })
                    )
                }} /></td>
                <td className='text-center'>${amountInputs[index] * product.price} </td>
                <td><button onClick={() => { deleteProductCart(product.id) }} type="button" class="btn btn-danger">Eliminar del carrito</button></td>
            </tr>
        )
    });
    return (
        <div className='main-container-cart'>
            <div className="row justify-content-center w-100 h-100">
                <div className="col-lg-8 p-0">
                    {
                        error !== null ?
                            <div className="alert alert-danger mt-3 shadow text-center" role="alert">
                                {error}
                            </div> :
                            null
                    }
                    {

                        loading === true ?
                            <div className="container w-100 mt-5 shadow p-5">
                                <div className="text-center">
                                    <div className="spinner-border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <h3>Procesando pago.....</h3>
                                </div>
                            </div> :

                            paymentDone === true ?
                                <div className="w-100 d-flex flex-column justify-content-center mt-5 shadow p-5">
                                    <h2 className='text-center'>Compra realizada con éxito</h2>
                                    <i className="text-center far fa-check-circle fa-5x mb-2"></i>
                                    <Link className="btn btn-secondary w-100" to="/">Aceptar</Link>
                                </div> :

                                <div className="container w-100">
                                    <table class="table mt-5 shadow w-100">
                                        <thead class="thead-dark">
                                            <tr>
                                                <th scope="col">Producto</th>
                                                <th scope="col">Cantidad</th>
                                                <th scope="col">Total por producto</th>
                                                <th scope="col">Eliminar del carrito</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                showProducts
                                            }
                                        </tbody>
                                    </table>
                                    <div className="row justify-content-end w-100">
                                        <div className="col-lg-3">
                                            <div className="bg-dark shadow p-2 rounded w-100">
                                                <h3 className='text-white text-center'>Total a pagar: ${productsTotal}</h3>
                                                {
                                                    productsTotal != 0 ?
                                                        <>
                                                            <button onClick={() => { handleShow() }} type="button" class="btn btn-warning w-100" >Proceder al pago</button>
                                                            
                                                        </>
                                                        :
                                                        null
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                    }
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Formas de pago</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Paypalcomponent productsTotal={productsTotal} setloading={setloading} handleClose={handleClose} />
                </Modal.Body>
            </Modal>
        </div>
    )
}
