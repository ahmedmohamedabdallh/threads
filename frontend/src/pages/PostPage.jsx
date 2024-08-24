import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import Actions from "../components/Actions"
import { useEffect, useState } from "react";
import Comments from "../components/Comments";
import useGetUserProfail from "../hooks/useGetUserProfail";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";
import { baseUrl } from "../../utilis/baseUrl";

const PostPage = () => {

  const { user, loading } = useGetUserProfail();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const currentPost = posts[0];
  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const res = await fetch(`${baseUrl}/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);

      } catch (error) {
        showToast("Error", error.message, "error");
      }
    }
    getPost();
  }, [showToast, pid, setPosts])
  const handelDeletePost = async () => {
    try {

      if (!window.confirm("Are you sure you want delete this post?")) return;
      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE"
      })
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      navigate(`/${user.username}`)
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  }
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    )
  }
  if (!currentPost) return null;
  console.log("currentPost", currentPost);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user?.profailPic} size={'md'} name=''/>
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>{user?.username}</Text>
            <Image src="verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={'xs'} w={36} textAlign={"right"} color={"gray.light"}>
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          {currentUser?._id === user?._id && (<DeleteIcon size={20} cursor={"pointer"} onClick={handelDeletePost} />)}

        </Flex>
      </Flex>
      <Text my={3}>{currentPost.text}</Text>
      {currentPost.img && (<Box borderRadius={6} overflow={"hidden"} border={'1px solid'} borderColor={"gray.light"}>
        <Image w={"full"} src={currentPost.img} />

      </Box>)}
      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like ,replay and post.</Text>

        </Flex>
        <Button>
          Get
        </Button>

      </Flex>
      <Divider my={4} />
      {currentPost.replaies.map(reply => (
        <Comments
          key={reply._id}
          reply={reply}
          lastReply={reply._id === currentPost.replaies[currentPost.replaies.length - 1]._id}
        />
      ))}


    </>
  )
}

export default PostPage
