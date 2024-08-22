import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import { useParams } from "react-router-dom";


const useGetUserProfail = () => {
    const[user,setUser]=useState(null);
    const[loading,setLoading]=useState(false);
    const { username } = useParams();
    const showToast = useShowToast();
    useEffect(()=>{
        const getUser=async()=>{
          try {
            const res = await fetch(`/api/users/profail/${username}`);
            const data = await res.json();
            if (data.error) {
              showToast("Error", data.error, "error");
              return
            }
            if(data.isFrozen){
              setUser(null)
              return;
            }
            
            setUser(data)
          } catch (error) {
            showToast("Error", error, "error")
          }finally{
            setLoading(false)
          }
        }
        getUser()
      },[username,showToast])
      return{loading,user}
}

export default useGetUserProfail
