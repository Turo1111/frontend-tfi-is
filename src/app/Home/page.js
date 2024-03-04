'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import styled from 'styled-components'

export default function Home() {

  const router = useRouter()

  return (
    <div style={{margin: '0 20%'}}>
        <Logo>LA TIENDA</Logo>
        <div style={{display: 'flex', justifyContent: 'space-evenly'}} >
            <h2 style={{fontSize: 16, color: `${process.env.TEXT_COLOR}`}} >Bienvenido, usuario986</h2>
            <LogOut onClick={()=>router.push('/')} >Cerrar sesion</LogOut>
        </div>
        <ul style={{ padding: '5px 15%'}}>
            <ItemMenu  onClick={()=>router.push('/NewSale')} >REALIZAR VENTA</ItemMenu>
            <ItemMenu>GESTIONAR ARTICULOS</ItemMenu>
        </ul>   
    </div>
  )
}

const LogOut = styled.h2 `
  font-size: 16px;
  cursor: pointer;
  color: ${process.env.TEXT_COLOR};
  &:hover{
        color: ${process.env.RED_ALERT};
  }
`

const ItemMenu = styled.li `
    list-style: none;
    color: ${process.env.TEXT_COLOR};
    padding: 10px 25px;
    margin: 15px 0;
    background-color: #d9d9d9;
    font-size: 25px;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
    &:hover{
        background-color: ${process.env.BLUE_COLOR};
        color: white;
    }
`

const Logo = styled.h2 `
  color: #8294C4;
  text-align: center;
  margin: 15px 0;
  font-size: 40px;
`
