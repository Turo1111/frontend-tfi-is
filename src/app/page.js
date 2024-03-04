'use client'
import Button from "@/components/Button";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components"

export default function Home() {

  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      usuario: '',
      password: ''
    },
    validateOnChange: false,
    onSubmit: (formValue) => {
      console.log(formValue)
      router.push('/Home')
    }
  })


  return (
    <Container>
      <ContainerLogin>
        <Logo>LA TIENDA</Logo>
        <div>
          <Input label={'Usuario'} name={'usuario'} value={formik.values.usuario} onChange={formik.handleChange}/>
          <Input type="password" name={'password'} label={'Contraseña'} value={formik.values.password} onChange={formik.handleChange}/>
        </div>
        <div style={{display: "flex", justifyContent: "center"}} >
          {
            loading ? 
            <Loading />:
            <Button text={'INGRESAR'} onClick={formik.handleSubmit} width="150px"/>
          }
        </div>
      </ContainerLogin>
    </Container>
  )
}

const Container = styled.div `
  padding: 0 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: radial-gradient(circle at 50% -20.71%, #00ffff 0, #21e0ff 25%, #3cb5f2 50%, #408cbb 75%, #3b6788 100%);
`

const ContainerLogin = styled.div `
  width: 350px;
  background-color: #F9F5F6;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const Logo = styled.h2 `
  color: #8294C4;
  text-align: center;
  margin: 15px 0;
  font-size: 40px;
`
