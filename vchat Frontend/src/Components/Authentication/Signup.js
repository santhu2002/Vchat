import React from "react";
import {
  FormControl,
  VStack,
  FormLabel,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  useToast
} from "@chakra-ui/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const postDetails = (pic) => {
    setLoading(true);
    if(pic===undefined){
      return toast({
        title: "Please Select an Image",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    if(pic.type==="image/jpeg" || pic.type==="image/png"){
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "vchatapp");
      data.append("cloud_name", "dcs5vadlv");
      fetch("https://api.cloudinary.com/v1_1/dcs5vadlv/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }else{
      setLoading(false);
      return toast({
        title: "Please Select an Image",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }


  };

  const submitHandler = async() => {

    setLoading(true);
    if(!username || !email || !password || !confirmPassword){
      setLoading(false);
      return toast({
        title: "Please fill all the fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else if(password!==confirmPassword){
      setLoading(false);
      return toast({
        title: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }  
     try{
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "name":username,
          email,
          password,
          ...(pic ? { profilePic: pic } : {}),
        }),
      });
      const data = await res.json();
      if (data.error) {
        setLoading(false);
        toast({
          title: data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        setLoading(false);
        toast({
          title: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      localStorage.setItem("token", data.authtoken);
      history.push("/chats");
      
    }catch(err){
      setLoading(false);
      toast({
        title: "Internal Server Error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log(err);
    }
    
  };

  return (
    <>
      <VStack spacing={4}>
        <FormControl id="username" isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="Enter Username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </FormControl>
        <FormControl id="password" isRequired>
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
        <FormControl id="confirmPassword" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              placeholder="Enter ConfirmPassword"
              type={show ? "text" : "password"}
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
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
        <FormControl id="Pic">
            <FormLabel>Profile Picture</FormLabel>
            <Input type="file"
                accept="image/*"
                onChange={(e)=>postDetails(e.target.files[0])}
                p="4px"
             />
        </FormControl>
        <Button colorScheme="blue" w="100%" size="lg" onClick={submitHandler} isLoading={loading}>
          Create Account
        </Button>
      </VStack>
    </>
  );
};

export default Signup;
