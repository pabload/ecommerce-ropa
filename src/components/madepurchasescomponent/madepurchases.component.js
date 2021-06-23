import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/authcontext';
import firebaseService from '../../firebase/firebase-service';
import './madepurchases.component.css'
export default function Madepurchasescomponent() {
    const { userInfo } = useContext(AuthContext);
    const [payments, setPayments] = useState([]);
    useEffect(() => {
        const getPayments = async () => {
            if (userInfo.id) {
                const res = await firebaseService.getPayments(userInfo.id);
                setPayments(res);
            }
        }
        getPayments();
    }, [userInfo]);
    const showPayments = payments.map((payment) => {
        return (
            <div class="card mb-2 shadow">
                <div class="card-header">
                    <div className="row justify-content-center">
                        <div className="col-lg-4">
                            <h6><strong>ID de la compra:</strong> {payment.paymentid} </h6>
                        </div>
                        <div className="col-lg-4">
                            <h6><strong>Total del pedido:</strong> ${payment.productstotal} </h6>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    {
                        payment.paymentdetails.map((detail) => {
                            return (
                                <div className="container border mb-2 p-2">
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <img src={detail.imageurl} className='img-thumbnail payment-img w-50' alt="" srcset="" />
                                        </div>
                                        <div className="col-lg-4">
                                            <h6><strong>Nombre del producto:</strong> {detail.productname} </h6>
                                            <h6><strong>Total por producto:</strong>  ${detail.producttotal} </h6>
                                            <h6><strong>Cantidad del producto:</strong> {detail.productamount} </h6>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    })
    return (
        <div className='main-container-madepurchases'>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div class="my-3 p-3   mt-5">
                            <h4 class="border-bottom border-gray pb-2 mb-4">Compras realizadas</h4>
                            {showPayments}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
