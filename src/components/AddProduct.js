import React, { useEffect, useState } from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import InputSelect from '@/components/InputSelect'
import Modal from './Modal'
import { useFormik } from 'formik'
import apiClient from '@/utils/client'

export default function AddProduct({open, handleClose, product, addProductLV}) {

    const [stocks, setStocks] = useState([])
    const [stock, setStock] = useState(undefined)
    
    const [selectTalle, setSelectTalle] = useState({
        id: 0,
        descripcion: ''
    })
    const [selectColor, setSelectColor] = useState({
        id: 0,
        descripcion: ''
    })

    const formik = useFormik({
      initialValues: {
        cantidad: 1
      },
      validateOnChange: false,
      onSubmit: (formValue) => {
        if(!stock || stock.cantidad < formValue.cantidad){
          return console.log("faltan seleccionar datos")
        }
        const lv = {
          idStock: stock.id,
          descripcion: product.descripcion,
          precioVenta: product.precioVenta,
          cantidad: formValue.cantidad,
          subTotal: (formValue.cantidad * product.precioVenta).toFixed(2),
          total: (formValue.cantidad * product.precioVenta).toFixed(2),
        }
        return addProductLV(lv)
      }
    })

    const getStock = (codigo) => {
        apiClient(`/stock/getStock/${codigo}`)
        .then(r=>setStocks(r.data))
        .catch(e=>console.log(e))
    }

    useEffect(()=>{
        if (product) {
            getStock(product.codigo)
        }
    },[product])

    useEffect(()=>{

        if (selectColor.id !== 0 && selectTalle.id !== 0) {
            const s = stocks.find(elem => elem.talle.id === selectTalle.id && elem.color.id === selectColor.id )
            console.log(s)
            if (s) {
              return setStock(s)
            }
            return setStock(undefined)
        }
        
    },[stocks, selectColor, selectTalle])


  return (
    <Modal title={'Agregar producto'} eClose={handleClose} open={open} height='58%' >
    <div style={{padding: '15px 0'}}>
        <Input label={'Descripcion'} name={'descripcion'} value={product.descripcion}  readOnly={true}/>
        <Input label={'Marca'} name={'marca'} value={product.marca.descripcion} readOnly={true}/>
        <Input label={'Categoria'} name={'categoria'} value={product.categoria.descripcion} readOnly={true}/>
        <InputSelect label={'Talla'} preData={product.talle} type='text' name='roles' value={selectTalle.descripcion}  onChange={(id, item)=>{
            console.log(item)
          setSelectTalle({id: item.id, descripcion: item.descripcion})
        }} />
        <InputSelect label={'Color'} preData={product.color} type='text' name='color' value={selectColor.descripcion}  onChange={(id, item)=>{
          setSelectColor({id: item.id, descripcion: item.descripcion})
        }} />
        { stock && 
          stock.cantidad > 1 ? <h2 style={{fontSize: 16, color: `${process.env.TEXT_COLOR}`, margin: '15px 0'}} >{stock.cantidad} articulos disponibles</h2>
          :
          <h2 style={{fontSize: 16, color: `${process.env.TEXT_COLOR}`, margin: '15px 0'}} >Articulo sin stock disponible</h2>
        }
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
