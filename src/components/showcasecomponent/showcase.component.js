import React, { useEffect, useState, useContext } from 'react';
import { Carousel } from 'react-bootstrap'
import firebaseService from '../../firebase/firebase-service';
import Productcardcomponent from '../productcardcomponent/productcard.component';
import './showcase.component.css'
export default function Showcasecomponent() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const products = firebaseService.db.onSnapshot((querySnapshot) => {
            const docs = [];
            querySnapshot.forEach(doc => {
                docs.push({ ...doc.data(), id: doc.id });
            });
            setProducts(docs);
        });

        return () => products();
    }, []);
    const showProducts = products.map((product) => {
        return <Productcardcomponent key={product.id} product={product} />
    })
    return (
        <div className='main-container-showcase p-5'>
            <div className="row">
                {
                    showProducts
                }
            </div>

        </div>
    )
}
