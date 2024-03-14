import React, { useEffect, useState } from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import InputSelect from '@/components/InputSelect'
import Modal from './Modal'
import { useFormik } from 'formik'
import apiClient from '@/utils/client'
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch } from '@/redux/hook'

export default function AddProduct({open, handleClose, product, addProductLV}) {

    const [stockDisponible, setStockDisponible] = useState([])
    const dispatch = useAppDispatch();
    
    const formik = useFormik({
      initialValues: {
        cantidad: 1,
        total: 0,
        stock: {
          id: 0,
          descripcion: ''
        }
      },
      validateOnChange: false,
      onSubmit: (formValue) => {
        if(!stockDisponible || formValue.stock.cantidad < parseFloat(formValue.cantidad) || formValue.stock.id === 0){
          dispatch(setAlert({
            message: 'Stock no disponible',
            type: 'warning'
          }))
          return
        }
        const lv = {...formValue, 
          total: formValue.cantidad*product.precioVenta,
          precioVenta: product.precioVenta,
          descripcion: product.descripcion
        }
        formik.handleReset()
        setStockDisponible([])
        return addProductLV(lv) 
      }
    })

    const getStock = (codigo) => {
        apiClient(`/stock/getStock/${codigo}`)
        .then(r=>{
          r.data.map(item=>{
            setStockDisponible(prevData => {
              const exist = prevData.find(e=>e.id===item.id)
              if (exist) {
                return prevData
              }
              return [...prevData, {...item, descripcion: `Talle: ${item.talle.descripcion} Color: ${item.color.descripcion} ${item.cantidad} unidades disponibles`}]
            })
          })
        })
        .catch(e=>console.log(e))
    }

    useEffect(()=>{
        if (product) {
            getStock(product.codigo)
        }
    },[product])



  return (
    <Modal title={'Agregar producto'} eClose={handleClose} open={open} height='48%' >
    <div style={{padding: '15px 0'}}>
        <Input label={'Descripcion'} name={'descripcion'} value={product.descripcion}  readOnly={true}/>
        <Input label={'Marca'} name={'marca'} value={product.marca.descripcion} readOnly={true}/>
        <Input label={'Categoria'} name={'categoria'} value={product.categoria.descripcion} readOnly={true}/>
        <InputSelect label={'Talla y color'} preData={stockDisponible} type='text' name='roles' value={formik.values.stock.descripcion}  onChange={(id, item)=>{
          formik.setFieldValue('stock', item)
        }} />
        <Input label={'Cantidad'} name={'cantidad'} type='number' value={formik.values.cantidad} onChange={(e)=>{
            const value = e.target.value
            if(value>=1)formik.setFieldValue('cantidad', value)
        }
        }/>
        <div style={{display: 'flex', justifyContent: 'center'}} >
            <Button text={'AGREGAR'} onClick={formik.handleSubmit} />
        </div>
    </div>
    </Modal>
  )
}
