import { AddIcon } from '@chakra-ui/icons'
import {
    Button,
    CloseButton,
    Flex,
    FormControl,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from 'react'
import userPreviewImg from '../hooks/userPreviewImg';
import { BsFillImageFill } from 'react-icons/bs';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from '../hooks/useShowToast';
import postsAtom from '../atoms/postsAtom';
import { useParams } from 'react-router-dom';
import { baseUrl } from '../../utilis/baseUrl';


const CreatePost = () => {
    const MAX_CHAR = 500;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState('')
    const { handelImageChange, imgUrl, setImgUrl } = userPreviewImg();
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const user=useRecoilValue(userAtom);
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();
    const imgRef = useRef(null);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const { username } = useParams();
    const handleTextChange = (e) => {
        const inputText = e.target.value
        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR)
            setPostText(truncatedText)
            setRemainingChar(0)
        } else {
            setPostText(inputText)
            setRemainingChar(MAX_CHAR - inputText.length)
        }
    }
    const handelCreatePost = async () => {
    	setLoading(true);
		try {
			const res = await fetch(`${baseUrl}/posts/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
			});

			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post created successfully", "success");
			if (username === user.username) {
				setPosts([data, ...posts]);
			}
			onClose();
			setPostText("");
			setImgUrl("");
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setLoading(false);
		}
	};

    return (
        <>
            <Button
                position={"fixed"}
                bottom={10}
                right={5}
                bg={useColorModeValue("gray.300", "gray.dark")}
                onClick={onOpen}
                size={{base:"sm",sm:'md'}}
                >
                <AddIcon />
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea
                                placeholder='Post content goes here..'
                                onChange={handleTextChange}
                                value={postText}
                                mb={"10px"}
                            />
                            <Text fontSize='xs' fontWeight='bold' textAlign={"right"} m={"1"} color={"gray.800"}>
                                {remainingChar}/{MAX_CHAR}
                            </Text>
                            <Input type='file' hidden ref={imgRef} onChange={handelImageChange} />
                            <BsFillImageFill
                                style={{ marginLeft: "5px", cursor: "pointer" }}
                                size={16} onClick={() => imgRef.current.click()}
                            />
                        </FormControl>
                        {imgUrl && (
                            <Flex mt={5} w={"full"} position={"relative"}>
                                <Image src={imgUrl} alt='Selected img' />
                                <CloseButton onClick={() => {
                                    setImgUrl('')
                                }}
                                    bg={"gray.800"}
                                    position={'absolute'}
                                    top={2}
                                    right={2}
                                />

                            </Flex>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handelCreatePost} isLoading={loading}>
                            post
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreatePost
