import React from 'react'
import Modal from './Modal'
import { useFormik } from 'formik'
import Input from './Input'
import Button from './Button'

export default function NewCliente({open, handleClose, confirm}) {

    const formik = useFormik({
        initialValues: {
          cuit: '',
          nombre: '',
          direccion: ''
        },
        validateOnChange: false,
        onSubmit: (formValue) => {
            console.log(formValue)
            confirm(formValue)
        }
      })

  return (
    <Modal title={'Cliente'} open={open} eClose={handleClose} >
         <Input label={'Cuit'} name={'cuit'} value={formik.values.cuit} onChange={formik.handleChange} />
         <Input label={'Nombre'} name={'nombre'} value={formik.values.nombre} onChange={formik.handleChange}/>
         <Input label={'Direccion'} name={'direccion'} value={formik.values.direccion} onChange={formik.handleChange}/>
         <div style={{display: 'flex', justifyContent: 'center'}} >
            <Button text={'AGREGAR'} onClick={formik.handleSubmit} />
        </div>
    </Modal>
  )
}
