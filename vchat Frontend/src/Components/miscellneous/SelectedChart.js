import React from 'react'
import { useContext } from 'react'
import { ChatContext } from '../../Context/Chatprovider'
import { Box, IconButton, Text } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender } from '../../config/chatlogics'
import ProfileModel from './ProfileModel'
import { getSenderfull } from '../../config/chatlogics'
import UpdatechatModel from './UpdatechatModel';


const SelectedChart = (props) => {
   const  {fetchagain,setfetchagain}=props
   const {selectedchat,setselectedchat,user} = useContext(ChatContext)
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
            >
            </IconButton>
            {!selectedchat.isgroupchat ? (
                <>
                {getSender(user,selectedchat.users).toUpperCase()}
                <ProfileModel user={getSenderfull(user,selectedchat.users)} />
                </>
            ):(
                <>
                {selectedchat.chatname.toUpperCase()}
                <UpdatechatModel fetchagain={fetchagain} setfetchagain={setfetchagain}/>
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
         overflowY="hidden">

         </Box>
         </>
    ):(
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>)
    }
  </>
  )
}

export default SelectedChart