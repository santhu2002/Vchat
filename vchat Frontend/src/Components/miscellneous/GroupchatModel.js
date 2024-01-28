import React, { useState } from "react";
import { Button, FormControl, useDisclosure, useToast } from "@chakra-ui/react";
import { ChatContext } from "../../Context/Chatprovider";
import { useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
} from "@chakra-ui/react";
import UserListItem from "./UserItemList";
import UserBadgeItem from "./Userbadge";

const GroupchatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchresult, setSearchresult] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedusers, setSelectedusers] = useState([]);

  const Toast = useToast();

  const { user, setChats } = useContext(ChatContext);

  const searchusers = async (query) => {
    setSearch(query);
    if (query === "") {
      setSearchresult([]);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/auth?search=${query}`,
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
      setLoading(false);
      setSearchresult(data);
    } catch (err) {
      console.log(err);
      setLoading(false);
      Toast({
        title: "Error",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handlesubmit = async () => {
    if(groupName === "" || selectedusers.length <2){
      Toast({
        title: "Please fill all the fields",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/chats/group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.authtoken}`,
        },
        body: JSON.stringify({
          groupname: groupName,
          groupusers: JSON.stringify(selectedusers.map((u) => u._id)),
        }),
      });
      const data = await res.json();
      console.log(data);
      setChats((prev) => [...prev, data]);
      onClose();
      setGroupName("");
      setSelectedusers([]);
      setSearch("");
      setSearchresult([]);
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

  const handleGroup = (user) => {
    if (selectedusers.find((u) => u._id === user._id)) {
      setSelectedusers(selectedusers.filter((u) => u._id !== user._id));
    } else {
      setSelectedusers([...selectedusers, user]);
    }
    // console.log(selectedusers);
  }

  const handledelete = (user) => {
    setSelectedusers(selectedusers.filter((u) => u._id !== user._id));
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Group Name"
                mb={3}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                value={search}
                onChange={(e) => searchusers(e.target.value)}
              />
            </FormControl>
            {
              selectedusers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handledelete(user)}
                />
              ))
            }

            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchresult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlesubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupchatModel;
