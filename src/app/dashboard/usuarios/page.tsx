import React from 'react'
import ButtonCreateUser from './components/ButtonCreate'
import { fetchUsuarios } from '@/lib/usuarios/data';
import UsersList from './components/UsersList';

const Page = async() => {
  const userList = await fetchUsuarios();
  
  return (
    <>  
    <div className="flex justify-between items-center mb-3">
      <h1>Lista de Usuarios</h1>
      <ButtonCreateUser />
    </div>
    <UsersList userList={userList} />
  </>
  )
}

export default Page
