import { Box, Autocomplete, TextField, 
    ListItemText, List, ListItem, Divider } from '@mui/material';
import React, { useEffect } from 'react';
import configData from '../../config.json';

function ConversationPanel({setConversationMessages}) {
    const [chats, setChats] = React.useState([]);
    const [selectedChat, setSelectedChat] = React.useState("");

    const fetchConversationHistory = (chat) => {
        sessionStorage.currentChat = chat['id'];
        setSelectedChat(chat['id']);

        // Get message history from backend, then save it in state
        let headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');
        headers.set('x-access-token', sessionStorage.token);
        
        fetch(configData.HOSTNAME + ':5000/chat/' + chat['id'], {
        headers: headers,
        method: 'GET',
        }).then((response) => 
        {
            //console.log(response.text());
            return response.json();
        })
        .then((response) => {
            // console.log("response text:");
            // console.log(response);
            if (response) {
                setConversationMessages(response['messages']); // probably need to edit this, i dont know the shape of the data
                return response;
            } else {
                console.log("error fetching message history");
            }
        });
    }
    
    useEffect(() => {
        //let chatroomList = []
        // console.log(chats);
        let headers = new Headers();
        //headers.set('Content-Type', 'application/json');
        //headers.set('Accept', 'application/json');
        headers.set('x-access-token', sessionStorage.token);
        
        fetch(configData.HOSTNAME + ":5000/chat", {
        headers: headers,
        method: 'GET',
        }).then((response) => response.json())
        .then((response) => {
            if (response) {
                let chatroomList = response["chatrooms"];

                let displayChatroom = []
                //// console.log("chatroomList:");
                //// console.log(chatroomList);
                for (let i = 0; i < chatroomList.length; i++) {
                    let chatroom = chatroomList[i];
                    //// console.log(chatroom)
                    if (chatroom["users"].includes(sessionStorage.Username)) {
                        displayChatroom.push({"label": chatroom["name"], "id": chatroom["public_id"]});
                    }
                }
                //// console.log("chats:");
                //// console.log(chats);
                if (JSON.stringify(chats) != JSON.stringify(displayChatroom)) {
                    setChats(displayChatroom);
                    // console.log("chats:");
                    //// console.log(chats);
                }

                // Set chat to general chat if nothing is currently selected
                if (!sessionStorage.currentChat) {
                    fetchConversationHistory(displayChatroom[0]);
                }

                return response["chatrooms"];
            } else {
                // console.log("couldn't fetch chatrooms");
            }
        })
        .catch((error) => {
            // console.log(error);
        });
    });

    return(
        <Box sx={{
            flexDirection: 'column',
            display: 'flex',
            '& > *': { 
                m: 1,}, 
        }}>
        <List data-testid="selectAChat">
            {
                chats.map((chat) => {
                    return (
                        <ListItem button divider
                         onClick={() => fetchConversationHistory(chat)}
                         selected={chat.id == selectedChat}
                         key={chat.id}
                         data-testid="chatListItem">
                            <ListItemText primary={chat.label} />
                        </ListItem>
                    )
                })
            }
        </List>
        </Box>
    )
}

export default ConversationPanel;