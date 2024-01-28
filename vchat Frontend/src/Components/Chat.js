import React, { useEffect,useState } from 'react'
import { ChatContext } from "../Context/Chatprovider";
import { useContext } from 'react';
import { Box } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import Sidebar from './miscellneous/Sidebar';
import ChatBox from './miscellneous/Chatbox';
import Mychats from './miscellneous/Mychats';



const Chat = () => {
  const { user } = useContext(ChatContext);
  const history = useHistory();

  const [fetchagain, setFetchagain] = useState(false);
  
  useEffect(() => {
    // console.log(user);
    if (!user) {
      history.push("/");
    }
  }, [user, history]);
  return (
    <div style={{width:"100%"}}>
      {user && <Sidebar/> }
      <Box display="flex" justifyContent="space-between" w='100%' h="91vh" p='10'>
        {user &&  <Mychats fetchagain={fetchagain} />}
        {user && <ChatBox fetchagain={fetchagain} setFetchagain={setFetchagain}/>}
      </Box>
       
    </div>
  )
}

export default Chat