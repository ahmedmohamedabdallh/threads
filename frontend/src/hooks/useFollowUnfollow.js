import  { useState } from 'react'
import useShowToast from './useShowToast';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { baseUrl } from '../../utilis/baseUrl';

const useFollowUnfollow = (user) => {
    const currentUser = useRecoilValue(userAtom);
    const [following, setFollowing] = useState(user.followers.includes(currentUser?._id));
  const showToast = useShowToast()
  const [updating, setUpdating] = useState(false)
    const handelFollow = async () => {
        if (!currentUser) {
          showToast("Error", "Please login to follow", "error")
          return;
        }
        if (updating) return
        setUpdating(true)
        try {
          const res = await fetch(`${baseUrl}/users/follow/${user._id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
    
          })
          const data = await res.json();
          if (data.error) {
            showToast("Error", data.error, "error")
            return
          }
          if (following) {
            showToast("Success", `Unfollowed ${user.name}`, "success")
            user.followers.pop()
          } else {
            showToast("Success", `Followed ${user.name}`, "success")
            user.followers.push(currentUser?._id)
          }
          setFollowing(!following)
    
        } catch (error) {
          showToast("Error", error, "error")
        } finally {
          setUpdating(false)
        }
    }
  return {handelFollow,updating,following}


};
export default useFollowUnfollow
