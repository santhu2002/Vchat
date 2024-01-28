import { Tooltip, Box, Button,Text, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider, Drawer, Input, Spinner } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import ProfileModel from "./ProfileModel";
import { useContext } from "react";
import { ChatContext } from "../../Context/Chatprovider";
import { useDisclosure } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody } from "@chakra-ui/react";
import Chatloading from "./Chatloading";
import UserListItem from "./UserItemList";





export const Sidebar = () => {
  const [searchresult, setSearchresult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [loadingchat, setLoadingchat] = useState(false);

  const { user ,setUser,setselectedchat,chats,setChats} = useContext(ChatContext);
  const {isOpen, onOpen, onClose} = useDisclosure();

  const Toast = useToast();


  const logout = () => {
    setUser(null);
    localStorage.removeItem("userinfo");
  }

  const acceschat = async (id) => {

    setLoadingchat(true);
    // console.log(id,user.authtoken)
    try {
      const res = await fetch(`http://localhost:5000/api/chats/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.authtoken}`,
        },
        body: JSON.stringify({ userId: id }), 
      });
      const data = await res.json();
      if(!chats.find((chat)=>chat._id===data._id)){
        setChats([...chats,data]);
      }
      // console.log(data);
      setLoadingchat(false);
      setselectedchat(data)
      onClose();
    } catch (err) {
      console.log(err);
      Toast({
        title: "Error",
        status: "error",
        duration: 2000,
        isClosable: true,
      })
      setLoadingchat(false);
    } 
  }

  const searchuser = async (search) => {
    if(search===""){
      Toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: 'top-left',
      });
      setSearchresult([]);
      return;
    }
    setLoading(true);
    // console.log(user);
    // const userparsed=JSON.parse(user);
    try {
      const res = await fetch(`http://localhost:5000/api/auth?search=${search}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.authtoken}`,
        },
      });
      const data = await res.json();
      // console.log(data);
      setLoading(false);
      setSearchresult(data);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };


  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search the user" hasArrow placement="bottom-end">
          <Button bg="white" onClick={onOpen}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <Text display={{base:"none",md:"flex"} } px="4">Search User</Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work Sans">Vchat</Text>
        <div>

        <Menu>
          <MenuButton p={1}>
          <BellIcon fontSize="2xl"  m={1}/>
            </MenuButton>
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} p={1}> 
          <Avatar name={user.name} src={user.pic} size="sm" />
          </MenuButton>
          <MenuList>
            <ProfileModel user={user}>
            <MenuItem>Profile</MenuItem>
            </ProfileModel>
            <MenuDivider />
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuList>
          </Menu>

        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>
          <DrawerBody>
            <Box display="flex">
              <Input
                placeholder="Search by name or email"
                p={2}
                marginRight={2}
                value={search}
                onChange={(e) => {setSearch(e.target.value)}}
              ></Input>
              <Button onClick={() => searchuser(search)} >
                Search
              </Button>
            </Box>
            {loading ? <Chatloading/> : 
            searchresult.map((user) => (
               <UserListItem user={user} key={user._id} handleFunction={()=>{acceschat(user._id)}}/>
            ))}
            {loadingchat ? <Spinner ml="auto" display="flex"/> : null}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default Sidebar;
