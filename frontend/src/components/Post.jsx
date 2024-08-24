

import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Actions from './Actions'
import useShowToast from '../hooks/useShowToast'
import { formatDistanceToNow } from "date-fns";
import {DeleteIcon} from "@chakra-ui/icons"
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import postsAtom from '../atoms/postsAtom'
import { baseUrl } from '../../utilis/baseUrl'
function Post({ post, postedBy}) {
    const [user, setUser] = useState(null);
    const showToast = useShowToast();
    const currentUser=useRecoilValue(userAtom)
    const [posts, setPosts] = useRecoilState(postsAtom);
    const navigate=useNavigate()
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`${baseUrl}/users/profail/`+postedBy)
                const data = await res.json()
                
                setUser(data)
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }

            } catch (error) {
                showToast("Error", error.message, "error");
                setUser(null)
            }
        }
        getUser()
    }, [postedBy, showToast])
    const handelDeletePost=async(e)=>{
        try {
            e.preventDefault();
            if(!window.confirm("Are you sure you want delete this post?")) return;
            const res=await fetch(`/api/posts/${post._id}`,{
                method:"DELETE"
            })
            const data= await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            showToast("Success", "Post deleted", "success");
            setPosts(posts.filter((p)=>p._id!==post._id))
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    }
    if (!user) return null
    return (
        <Link to={`/${user.username}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar size={"md"} name='' src={user?.profailPic} 
                    onClick={(e)=>{
                        e.preventDefault();
                        navigate(`/${user.username}`)
                    }}
                    />
                    <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
                    <Box position={"relative"} w={"full"} mt={3}>
                        {post.replaies?.length === 0 &&<Text textAlign={'center'}>🥱</Text>}
                        {post?.replaies[0] && (
                            <Avatar
                                name=''
                                size={"xs"}
                                src={post.replaies[0].userProfailPic}
                                position={"absolute"}
                                top={"0"}
                                left={"15px"}
                                padding={"2px"}
                            />
                        )}
                        {post?.replaies[1] && (
                            <Avatar
                                name=''
                                size={"xs"}
                                src={post.replaies[1].userProfailPic}
                                position={"absolute"}
                                top={"0"}
                                left={"15px"}
                                padding={"2px"}
                            />
                        )}
                        {post?.replaies[2] && (
                            <Avatar
                                name=''
                                size={"xs"}
                                src={post.replaies[2].userProfailPic}
                                position={"absolute"}
                                top={"0"}
                                left={"15px"}
                                padding={"2px"}
                            />
                        )}

                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontSize={'sm'} fontWeight={'bold'}
                              onClick={(e)=>{
                                e.preventDefault();
                                navigate(`/${user.username}`)
                            }}
                            >{user?.username}</Text>
                            <Image src='/verified.png' w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={'xs'} w={36} textAlign={"right"} color={"gray.light"}>
                                {formatDistanceToNow(new Date(post.createdAt))} ago
                            </Text>
                            {currentUser._id===user._id &&(<DeleteIcon size={20} onClick={handelDeletePost}/>)}
                            
                        </Flex>
                    </Flex>
                    <Text fontSize={"sm"}>{post.text}</Text>
                    {post.img ?
                        <Box borderRadius={6} overflow={"hidden"} border={'1px solid'} borderColor={"gray.light"}>
                            <Image w={"full"} src={post.img} />

                        </Box>
                    :''}

                    <Flex gap={3} my={1}>
                        <Actions post={post} />
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    )
}

export default Post
