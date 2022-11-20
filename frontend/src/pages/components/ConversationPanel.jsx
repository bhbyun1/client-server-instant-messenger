import { Box, ButtonGroup, Button, Typography, Autocomplete, TextField } from "@mui/material";
import React, {useEffect,useMemo} from "react";
import styles from '../../styles.module.css';
import createMuiTheme from "@mui/material/styles";
import { useState } from 'react'

function ConversationPanel({setConversationMessages}) {
    const [chats, setChats] = React.useState([]);
    // const mockData = {"Adam": [{'username': 'Adam', 'message': 'I\'m Adam'}],
    //                   "     ": [{'username': 'Bob', 'message': 'I\'m Bob'}],
    //                   "Claire": [{'username': 'Claire', 'message': 'I\'m Claire'}]};
    const [messages, setMessages] = React.useState([]);
    // Endpoint for <id> chat
    // Endpoint for all chat name
    
    
    useEffect(() => {
        //let chatroomList = []
        let headers = new Headers();
        //headers.set('Content-Type', 'application/json');
        //headers.set('Accept', 'application/json');
        headers.set('x-access-token', sessionStorage.token);
        
        fetch('http://localhost:5000/chat', {
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
        
        fetch('http://localhost:5000/chat/' + value["id"], {
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
            <Typography>
                Select a Chat
            </Typography>
            <Autocomplete
                    options={chats}
                    sx={{ width: 300 }}
                    onChange={handleAutocomplete}
                    renderInput={(params) => <TextField {...params} variant="filled" label="Chats"/>}
                />
            {/* <ButtonGroup
            orientation="vertical"
            aria-label="vertical outlined button group"
            >
                <Typography sx={{textAlign: "center", width: "125%", marginBottom: "15px"}}>select a conversation</Typography>
                <Button sx={{width: "125%"}} key="General">General</Button>
                {users.map((user) =>
                    <Button sx={{width: "125%"}} key={user}>{user}</Button>
                )}
            </ButtonGroup> */}
        </Box>
    )
}

// export class ConversationPanel extends React.Component {
//     constructor() {
//         const [users, setUsers] = React.useState(["Adam", "Bob", "Claire"]);

//         super();
//         // this.conversations = [
//         //     <Button disabled key="0">Select a Conversation:</Button>,
//         //     <Button key="1">Adam</Button>,
//         //     <Button key="2">Bob</Button>,
//         //     <Button key="3">Claire</Button>,
//         //   ];
//         this.conversations = users.map((user) =>
//             <Button>{user}</Button>
//         )
//     }

//     render() {
//         return(
//             <Box sx={{
//                 display: 'flex',
//                 '& > *': { 
//                     m: 1,}, 
//             }}>
//                 <ButtonGroup
//                 orientation="vertical"
//                 aria-label="vertical outlined button group"
//                 >
//                     seelc a user
//                     {this.conversations}
//                 </ButtonGroup>
//             </Box>
//         )
//     }
// };

export default ConversationPanel;