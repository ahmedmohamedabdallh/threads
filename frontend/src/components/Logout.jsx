import { Button } from '@chakra-ui/react'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'
import { FiLogOut } from "react-icons/fi";
import { baseUrl } from '../../utilis/baseUrl'

const Logout = () => {
  const setUser=  useSetRecoilState(userAtom);
  const showToast = useShowToast();
    const handelLogout=async()=>{
        try {
           
            const res= await fetch(`${baseUrl}/users/logout`,{
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
            })
            const data=await res.json()
            if (data.error) {
                showToast("Error", data.error, "error");
                return
            }
            localStorage.removeItem('user-threads');
            setUser(null)
        } catch (error) {
            showToast("Error", error, "error");
            
        }
        return handelLogout;
    }
  return (
    <Button size={"sm"}onClick={handelLogout}>
    <FiLogOut size={20} />
    </Button>
  )
  
}

export default Logout
