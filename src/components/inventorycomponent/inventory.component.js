import React, { useEffect, useState, useContext } from 'react';
import firebaseService from '../../firebase/firebase-service'
import Productcardcomponent from '../productcardcomponent/productcard.component';
import './inventory.component.css'
export default function Inventorycomponent() {
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
        <div className='main-container-inventory container-fluid  animate__animated animate__fadeInRight p-4 h-100'>
            <h2 className='text-center'>Productos disponibles</h2>
            <div className="row">
                {
                    showProducts
                }
            </div>
        </div>
    )
}
