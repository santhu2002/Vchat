import React from 'react'
import {
  FormControl,
  VStack,
  FormLabel,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";

import { useState,useContext } from "react";
import { useHistory } from "react-router-dom";
import { ChatContext } from '../../Context/Chatprovider';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false); 
  const Toast = useToast();

  const {setUser}=useContext(ChatContext);


  const history = useHistory();
  const submitHandler = async() => {
    setLoading(true);

    if(email === "" || password === ""){
      Toast({
        title: "Please fill all the fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    try{
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email,password}),
      });
      const data = await res.json();
      console.log(data);
      if (data.authtoken) {
        localStorage.setItem("userinfo", JSON.stringify(data));
        Toast({
          title: "Logged in successfully",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
        setLoading(false);
        setUser(data);
        history.push("/chats")
      } else {
        Toast({
          title: data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      }
    }
    catch(err){
      console.log(err);
      Toast({
        title: "Internal Server Error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);

    }
  };
  return (
    
    <>
      <VStack spacing={4}>
        
        <FormControl id="emaillogin" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </FormControl>
        <FormControl id="passwordlogin" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              placeholder="Enter Password"
              type={show ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <InputRightElement w="4.5rem">
              <Button
                h="1.75rem"
                bg="white"
                size="sm"
                onClick={() => setShow(!show)}
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button colorScheme="blue" w="100%" size="lg" onClick={submitHandler} isLoading={loading}>
          Login
        </Button>
        </VStack>

    </>
  )
}

export default Login