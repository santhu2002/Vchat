import React,{useContext,useEffect} from "react";
import { ChatContext } from "../Context/Chatprovider";
import {
  Container,
  Box,
  Text,
  Tab,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import Login from "./Authentication/Login";
import SignUp from "./Authentication/Signup";

const Home = () => {
  const history = useHistory();
  const { user } = useContext(ChatContext);

  useEffect(() => {
    // console.log(user);
    if (user) {
      history.push("/chats");
    }
  }, [ history, user]);

  return (
    <>
      <Container maxW="xl" centerContent>
        <Box
          bg="White"
          borderWidth="1px"
          borderRadius="lg"
          p="6"
          w="100%"
          m="40px 0 15px 0"
          display="flex"
          justifyContent="center"
          boxShadow="lg"
        >
          <Text fontSize="2xl" fontFamily="Work Sans" >
            Welcome to Vchat
          </Text>
        </Box>
        <Box bg="White" borderWidth="1px" borderRadius="lg" p="6" w="100%" boxShadow="lg">
          <Tabs variant="soft-rounded" colorScheme="orange">
            <TabList>
              <Tab w="50%">Login</Tab>
              <Tab w="50%">Sign Up</Tab>
            </TabList>
            <TabPanels >
              <TabPanel>
                <Login/>
              </TabPanel>
              <TabPanel>
                <SignUp/>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};

export default Home;
