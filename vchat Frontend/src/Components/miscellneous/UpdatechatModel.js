import React from 'react'
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,Box, Spinner } from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { useContext } from 'react'
import { ChatContext } from '../../Context/Chatprovider'
import { FormControl, Input } from '@chakra-ui/react'
import UserListItem from './UserItemList'
import UserBadgeItem from './Userbadge'
import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { useEffect } from 'react'
import { getSender } from '../../config/chatlogics'
import { getSenderfull } from '../../config/chatlogics'


const UpdatechatModel = (props) => {

  const { isOpen, onOpen, onClose } = useDisclosure();

  const{selectedchat,setselectedchat,user}=useContext(ChatContext)

  const {fetchagain,setfetchagain}=props

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchresult, setSearchresult] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedusers, setSelectedusers] = useState([]);
  const [renameloading, setrenameloading] = useState(false);

  const Toast = useToast();
  
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
  }


  const handleLeave = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/chats/leavefromgroup`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.authtoken}`,
          },
          body: JSON.stringify({
            chatId: selectedchat._id,
            userId: user._id,
          }),
        }
      );
      const data = await res.json();
      console.log(data);
      setselectedchat("");
      setfetchagain(!fetchagain);
      Toast({
        title: "Left Group",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      console.log(err);
      Toast({
        title: "Error",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      onClose();
    }

  }

  const handleRename = async () => {
    if (groupName === "") {
      return;
    }
    setrenameloading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/chats/rename`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.authtoken}`,
          },
          body: JSON.stringify({
            chatname: groupName,
            chatId: selectedchat._id,
          }),
        }
      );
      const data = await res.json();
      // console.log(data);
      setselectedchat(data);
      setfetchagain(!fetchagain);
      
      Toast({
        title: "Group Name Updated",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setrenameloading(false);
      onClose();
    } catch (err) {
      console.log(err);
      Toast({
        title: "Error",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setrenameloading(false);
      onClose();  
    }
  }

  const handleGroup = async (user1) => {
    if(user._id!==selectedchat.groupadmin._id){
      Toast({
        title: "Only admin can add users",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if(selectedchat.users.find((u)=>u._id===user1._id)){
      Toast({
        title: "User already in group",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    try{
      setLoading(true);
      const res=await fetch(`http://localhost:5000/api/chats/addtogroup`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${user.authtoken}`,
        },
        body:JSON.stringify({
          chatId:selectedchat._id,
          userId:user1._id,
        }),
      });
      const data=await res.json();
      // console.log(data);
      setselectedchat(data);
      setfetchagain(!fetchagain);
      Toast({
        title: "User Added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setLoading(false);
    }
    catch(err){
      console.log(err);
      Toast({
        title: "Error",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setLoading(false);
    }

  }

  const handledelete = async (user1) => {
    if(user1._id===user._id){
      Toast({
        title: "Press Leave Group to leave",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if(user._id!==selectedchat.groupadmin._id){
      Toast({
        title: "Only admin can Remove users",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if(selectedchat.users.length===3){
      Toast({
        title: "Group must have atleast 3 members",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    try{
      const res=await fetch(`http://localhost:5000/api/chats/removefromgroup`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${user.authtoken}`,
        },
        body:JSON.stringify({
          chatId:selectedchat._id,
          userId:user1._id,
        }),
      });
      const data=await res.json();
      // console.log(data);
      setselectedchat(data);
      setfetchagain(!fetchagain);
      Toast({
        title: "User Removed",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

    } catch(err){
      console.log(err);
      Toast({
        title: "Error",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    // console.log(selectedchat);
    if (selectedchat.isgroupchat) {
      setGroupName(selectedchat.chatname);
      setSelectedusers(selectedchat.users);
    }
  }, [selectedchat]);

  return (
    <>
      <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedchat.chatname}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
          {
              selectedusers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handledelete(user)}
                />
              ))
            }
            </Box>
            <FormControl display="flex"
            >
              <Input
                placeholder="Group Name"
                mb={3}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            <Button 
            variant="solid"
            colorScheme="teal"
            ml={1}
            isLoading={renameloading}
            onClick={handleRename}
            >
              Update
            </Button>
              </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                value={search}
                onChange={(e) => searchusers(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg"/>
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
            <Button colorScheme='red' mr={3} onClick={handleLeave}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdatechatModel