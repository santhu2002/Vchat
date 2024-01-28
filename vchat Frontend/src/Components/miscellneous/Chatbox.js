import React from 'react'
import { useContext } from 'react'
import { ChatContext } from '../../Context/Chatprovider'
import { Box } from '@chakra-ui/react'
import SelectedChart from './SelectedChart'

const Chatbox = (props) => {
  const {fetchagain,setFetchagain}=props

  const {setselectedchat,selectedchat} = useContext(ChatContext)
  return (
    <Box
    display={{ base: selectedchat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      >
      <SelectedChart fetchagain={fetchagain} setfetchagain={setFetchagain}/>
    </Box>
  )
}

export default Chatbox