import React from 'react'

import LoginCard from '../components/LoginCard'
import { useRecoilValue } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
import SingupCard from '../components/SingupCard'

const AuthPage = () => {
    const authScreenState=useRecoilValue(authScreenAtom)
  return (
    <>
      {authScreenState==="login"?<LoginCard/>:<SingupCard/>}
    </>
  )
}

export default AuthPage

