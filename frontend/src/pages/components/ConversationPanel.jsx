import { Box, ButtonGroup, Button, Typography, Autocomplete, TextField } from "@mui/material";
import React from "react";
import styles from '../../styles.module.css';
import createMuiTheme from "@mui/material/styles";
import { useState } from 'react'

function ConversationPanel({setMessages}) {
    const [users, setUsers] = React.useState(["Adam", "Bob", "Claire"]);
    const mockData = {"Adam": [{'username': 'Adam', 'message': 'I\'m Adam'}],
                      "     ": [{'username': 'Bob', 'message': 'I\'m Bob'}],
                      "Claire": [{'username': 'Claire', 'message': 'I\'m Claire'}]};
    // Endpoint for <id> chat
    // Endpoint for all chat name

    const handleAutocomplete = (event, value) => {
        // setUsers(value);
        // fetch endpoint for <id> chat history
        setMessages(mockData[value]);
        console.log(value);
    }

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
                    onChange={handleAutocomplete}
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