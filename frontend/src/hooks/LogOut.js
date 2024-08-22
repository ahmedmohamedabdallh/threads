import { useSetRecoilState } from "recoil";
import useShowToast from "./useShowToast";
import userAtom from "../atoms/userAtom";


const LogOut=()=>{
    const setUser=  useSetRecoilState(userAtom);
    const showToast = useShowToast();
      const handelLogout=async()=>{
          try {
             
              const res= await fetch("/api/users/logout",{
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
          
      }
      return handelLogout;
}
export default LogOut