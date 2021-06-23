import React, { useEffect, useState, useContext } from 'react';
import firebaseService from '../../firebase/firebase-service'
import { Accordion, Card, Button } from 'react-bootstrap';
import { AuthContext } from '../../contexts/authcontext';
import './adminpurchases.component.css'
export default function Adminpurchasescomponent() {
    const { userInfo } = useContext(AuthContext);
    const [payments, setPayments] = useState([]);
    useEffect(() => {
        const getPayments = async () => {
            const res = await firebaseService.getAllPayments();
            setPayments(res);
        }
        getPayments();
    }, []);
    useEffect(() => {
        console.log(payments);
    }, [payments]);
    const showPayments = payments.map((payment, index) => {
        return (
            <Card key={index}>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey={index + 1}>
                    ID del pedido: {payment.id}
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={index + 1}>
                    <Card.Body>
                       <div className="d-flex justify-content-around">
                       <h4><strong>Total del pedido:</strong> ${payment.productstotal} </h4>
                       <h4><strong>ID del cliente:</strong> ${payment.customerid} </h4>
                       </div>
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
                                                <h6><strong>Total por producto:</strong>${detail.producttotal} </h6>
                                                <h6><strong>Cantidad del producto:</strong>{detail.productamount} </h6>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        );
    })
    return (
        <div className='main-container-adminpurchases'>
            <div className="container">
                <h2>Compras hechas</h2>
                <Accordion>
                    {showPayments}
                </Accordion>
            </div>
        </div>
    )
}
