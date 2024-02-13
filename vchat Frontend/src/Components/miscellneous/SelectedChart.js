import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { ChatContext } from "../../Context/Chatprovider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender } from "../../config/chatlogics";
import ProfileModel from "./ProfileModel";
import { getSenderfull } from "../../config/chatlogics";
import UpdatechatModel from "./UpdatechatModel";
import { useToast } from "@chakra-ui/react";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import { io } from "socket.io-client";
const endpoint = "http://localhost:5000";
var socket, selectedchatCompare;

const SelectedChart = (props) => {
  const { fetchagain, setfetchagain } = props;
  const {
    selectedchat,
    setselectedchat,
    user,
    Notifications,
    setNotifications,
  } = useContext(ChatContext);

  const [messages, setmessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [newmessage, setnewmessage] = useState("");
  const [socketConnection, setSocketConnection] = useState(false);

  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const Toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require("../../animations/typing.json"),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket = io(endpoint);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnection(true);
      console.log("connected");
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

  const fetchmessages = async () => {
    if (!selectedchat) return;
    setloading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/message/${selectedchat._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.authtoken}`,
          },
        }
      );
      const data = await res.json();
      // console.log(data);
      setmessages(data.messages);
      setloading(false);
      if (socketConnection) {
        socket.emit("join chat", selectedchat);
        console.log("joined chat");
      }
    } catch (err) {
      Toast({
        title: "Error Occured",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.log(err);
    }
  };

  useEffect(() => {
    if (selectedchat) {
      selectedchatCompare = selectedchat;
      fetchmessages();
    }
    // eslint-disable-next-line
  }, [selectedchat]);

  // console.log(Notifications,"............");

  useEffect(() => {
    socket.on("message received", (newMessagerecieved) => {
      // console.log(selectedchat._id, newMessagerecieved.chat._id);
      if (
        !selectedchatCompare ||
        selectedchatCompare._id !== newMessagerecieved.chat._id
      ) {
        if (!Notifications.includes(newMessagerecieved)) {
          setNotifications([...Notifications, newMessagerecieved]);
          setfetchagain(!fetchagain);
        }
      } else {
        console.log(newMessagerecieved, 1);
        setmessages((prev) => [...prev, newMessagerecieved]);
      }
    });
    return () => {
      socket.off("message received");
    };
  }, [socketConnection]);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newmessage !== "") {
      socket.emit("stop typing", selectedchat._id);
      try {
        const res = await fetch(`http://localhost:5000/api/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.authtoken}`,
          },
          body: JSON.stringify({
            chatId: selectedchat._id,
            message: newmessage,
          }),
        });
        const data = await res.json();
        console.log(data);
        setnewmessage("");
        socket.emit("new message", data.newmessage);
        setmessages([...messages, data.newmessage]);
      } catch (err) {
        Toast({
          title: "Error Occured",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        console.log(err);
      }
    }
  };
  const typingHandler = (e) => {
    setnewmessage(e.target.value);

    if (!socketConnection) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedchat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedchat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedchat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setselectedchat("")}
            ></IconButton>
            {!selectedchat.isgroupchat ? (
              <>
                {getSender(user, selectedchat.users).toUpperCase()}
                <ProfileModel user={getSenderfull(user, selectedchat.users)} />
              </>
            ) : (
              <>
                {selectedchat.chatname.toUpperCase()}
                <UpdatechatModel
                  fetchagain={fetchagain}
                  setfetchagain={setfetchagain}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner alignSelf="center" size="xl" margin="auto" />
            ) : (
              <ScrollableChat messages={messages} />
            )}

            <FormControl isRequired mt="3" onKeyDown={sendMessage}>
              {istyping ? (
                <div
                  style={{
                    marginBottom: "15px",
                    marginLeft: "0px",
                    width: "50px",
                  }}
                >
                  <Lottie options={defaultOptions} height={50} width={50} />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newmessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SelectedChart;
