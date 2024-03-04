import React from 'react'
import Modal from './Modal'
import Input from './Input'
import Button from './Button'

export default function ConfirmSale({open, handleClose}) {
  return (
    <Modal title={'Confirmar venta'} open={open} eClose={handleClose} height='auto' >
        <div style={{padding: '15px 0'}} >
            <Input label={'Dinero entregado'} name={'dineroEntregado'} value={''} type='number' onChange={(e)=>console.log(e.target.value)} />
            <h2 style={{fontSize: 14, color: `${process.env.TEXT_COLOR}`, margin: '15px 0'}} >Vuelto a entregar : $0</h2>
            <div style={{display: 'flex', margin: '5px 0', justifyContent: 'space-evenly'}}>
                <Button text={'Cancelar'} onClick={handleClose} />
                <Button text={'Confirmar'} onClick={handleClose} />
            </div>
        </div>
    </Modal>
  )
}
