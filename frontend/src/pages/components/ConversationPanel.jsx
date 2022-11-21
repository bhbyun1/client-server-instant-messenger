import { Box, Autocomplete, TextField, 
    ListItemText, List, ListItem, Divider } from '@mui/material';
import React, { useEffect } from 'react';
import configData from '../../config.json';

function ConversationPanel({setConversationMessages}) {
    const [chats, setChats] = React.useState([]);
    // const mockData = {"Adam": [{'username': 'Adam', 'message': 'I\'m Adam'}],
    //                   "     ": [{'username': 'Bob', 'message': 'I\'m Bob'}],
    //                   "Claire": [{'username': 'Claire', 'message': 'I\'m Claire'}]};
    const [messages, setMessages] = React.useState([]);

    const handleAutocomplete = (event, value) => {
        // setUsers(value);
        // fetch endpoint for <id> chat history
        //setMessages(mockData[value]);
        sessionStorage.currentChat = value['id'];
        console.log("handling autocomplete");
        
        //console.log(event);
        console.log(value);
        console.log("value");

        // call fetch chatid history api here instead of the above setmessages, using value["id"]

        let headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');
        headers.set('x-access-token', sessionStorage.token);
        
        fetch(configData.HOSTNAME + ':5000/chat/' + value["id"], {
        headers: headers,
        method: 'GET',
        }).then((response) => 
        {
            //console.log(response.text());
            return response.json();
        })
        .then((response) => {
            console.log("response text:");
            console.log(response);
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
                //console.log("chatroomList:");
                //console.log(chatroomList);
                for (let i = 0; i < chatroomList.length; i++) {
                    let chatroom = chatroomList[i];
                    //console.log(chatroom)
                    if (chatroom["users"].includes(sessionStorage.Username)) {
                        displayChatroom.push({"label": chatroom["name"], "id": chatroom["public_id"]});
                    }
                }
                //console.log("chats:");
                //console.log(chats);
                if (JSON.stringify(chats) != JSON.stringify(displayChatroom)) {
                    setChats(displayChatroom);
                    //console.log("chats:");
                    //console.log(chats);
                }
                if (!sessionStorage.currentChat) {
                    handleAutocomplete(null, displayChatroom[0]);
                }

                return response["chatrooms"];
            } else {
                console.log("couldn't fetch chatrooms");
            }
        });
        //let chatroomList = response['chatrooms'];

        //let chatroomList = accurateMockData["chatrooms"];
    });

    const handleAutocomplete = (event, value) => {
        // setUsers(value);
        // fetch endpoint for <id> chat history
        //setMessages(mockData[value]);
        sessionStorage.currentChat = value['id'];
        console.log("handling autocomplete");
        
        //console.log(event);
        console.log(value);
        console.log("value");

        // call fetch chatid history api here instead of the above setmessages, using value["id"]

        let headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');
        headers.set('x-access-token', sessionStorage.token);
        
        fetch(configData.HOSTNAME + ":5000/chat/" + value["id"], {
        headers: headers,
        method: 'GET',
        }).then((response) => 
        {
            //console.log(response.text());
            return response.json();
        })
        .then((response) => {
            console.log("response text:");
            console.log(response);
            if (response) {
                setConversationMessages(response['messages']); // probably need to edit this, i dont know the shape of the data
                return response;
            } else {
                console.log("error fetching message history");
            }
        });
    }

    const handleChatSelect = (chat) => {
        sessionStorage.currentChat = chat['id'];

        // call fetch chatid history api here instead of the above setmessages, using value["id"]

        let headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');
        headers.set('x-access-token', sessionStorage.token);
        
        fetch(configData.HOSTNAME + ":5000/chat/" + chat["id"], {
        headers: headers,
        method: 'GET',
        }).then((response) => 
        {
            //console.log(response.text());
            return response.json();
        })
        .then((response) => {
            console.log("response text:");
            console.log(response);
            if (response) {
                setConversationMessages(response['messages']); // probably need to edit this, i dont know the shape of the data
                return response;
            } else {
                console.log("error fetching message history");
            }
        });
    }

    return(
        <Box sx={{
            flexDirection: 'column',
            display: 'flex',
            '& > *': { 
                m: 1,}, 
        }}>
            <Autocomplete
                options={chats}
                fullWidth
                onChange={handleAutocomplete}
                renderInput={(params) => <TextField {...params} variant="filled" label="Chats"/>}
            />
        <List>
            {
                chats.map((chat) => {
                    console.log(chat)
                    return (
                        <ListItem button divider onClick={() => handleChatSelect(chat)}>
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