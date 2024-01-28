import {createContext, useEffect, useState} from 'react';  
import { useHistory } from 'react-router-dom';

export const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [chats, setChats] = useState([]);
    const [user, setUser] = useState(null);
    const [selectedchat, setselectedchat] = useState(null);


    const history = useHistory();

    useEffect(() => {
        if(localStorage.getItem('userinfo')){
            setUser(JSON.parse(localStorage.getItem('userinfo')));
        }
        else{
            if (history) {
                history.push('/');
            }
        }
    },[history])

    return (
        <ChatContext.Provider value={{chats, setChats, user, setUser, selectedchat,setselectedchat}}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider;