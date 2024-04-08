'use client'
import AddProduct from '@/components/AddProduct'
import AlertConfirm from '@/components/AlertConfirm'
import Button from '@/components/Button'
import Comprobante from '@/components/Comprobante'
import ConfirmSale from '@/components/ConfirmSale'
import Header from '@/components/Header'
import Input from '@/components/Input'
import InputSearch from '@/components/InputSearch'
import InputSelect from '@/components/InputSelect'
import NewCliente from '@/components/NewCliente'
import PayCard from '@/components/PayCard'
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch } from '@/redux/hook'
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
    const dispatch = useAppDispatch();
    const [venta, setVenta] = useState(undefined)
    const [openComprobante, setOpenComprobante] = useState(false)
    const [openNewCliente, setOpenNewCliente] = useState(false)
    const [cliente, setCliente] = useState({
        nombre: 'Anonimo',
        cuit: '0',
        domicilio: ''
    })

    const formik = useFormik({
        initialValues: {
          search: ''
        },
        validateOnChange: false,
        onSubmit: (formValue) => {
            const {search} = formValue
            apiClient.get(`/articulo/find/${search}`)
            .then((r)=>{
                console.log(r.data)
                if (r.data === null) {
                    dispatch(setAlert({
                        message: 'Codigo invalido o producto no existente',
                        type: 'error'
                    }))
                }
                setProductSelected(r.data)
                setOpenAddProduct(true)
            })
            .catch(e=>{
                console.log(e)
            })
        }
    })

    const addProductLV = (lv) => {
        const exist = lineaVenta.some(elem => elem.stock.id === lv.stock.id)
        if (!exist) {
            setLineaVenta(prevData=>[...prevData, lv])
            setOpenAddProduct(false)
        }else{
            dispatch(setAlert({
                message: 'Producto ya existente',
                type: 'warning'
            }))
        }
    }

    useEffect(()=>{
        const sumTotal = lineaVenta.reduce(
            (accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.total),
            0,
        );
        setTotal(sumTotal)
    },[lineaVenta])

    const confirmSale = (payCard) => {
        let pago
        if (payCard) {
            pago = {
                tipoPago: "TarjetaDebito",
                fecha: fecha,
                monto: total,
                pagoTarjeta: {...payCard}

            }
        } else {
            pago = {
                tipoPago: "Efectivo",
                fecha: fecha,
                monto: total
            }
        }

        const venta = {
            lineaVenta: lineaVenta,
            total: total,
            fecha: fecha,
            pago: pago,
            cliente: cliente
        }
        console.log(venta);
        setVenta(venta)
        if (total <= 0) {
            dispatch(setAlert({
                message: 'Sin productos agregados',
                type: 'warning'
            }))
            return
        }
        apiClient.post('/venta/save', venta)
        .then(r=>{
            setOpenConfirmSale(false)
            setOpenPayCard(false)
            dispatch(setAlert({
                message: 'Venta realizada correctamente',
                type: 'success'
            }))
            setTimeout(() => {
                setOpenComprobante(true)
            }, 1000);
        })
        .catch(e=>{
            dispatch(setAlert({
                message: 'La venta no pudo realizarse',
                type: 'error'
            }))
            console.log(e)
        })
    }

    const abrirMetodoPago = (cliente)=>{
        console.log("cliente",cliente)
        setCliente(cliente)
        if(methodPayment){
            if(methodPayment.id === 2){
                return setOpenPayCard(true)
            }
            return setOpenConfirmSale(true)
        }
        
        dispatch(setAlert({
            message: 'Debe seleccionar metodo de pago',
            type: 'warning'
        }))
        return
    }

    
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
                            <h2 style={{fontSize: 14, color: `${process.env.TEXT_COLOR}`}} >$ {item.total}</h2>
                        </li>
                    )
                }
            </ul>
            <h2 style={{fontSize: 14, color: `${process.env.TEXT_COLOR}`, textAlign: 'end', margin: '10px 0'}}>Total: ${total}</h2>
            <InputSelect label={'Metodo de pago'} preData={payment} type='text' name='metodoPago' onChange={(id, item)=>{
                setMethodPayment(item)
            }}/>
            <div style={{display: 'flex', margin: '5px 0', justifyContent: 'space-evenly'}}>
                <Button text={'Cancelar'} onClick={()=>setOpenAlertConfirm(true)} />
                <Button text={'Confirmar'} onClick={()=>{
                    console.log(total >= 10000)
                    if (total >= 10000) {
                        return setOpenNewCliente(true)
                    }
                    abrirMetodoPago()
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
            openNewCliente &&
            <NewCliente open={openNewCliente} handleClose={()=>setOpenNewCliente(false)} confirm={abrirMetodoPago} />
        }
        {
            (methodPayment && methodPayment.id === 1) && 
            <ConfirmSale open={openConfirmSale} handleClose={()=>setOpenConfirmSale(false)} total={total} confirmSale={confirmSale} />
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
        {
            venta &&
            <Comprobante {...venta} open={openComprobante} handleClose={()=>{setOpenComprobante(false);router.push('/Home')}}  />
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
        descripcion: 'Tarjeta Debito'
    },
    {
        id: 3,
        descripcion: 'Tarjeta Credito'
    }
]
