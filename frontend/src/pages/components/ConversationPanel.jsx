import { Box, ButtonGroup, Button, Typography, Autocomplete, TextField } from "@mui/material";
import React from "react";
import styles from '../../styles.module.css';
import createMuiTheme from "@mui/material/styles";
import { useState, useEffect } from 'react'

function ConversationPanel({setMessages}) {
    const [users, setUsers] = React.useState([]);
    const mockData = {"Adam": [{'username': 'Adam', 'message': 'I\'m Adam'}],
                      "     ": [{'username': 'Bob', 'message': 'I\'m Bob'}],
                      "Claire": [{'username': 'Claire', 'message': 'I\'m Claire'}]};
    const accurateMockData = {
        "chatrooms": [
            {
                "id": 1,
                "name": "general",
                "owner": "admin",
                "users": [
                    "Johnny",
                    "Luke",
                    "Ken"
                ]
            },
            {
                "id": 2,
                "name": "business chat",
                "owner": "admin2",
                "users": [
                    "Johnny",
                    "Luke",
                    "Joshua",
                    "Ezekiel",
                    "Ken"
                ]
            },
            {
                "id": 3,
                "name": "chat for johnny and luke",
                "owner": "Johnny",
                "users": [
                    "Johnny",
                    "Luke"
                ]
            }
        ]
    }
    // replace this mock data with a fetch, probably in useeffect

    useEffect(() => {
        let chatroomList = accurateMockData["chatrooms"];
        let displayChatroom = []
        for (let i = 0; i < chatroomList.length; i++) {
            let chatroom = chatroomList[i];
            if (chatroom["users"].includes(sessionStorage.Username)) {
                displayChatroom.push({"label": chatroom["name"], "id": chatroom["id"]});
            }
        }
        if (JSON.stringify(users) != JSON.stringify(displayChatroom)) {
            setUsers(displayChatroom);
        }
    });

    const autocompleteOnChange = (event, value) => {
        // setUsers(value);
        // fetch endpoint for <id> chat history
        // setMessages(mockData[value]);

        setMessages([{"username": "Johnny", "message": "hey im johnny"}]);
        // call fetch chatid history api here instead of the above setmessages, using value["id"]
        console.log("adhiud");
        console.log(value);
        console.log(value["id"]);
        console.log(value["label"])
    }
    
    // const autocompleteOnInputChange = (event, value) => {
    //     console.log('94949219aaaa')
    //     console.log(value);
    // }

    return(
        <Box sx={{
            flexDirection: 'column',
            display: 'flex',
            '& > *': { 
                m: 1,}, 
        }}>
            <Typography>
                Select a User
            </Typography>
            <Autocomplete
                options={users}
                sx={{ width: 300 }}
                onChange={autocompleteOnChange}
                // onInputChange={autocompleteOnInputChange}
                renderInput={(params) => <TextField {...params} variant="filled" label="Users"/>}
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