import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { ChatContext } from "../../Context/Chatprovider";
import { useToast, Box, Stack, Text } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import GroupChatModal from "./GroupchatModel";
import Chatloading from "./Chatloading";
import { getSender } from "../../config/chatlogics";

const Mychats = (props) => {
  const [loggedinuser, setLoggedinuser] = useState(null);
  const { user, setChats, chats, selectedchat, setselectedchat } =
    useContext(ChatContext);
  const {fetchagain }=props;

  const Toast = useToast();

  const getmychats = async () => {
    // console.log(user);
    try {
      const res = await fetch(`http://localhost:5000/api/chats/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.authtoken}`,
        },
      });
      const data = await res.json();
      // console.log(data);
      setChats(data);
    } catch (err) {
      console.log(err);
      Toast({
        title: "Error",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setLoggedinuser(user);
    getmychats();
  }, [fetchagain]);

  // useEffect(() => {
  //   console.log(selectedchat);
  // }, [selectedchat]);

  return (
    <Box
      display={{ base: selectedchat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "20px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal >
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
          </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="scroll"
      >
      {chats ? (
        <Stack overflow="scroll">
          {chats.map((chat) => (  
            <Box
              onClick={() => setselectedchat(chat)}
                cursor="pointer"
                bg={selectedchat && selectedchat._id === chat._id ? "#38B2AC" : "#E8E8E8"}
                color={selectedchat && selectedchat._id === chat._id ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}>
            <Text >
              {!chat.isgroupchat && loggedinuser ? (getSender(loggedinuser, chat.users)) : (chat.chatname)}
            </Text>
            {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
            </Box>

            ))}
        </Stack>
      ):(
        <Chatloading/>
      )}
      </Box>
    </Box>
  );
};

export default Mychats;
