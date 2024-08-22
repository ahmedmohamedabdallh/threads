import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import Joi from "joi";

const LoginCard = () => {
    const [showPassword, setShowPassword] = useState(false);
   const setAuthScreen = useSetRecoilState(authScreenAtom);
   const setUser = useSetRecoilState(userAtom);
   const showToast = useShowToast();
   const[erorr,seterorr]=useState('')
   const[erorrlist,seterorrlist]=useState([])
   const[islogin,setislogin]=useState(false)
   const[inputs,setInputs]=useState({
    username:"",
    password:""
   })
   const handelLogin=async()=>{
    setislogin(true)
    try {
        const res=await fetch("/api/users/login",{
            method:"POST",
            headers:{
               "Content-Type": "application/json"
            },
            body:JSON.stringify(inputs)
        })
        const data= await res.json();
        console.log(data);
        if(data.error){
            showToast("Error", data.error, "error");
            seterorr(data.error)
            setislogin(false)
            return;
        }
        
        
        localStorage.setItem("user-threads",JSON.stringify(data));
        setUser(data);
        
    } catch (error) {
        showToast("Error", error, "error");
    }finally{
        setislogin(false)
    }
   }
   function submitForm(e) {
    setislogin(true)
    e.preventDefault();
    let validation=validateRegaster()
    if(validation.error){
      setislogin(false)
      seterorrlist(validation.error.details)
    }else{
        handelLogin();
    }
    
    
  }
   function validateRegaster() {
   let schema= Joi.object({
    password:Joi.string().regex(/^[A-Za-z0-9!@#$%&*.]{7,}$/).required(),
   username:Joi.string().min(3).max(18).required(),
    });
  return  schema.validate(inputs,{abortEarly:false})
  }
    return (
        <Flex align={"center"} justify={"center"}>
            <Stack  spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"} textAlign={"center"}>
                       Login
                    </Heading>
                </Stack>
                {erorrlist.map((err,index)=>{
          if (err.context.label === 'password') {
            return (
                <Alert key={index}  status='error'><AlertIcon/> 
                <AlertTitle>password invalid </AlertTitle>
                <AlertDescription>At least one capital letter and a specialChar</AlertDescription>
                </Alert>
            )
          }
          else{
            return <Alert key={index}  status='error'><AlertIcon />{err.message}</Alert>
          }
        })}
          {erorr.length>0?<Alert status='error'><AlertIcon />{erorr}</Alert>:''}
              <form onSubmit={submitForm}>
              <Box rounded={"lg"} bg={useColorModeValue("white", "gray.dark")} boxShadow={"lg"} p={8}
                w={{
                    base:'full',
                    sm:'400px'
                }}
                >
                    <Stack spacing={4}>
            
                        <FormControl isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input
                                type='text'
                                onChange={(e)=>setInputs({...inputs,username:e.target.value})}
                                value={inputs.username}
                                />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    onChange={(e)=>setInputs({...inputs,password:e.target.value})}
                                    value={inputs.password}
                                    />
                                <InputRightElement h={"full"}>
                                    <Button
                                        variant={"ghost"}
                                        onClick={() => setShowPassword((showPassword) => !showPassword)}
                                    >
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                            type="submit"
                                loadingText='Loging in'
                                size='lg'
                                bg={useColorModeValue("gray.600", "gray.700")}
                                color={"white"}
                                _hover={{
                                    bg: useColorModeValue("gray.700", "gray.800"),
                                }}
                            >
                                 { islogin==true?<i className='fas fa-spinner fa-spin'></i>:'Login'}
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={"center"}>
                                Don&apos;t Have an account?{" "}
                                <Link color={"blue.400"} onClick={() => setAuthScreen("singup")}>
                                    Sing Up
                                </Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
              </form>
            </Stack>
        </Flex>
    );
    }

export default LoginCard
