import React from 'react'
import Table from './Table';
import { useDate } from '@/hooks/useDate';
import Modal from './Modal';
import styled from 'styled-components';

export default function Comprobante({
    fecha,
    cliente,
    lineaVenta,
    pago,
    total,
    open,
    handleClose
}) {

    const { date: fechaDate } = useDate(fecha);

    console.log(cliente)

  return (
    <Modal title={'Comprobante'} eClose={handleClose} open={open} height='auto' width='50%'>
      <div>
        <Tag>CLIENTE : {cliente ? cliente.nombre : 'Anonimo'}</Tag>
        <Tag>FECHA : {fechaDate}</Tag>
        <Tag>TIPO DE PAGO : {pago.tipoPago}</Tag>
      </div>
      <div>
        <Table
          data={lineaVenta}
          columns={columns}
          maxHeight={false}
          onClick={() => ''}
        />
      </div>
      <Tag style={{ textAlign: 'end' }}>TOTAL : $ {total}</Tag>
    </Modal>
  )
}

const columns = [
  { label: 'Producto', field: 'descripcion', width: '40%' },
  { label: 'Precio', field: 'precioVenta', width: '20%', align: 'center' },
  { label: 'Cantidad', field: 'cantidad', width: '20%', align: 'center' },
  { label: 'Total', field: 'total', width: '20%', align: 'center', price: true },
];

const Tag = styled.h5`
  font-size: 16px;
  padding: 0 15px;
  font-weight: 500;
  margin: 10px 0;
  color: ${process.env.TEXT_COLOR};
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;