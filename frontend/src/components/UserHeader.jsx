import { Box, VStack, Flex, Text, Link } from '@chakra-ui/layout'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu'
import { Avatar } from '@chakra-ui/avatar'
import { Portal } from '@chakra-ui/portal'
import { BsInstagram } from 'react-icons/bs'
import { CgMoreO } from 'react-icons/cg'
import { Button, useToast } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { Link as RouterLink } from 'react-router-dom'
import useFollowUnfollow from '../hooks/useFollowUnfollow'

function UserHeader({ user }) {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom)
  
  const{handelFollow,updating,following}=useFollowUnfollow(user)

  const copyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: 'Link copied .',
        description: "Profail link copied .",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

    })
  }

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={'2xl'} fontWeight={'bold'}>{user.name}</Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={'sm'}>{user.username}</Text>
            <Text fontSize={'xs'} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>Threads.net</Text>
          </Flex>
        </Box>
        <Box>
          {user.profailPic&&(
            <Avatar
              name=''
              src={user.profailPic}
              size={
                {
                  base: "md",
                  md: "xl"

                }
              }
            /> )} {!user.profailPic&&(
              <Avatar
              name=''
              src=''
              size={
                {
                  base: "md",
                  md: "xl"

                }
              }
            />
            )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>
      {currentUser?._id === user._id && (
        <Link as={RouterLink} to='/update'>
          <Button size={"sm"}>Update Profail</Button>
        </Link>
      )}
      {currentUser?._id !== user._id && (

        <Button size={"sm"} onClick={handelFollow} isLoading={updating}>{following ? "Unfollow" : "Follow"}</Button>

      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w={1} h={1} borderRadius={"full"} bg={"gray.light"}></Box>
          <Link color={"gray.light"}>instagram </Link>
        </Flex>
        <Flex>
          <Box className='icon-container'>
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className='icon-container'>
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyUrl}>Copy link</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex flex={1} justifyContent={"center"} borderBottom={"1.5px solid white"} pb={3} cursor={"pointer"}>
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex flex={1} justifyContent={"center"} borderBottom={"1px solid gray"} color={"gray.light"} pb={3} cursor={"pointer"}>
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  )
}

export default UserHeader
// "https://bit.ly/broken-link"