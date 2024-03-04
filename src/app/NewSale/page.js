'use client'
import AddProduct from '@/components/AddProduct'
import AlertConfirm from '@/components/AlertConfirm'
import Button from '@/components/Button'
import ConfirmSale from '@/components/ConfirmSale'
import Header from '@/components/Header'
import Input from '@/components/Input'
import InputSearch from '@/components/InputSearch'
import InputSelect from '@/components/InputSelect'
import PayCard from '@/components/PayCard'
import apiClient from '@/utils/client'
import axios from 'axios'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function NewSale() {

    const [openAddProduct, setOpenAddProduct] = useState(false)
    const [openConfirmSale, setOpenConfirmSale] = useState(false)
    const [openAlertConfirm, setOpenAlertConfirm] = useState(false)
    const [productSelected, setProductSelected] = useState(undefined)
    const [methodPayment, setMethodPayment] = useState(undefined)
    const [openPayCard, setOpenPayCard] = useState(false)
    const [lineaVenta, setLineaVenta] = useState([])
    const [subTotal, setSubTotal] = useState(0)
    const [total, setTotal] = useState(0)
    const router = useRouter()
    const [openAlertSuccess, setOpenAlertSuccess] = useState(false)
    const fecha = new Date()

    console.log(fecha);

    const formik = useFormik({
        initialValues: {
          search: ''
        },
        validateOnChange: false,
        onSubmit: (formValue) => {
            const {search} = formValue
            apiClient.get(`/articulo/find/${search}`)
            .then((r)=>{
                setProductSelected(r.data)
                setOpenAddProduct(true)
            })
            .catch(e=>console.log(e))
        }
    })

    const addProductLV = (lv) => {
        const exist = lineaVenta.some(elem => elem.idStock === lv.idStock )
        if (!exist) {
            setLineaVenta(prevData=>[...prevData, lv])
            setOpenAddProduct(false)
        }else{
            console.log('producto ya existente')
        }
    }

    useEffect(()=>{
        const sumTotal = lineaVenta.reduce(
            (accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.total),
            0,
        );
        const sumSubTotal = lineaVenta.reduce(
            (accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.subTotal),
            0,
        );
        setSubTotal(sumSubTotal)
        setTotal(sumTotal)
    },[lineaVenta])

    const confirmSale = () => {
        const venta = {
            lineaVenta: lineaVenta,
            total: total,
            fecha: fecha
        }
        apiClient.post('/venta/save', venta)
        .then(r=>{
            setOpenConfirmSale(false)
            setOpenPayCard(false)
            setOpenAlertSuccess(true)
            setTimeout(() => {
                router.push('/Home')
            }, 5000);
        })
        .catch(e=>console.log(e))
    }

    useEffect(()=>{
        if (openAlertSuccess) {
            setTimeout(() => {
                setOpenAlertSuccess(false)
            }, 5000);
        }
    },[openAlertSuccess])

  return (
    <div style={{margin: '0 20%', height: '100vh', display: 'flex', flexDirection: 'column'}}>
        <Header title={'Realizar venta'} />
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 25}} >
            <InputSearch placeholder={'Buscar producto por codigo'} value={formik.values.search} onChange={formik.handleChange} onKeyUp={formik.handleSubmit} name='search' />
        </div>
        <div style={{padding: '25px 10%', flex: 1, display: 'flex', flexDirection: 'column'}}>
            <h2 style={{fontSize: 16, color: `${process.env.TEXT_COLOR}`, margin: '15px 0'}} >Linea de Venta</h2>
            <ul style={{padding: '10px 15px', flex: 1}}>
                <li style={{listStyle: 'none', display: 'flex', justifyContent: 'space-between'}}>
                    <h2 style={{fontSize: 14, color: `${process.env.TEXT_COLOR}`}} >Descripcion del producto</h2>
                    <h2 style={{fontSize: 14, color: `${process.env.TEXT_COLOR}`}} >Precio Venta</h2>
                    <h2 style={{fontSize: 14, color: `${process.env.TEXT_COLOR}`}} >Cantidad</h2>
                    <h2 style={{fontSize: 14, color: `${process.env.TEXT_COLOR}`}} >Sub-Total</h2>
                    <h2 style={{fontSize: 14, color: `${process.env.TEXT_COLOR}`}} >Total</h2>
                </li>
                {
                    lineaVenta.length === 0 ?
                    <h2 style={{fontSize: 16, color: `${process.env.TEXT_COLOR}`, textAlign: 'center', marginTop: 15}} >Sin productos agregados</h2>
                    :
                    lineaVenta.map((item, index)=>
                        <li key={index} style={{listStyle: 'none', display: 'flex', justifyContent: 'space-between', margin: '10px 0'}}>
                            <h2 style={{fontSize: 14, color: `${process.env.TEXT_COLOR}`}} >{item.descripcion}</h2>
                            <h2 style={{fontSize: 14, color: `${process.env.TEXT_COLOR}`}} >$ {item.precioVenta}</h2>
                            <h2 style={{fontSize: 14, color: `${process.env.TEXT_COLOR}`}} >{item.cantidad}</h2>
                            <h2 style={{fontSize: 14, color: `${process.env.TEXT_COLOR}`}} >$ {item.subTotal}</h2>
                            <h2 style={{fontSize: 14, color: `${process.env.TEXT_COLOR}`}} >$ {item.total}</h2>
                        </li>
                    )
                }
            </ul>
            <h2 style={{fontSize: 14, color: `${process.env.TEXT_COLOR}`, textAlign: 'end', margin: '10px 0'}}>Sub-Total: ${subTotal}</h2>
            <h2 style={{fontSize: 14, color: `${process.env.TEXT_COLOR}`, textAlign: 'end', margin: '10px 0'}}>Total: ${total}</h2>
            <InputSelect label={'Metodo de pago'} preData={payment} type='text' name='metodoPago' onChange={(id, item)=>setMethodPayment(item)} value={methodPayment}/>
            <div style={{display: 'flex', margin: '5px 0', justifyContent: 'space-evenly'}}>
                <Button text={'Cancelar'} onClick={()=>setOpenAlertConfirm(true)} />
                <Button text={'Confirmar'} onClick={()=>{
                    if(methodPayment){
                        if(methodPayment.id === 2){
                            return setOpenPayCard(true)
                        }
                        return setOpenConfirmSale(true)
                    }
                    console.log('necesito hacer una funcion para esto')
                }} />
            </div>
        </div>
        {
            productSelected &&
            <AddProduct open={openAddProduct} handleClose={()=>{
                setProductSelected(undefined)
                setOpenAddProduct(false)
                formik.handleReset()
            }} product={productSelected} addProductLV={addProductLV} />
        }
        {
            (methodPayment && methodPayment.id === 1) && 
            <ConfirmSale open={openConfirmSale} handleClose={()=>setOpenConfirmSale(false)} />
        }
        {
            (methodPayment && methodPayment.id === 2) && 
            <PayCard open={openPayCard} handleClose={()=>setOpenPayCard(false)} total={total} confirmSale={confirmSale} />
        }
        <AlertConfirm open={openAlertConfirm} handleClose={()=>setOpenAlertConfirm(false)} handleConfirm={()=>router.back()} />
        {openAlertSuccess &&
            <div style={{backgroundColor: '#fff', position: 'absolute', padding: 15, borderRadius: 5, boxShadow: '1px 1px 20px #d9d9d9'}} >
                <h2 style={{fontSize: 14, color: `${process.env.GREEN_ALERT}`}} >VENTA CREADA CORRECTAMENTE</h2>
            </div>
        }
    </div>
  )
}

const payment = [
    {
        id: 1,
        descripcion: 'Efectivo'
    },
    {
        id: 2,
        descripcion: 'Tarjeta'
    }
]
