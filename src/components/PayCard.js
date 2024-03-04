import { useFormik } from 'formik'
import React from 'react'
import Input from './Input'
import Modal from './Modal'
import InputSelect from './InputSelect'
import Button from './Button'
import apiClient from '@/utils/client'

export default function PayCard({open, handleClose, total, confirmSale}) {

    const formik = useFormik({
        initialValues: {
          card_number: '',
          card_expiration_month: '',
          card_expiration_year: '',
          security_code: '',
          card_holder_name: '',
          type: '',
          number: '',
        },
        validateOnChange: false,
        onSubmit: (formValue) => {
          apiClient.post(`/authpay/confirm`, {...formValue, monto: total})
          .then(r => {
            if (r) {
              confirmSale()
            }
          })
          .catch(e=>console.log(e))
        }
    })

  return (
    <Modal title={'Pago con tarjeta'} eClose={handleClose} open={open} height='60%' >
        <Input label={'Numero de tarjeta'} name={'card_number'} value={formik.values.card_number} onChange={formik.handleChange} />
        <Input label={'Mes de expiracion'} name={'card_expiration_month'} value={formik.values.card_expiration_month} onChange={formik.handleChange} />
        <Input label={'Año de expiracion'} name={'card_expiration_year'} value={formik.values.card_expiration_year} onChange={formik.handleChange} />
        <Input label={'Codigo de seguridad'} name={'security_code'} value={formik.values.security_code} onChange={formik.handleChange} />
        <Input label={'Nombre del propietario'} name={'card_holder_name'} value={formik.values.card_holder_name} onChange={formik.handleChange} />
        <InputSelect label={'Tipo de documento'} preData={[{id: 1, descripcion: 'dni'}]} type='text' name='type' value={formik.values.type}  onChange={(id, item)=>{
          formik.setFieldValue('type', item.descripcion)
        }} />
        <Input label={'Numero de documento'} name={'number'} value={formik.values.number} onChange={formik.handleChange} />
        <div style={{display: 'flex', justifyContent: 'center'}} >
            <Button text={'CONFIRMAR'} onClick={formik.handleSubmit} />
        </div>
    </Modal>
  )
}