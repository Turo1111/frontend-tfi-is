import React from 'react'
import Modal from './Modal'
import Button from './Button'

export default function AlertConfirm({open, handleClose, handleConfirm}) {
  return (
    <Modal title={'¿Desea confirmar la accion?'} open={open} eClose={handleClose} height='auto' >
        <div style={{display: 'flex', margin: '5px 0', justifyContent: 'space-evenly'}}>
            <Button text={'Cancelar'} onClick={handleClose} />
            <Button text={'Confirmar'} onClick={handleConfirm} />
        </div>
    </Modal>
  )
}
