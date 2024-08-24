import { SearchIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Conversation from '../components/Conversation'
import MessageContainer from '../components/MessageContainer';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import { conversationAtom, selectConversationAtom } from '../atoms/messageAtom';
import { GiConversation } from "react-icons/gi";
import userAtom from '../atoms/userAtom';
import { useSocket } from '../context/SocketContext';
import { baseUrl } from '../../utilis/baseUrl';



const ChatPage = () => {
  const [searchingUser, setSearchingUser] = useState(false)
  const [loadingConversaton, setLoadingConversaton] = useState(true)
  const [searchText, setSearchText] = useState("");
  const [conversations, setConversations] = useRecoilState(conversationAtom)
  const [selectConversation, setSelectConversation] = useRecoilState(selectConversationAtom);
  const currentUser=useRecoilValue(userAtom);
  const showToast = useShowToast();
  const {socket,online}=useSocket();
  useEffect(() => {
		socket?.on("messagesSeen", ({ conversationId }) => {
			setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === conversationId) {
						return {
							...conversation,
							lastMessage: {
								...conversation.lastMessage,
								seen: true,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
		});
	}, [socket, setConversations]);
  useEffect(() => {
    const getConversaton = async () => {
      try {
        const res = await fetch(`${baseUrl}/messages/conversations`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setConversations(data)
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingConversaton(false)
      }
    }
    getConversaton();
  }, [showToast, setConversations])
  const handleConversationSearch = async (e) => {
    e.preventDefault();
		setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profail/${searchText}`);
			const searchedUser = await res.json();
			if (searchedUser.error) {
				showToast("Error", searchedUser.error, "error");
				return;
			}
      const messagingYourself = searchedUser._id === currentUser._id;
			if (messagingYourself) {
				showToast("Error", "You cannot message yourself", "error");
				return;
			}

			const conversationAlreadyExists = conversations.find(
				(conversation) => conversation.participants[0]._id === searchedUser._id
			);

			if (conversationAlreadyExists) {
				setSelectConversation({
					_id: conversationAlreadyExists._id,
					userId: searchedUser._id,
					username: searchedUser.username,
					userProfilePic: searchedUser.profilePic,
				});
				return;
			}
      const mockConversation={
        mock:true,
        lastMessage:{
          text:"",
          sender:""
        },
        _id:Date.now(),
        participants:[{
          _id:searchedUser._id,
          username:searchedUser.username,
          profailPic:searchedUser.profailPic
        }]
      }
      setConversations((prevConvs)=>[...prevConvs,mockConversation])
    } catch (error) {
      showToast("Error", error.message, "error");
    }finally{
      setSearchingUser(false);
    }
  }
  return (
    <Box w={{
      base: "100%",
      md: "80%",
      lg: "750px"

    }} position={"absolute"} left={"50%"} transform={"translateX(-50%)"} p={4}>

      <Flex gap={4}
        flexDirection={{
          base: "column",
          md: 'row'
        }}
        maxW={{
          base: "400px",
          md: "full"
        }}
        mx={'auto'}
      >
        <Flex flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{
            base: "502px",
            md: "full"
          }}
          mx={'auto'}
        >
          <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
            Your conversations
          </Text>
          <form onSubmit={handleConversationSearch}>
						<Flex alignItems={"center"} gap={2}>
							<Input placeholder='Search for a user' onChange={(e) => setSearchText(e.target.value)} />
							<Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>
								<SearchIcon />
							</Button>
						</Flex>
					</form>
          {loadingConversaton && (
            [0, 1, 2, 3, 4, 5].map((_, i) => (
              <Flex key={i} gap={4} alignItems={"center"} p={1} borderRadius={"md"}>
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            )))}
          {!loadingConversaton && (conversations.map((conversation) => (
            <Conversation key={conversation._id} 
            isOnline={online.includes(conversation.participants[0]._id)}
            conversation={conversation} />
          )))}
        </Flex>
        {!selectConversation._id && (
          <Flex flex={70} p={2} height={"400px"} alignItems={"crnter"} flexDir={"column"} borderRadius={"md"} justifyContent={"center"}>
            <GiConversation size={100} />
            <Text fontSize={20}>Select a conversation to start messaging</Text>
          </Flex>
        )}

        {selectConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  )
}

export default ChatPage
