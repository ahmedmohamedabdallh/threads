import { Flex,Image, Text } from '@chakra-ui/react'

const Dess = () => {
  return (
    <Flex mb={"10px"} textAlign={"center"} alignItems={"center"} justifyContent={"flex-start"}  flexDir={'column'} position={'fixed'}bottom={"30px"}right={"45%"} >
      <Image src='./icons8-wi-fi-disconnected-100.png' objectFit='cover'/>
      <Text fontSize='2xl'>Not Connection</Text>
      <Text fontSize='lg'>Please check your internet connection</Text>
    </Flex>
  )
}

export default Dess
