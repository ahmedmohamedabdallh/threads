import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import Actions from './Actions'

function UserPost({Likes,replies,postImg,postTitle}) {
    const[like,setLike]=useState(false);
    return (
        <Link to={"/ahmedmohamed/post/1"}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar size={"md"} name='Ahmed Mohamed' src='zuck-avatar.png' />
                    <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
                    <Box position={"relative"} w={"full"} mt={3}>
                        <Avatar
                            name='Malek'
                            size={"xs"}
                            src='https://bit.ly/dan-abramov'
                            position={"absolute"}
                            top={"0"}
                            left={"15px"}
                            padding={"2px"}
                        />
                        <Avatar
                            name='Mohamed'
                            size={"xs"}
                            src='https://bit.ly/code-beast'
                            position={"absolute"}
                            bottom={"0"}
                            right="-5px"
                            padding={"2px"}
                        />
                        <Avatar
                            name='Mostafa'
                            size={"xs"}
                            src='https://bit.ly/prosper-baba'
                            position={"absolute"}
                            bottom={"0"}
                            left="4px"
                            padding={"2px"}
                        />

                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                        <Text fontSize={'sm'} fontWeight={'bold'}>Ahmed Mohamed</Text>
                            <Image src='/verified.png' w={4} h={4} ml={1}  />
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                        <Text fontSize={'sm'} color={"gray.light"}>1d</Text>
                        <BsThreeDots/>
                        </Flex>
                    </Flex>
                    <Text fontSize={"sm"}>{postTitle}</Text>
                    {postImg &&(
                          <Box borderRadius={6}overflow={"hidden"}border={'1px solid'} borderColor={"gray.light"}>
                          <Image w={"full"} src={postImg}/>
  
                      </Box>
                    )}
                  
                    <Flex gap={3}my={1}>
                        <Actions like={like} setLike={setLike}/>
                    </Flex>
                    <Flex gap={2}alignItems={"center"}>
                    <Text fontSize={"sm"} color={"gray.light"}>{replies} replies</Text>
                    <Box w={0.5}h={0.5}borderRadius={"full"}bg={"gray.light"}></Box>
                    <Text fontSize={"sm"} color={"gray.light"}>{Likes} likes</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    )
}

export default UserPost
