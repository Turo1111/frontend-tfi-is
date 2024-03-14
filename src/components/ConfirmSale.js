import React, { useEffect } from 'react'
import Modal from './Modal'
import Input from './Input'
import Button from './Button'
import { useState } from 'react'

export default function ConfirmSale({open, handleClose, total, confirmSale}) {

  const [dineroEntregado, setDineroEntregado] = useState(0)
  const [vuelto, setVuelto] = useState(0)

  useEffect(()=>{
    setVuelto(Math.abs((total-dineroEntregado).toFixed(2)))
  },[dineroEntregado])

  return (
    <Modal title={'Confirmar venta'} open={open} eClose={handleClose} height='auto' >
        <div style={{padding: '15px 0'}} >
            <Input label={'Dinero entregado'} name={'dineroEntregado'} value={dineroEntregado} type='number' onChange={(e)=>(e.target.value >= 0) && setDineroEntregado(e.target.value)} />
            <h2 style={{fontSize: 14, color: `${process.env.TEXT_COLOR}`, margin: '15px 0'}} >Monto total : ${total}</h2>
            <h2 style={{fontSize: 14, color: `${process.env.TEXT_COLOR}`, margin: '15px 0'}} >Vuelto a entregar : ${vuelto}</h2>
            <div style={{display: 'flex', margin: '5px 0', justifyContent: 'space-evenly'}}>
                <Button text={'Cancelar'} onClick={handleClose} />
                <Button text={'Confirmar'} onClick={()=>confirmSale(undefined)} />
            </div>
        </div>
    </Modal>
  )
}
