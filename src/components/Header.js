import React from 'react'
import { MdArrowBack } from 'react-icons/md'
import styled from 'styled-components'

export default function Header({title}) {
  return (
    <Container>
        <ButtonBack>
            <MdArrowBack style={{fontSize: 18, marginRight: 15}}/>
            <h2 style={{fontSize: 18}}>Volver</h2>
        </ButtonBack>
        <div style={{margin: '0 25px', borderRight: '#fff solid 1px'}} ></div>
        <h2 style={{fontSize: 18, color: `${process.env.TEXT_COLOR}`}}>{title}</h2>
    </Container>
  )
}


const Container = styled.div `
    display: flex;
    padding: 15px;
    background-color: #d9d9d9;
`

const ButtonBack = styled.div `
    display: flex;
    align-items: center;
    color: ${process.env.TEXT_COLOR};
    cursor: pointer;
    &:hover{
        color: white;
    }
`