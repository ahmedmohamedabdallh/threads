import {  Box, Flex, Spinner } from "@chakra-ui/react"

import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { useEffect, useState } from "react"
import useShowToast from "../hooks/useShowToast"
import Post from "../components/Post"
import postsAtom from "../atoms/postsAtom"
import SuggestedUsers from "../components/SuggestedUsers"
import messageSound from "../assets/sounds/message.mp3"

const HomePage = () => {
  const user=useRecoilValue(userAtom)
  const showToast = useShowToast();
  const[posts,setPosts]=useRecoilState(postsAtom)
  const[loading,setLoading]=useState(true)
  useEffect(()=>{
    const getFeedPosts=async()=>{
      setLoading(true)
      setPosts([])
      if (!document.hasFocus()) {
				const sound = new Audio(messageSound);
				sound.play();
			}

      try {
        const res=await fetch("/api/posts/feed");
        const data =await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data)

        
        
      } catch (error) {
        showToast("Error", error.message, "error");
      }finally{
        setLoading(false)
      }
    }
    getFeedPosts()
  },[showToast,setPosts])
  return (

    <>
    <Flex gap={"10"} alignItems={"flex-start"}>
<Box flex={70}>
{!loading && posts.length===0 && <h1>follow some user to see feed</h1>}

{loading && (
 <Flex justifyContent={'center'}>
   <Spinner size={'xl'}/>
 </Flex>
)}


{posts.map((post)=>(
<Post key={post._id}post={post}postedBy={post.postedBy}/>
))}
</Box>
<Box flex={30}
display={
 { 
  base:"none",
md:"block"
}
}
>
<SuggestedUsers/>
</Box>
</Flex>
</>
  )
}

export default HomePage

