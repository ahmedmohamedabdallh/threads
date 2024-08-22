import { Avatar, Divider, Flex, Text } from "@chakra-ui/react"




function Comments({reply,lastReply}) {
    return (
        <>
            <Flex gap={4} w={"full"} my={4} py={2}>
                <Avatar src={reply.userProfailPic} size={"sm"} />


                <Flex gap={1} flexDirection={"column"} w={"full"}>
                    <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"}>{reply.username}</Text>
                    </Flex>
                    <Text>{reply.text}</Text>
                    
                </Flex>

            </Flex>
           {!lastReply? <Divider/>:null}
        </>
    )
}

export default Comments
