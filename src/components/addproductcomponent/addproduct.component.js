import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import firebaseService from '../../firebase/firebase-service';
import './addproduct.component.css'
export default function Addproductcomponent() {
    let editProduct = useLocation().state;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('Camisa');
    const [amount, setAmount] = useState();
    const [price, setPrice] = useState();
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState('');
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [created, setCreated] = useState(false);
    useEffect(() => {
        if (editProduct) {
            console.log('entro');
            setName(editProduct.name);
            setDescription(editProduct.description);
            setType(editProduct.type);
            setAmount(editProduct.amount);
            setPrice(editProduct.price);
        }
    }, []);
    const validatefields = async () => {
        setError(null);
        if (editProduct) {
            if (name === '' || description === '' || amount === null || price === null) {
                return setError('Debes llenar todos los datos');
            }
        } else {
            if (name === '' || description === '' || amount === null || price === null || image === null) {
                return setError('Debes llenar todos los datos');
            }
        }
        setLoading(true)
    }
    useEffect(() => {
        const processrProduct = async () => {
            let res;
            if (loading === true) {
                if (!editProduct) {
                    res = await firebaseService.registerProduct(
                        name,
                        description,
                        type,
                        amount,
                        price,
                        image,
                        imageName
                    );
                } else {
                    res = await firebaseService.editProduct(
                        name,
                        description,
                        type,
                        amount,
                        price,
                        image,
                        imageName,
                        editProduct
                    );
                }
                setLoading(false);
                if (res.status === 'success') {
                    setName('');
                    setDescription('');
                    setType('');
                    setAmount('');
                    setPrice();
                    setImage()
                    setImageName('')
                    return setCreated(true)
                }

            }
        }
        processrProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);
    return (
        <div className='main-container-addproduct  animate__animated animate__fadeInRight'>
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="container mt-4 shadow p-4">
                        {
                            error ?
                                <div class="alert alert-danger" role="alert">
                                    {error}
                                </div> :
                                null
                        }
                        {
                            loading === true ?
                                <div className="text-center">
                                    <div className="spinner-border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <h3>Espere por favor.......</h3>
                                </div>
                                :
                                created == true ?
                                    <div className="w-100 d-flex flex-column justify-content-center p-5">
                                        <h2 className='text-center'>  {editProduct ? 'Producto editado correctamente' : 'Producto registrado correctamente'} </h2>
                                        <i className="text-center far fa-save fa-5x mb-2"></i>
                                        <button type="button" onClick={() => { setCreated(false) }} class="btn btn-secondary">Aceptar</button>
                                    </div>
                                    :
                                    <div>
                                        <div class="form-group">
                                            <label >Nombre del producto</label>
                                            <input type="text" value={name} class="form-control" placeholder="Producto a agregar" onChange={(event) => setName(event.target.value)} />
                                        </div>
                                        <div class="form-group">
                                            <label>Descripción del producto</label>
                                            <textarea class="form-control" rows="2" value={description} placeholder='Menciona las características del producto' onChange={(event) => setDescription(event.target.value)} ></textarea>
                                        </div>
                                        <div class="form-group">
                                            <label>Tipo de prenda</label>
                                            <select class="form-control" value={type} onChange={(event) => setType(event.target.value)}>
                                                <option>Camisa</option>
                                                <option>Pantalón</option>
                                                <option>Calzado</option>
                                                <option>Accesorio</option>
                                                <option>otro</option>
                                            </select>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6 col-6">
                                                <div class="form-group">
                                                    <label>Cantidad disponible</label>
                                                    <input type="number" class="form-control w-100" value={amount} placeholder="Cantidad" onChange={(event) => setAmount(event.target.value)} />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-6">
                                                <div class="form-group">
                                                    <label>Precio por unidad (pesos) </label>
                                                    <input type="number" class="form-control w-100" value={price} placeholder="Precio" onChange={(event) => setPrice(event.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label>imagen de muestra</label>
                                            <input type="file" accept="image/png, image/jpeg" class="form-control mb-2" placeholder="sube la imagen" onChange={(event) => { setImage(event.target.files[0]); setImageName(event.target.files[0].name) }} />
                                            <button type="button" onClick={() => { validatefields() }} class="btn btn-secondary">  {editProduct ? 'Editar producto' : 'Registrar producto'}  </button>
                                        </div>
                                    </div>
                        }

                    </div>
                </div>
            </div>

        </div>
    )
}
