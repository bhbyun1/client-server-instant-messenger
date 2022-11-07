import { Box, ButtonGroup, Button, Typography } from "@mui/material";
import React from "react";
import styles from '../../styles.module.css';
import createMuiTheme from "@mui/material/styles";
import { useState } from 'react'

function ConversationPanel() {
    const [users, setUsers] = React.useState(["Adam", "Bob", "Claire"]);

    return(
        <Box sx={{
            display: 'flex',
            '& > *': { 
                m: 1,}, 
        }}>
            <ButtonGroup
            orientation="vertical"
            aria-label="vertical outlined button group"
            >
                <Typography sx={{textAlign: "center", width: "125%", marginBottom: "15px"}}>select a conversation</Typography>
                <Button sx={{width: "125%"}} key="General">General</Button>
                {users.map((user) =>
                    <Button sx={{width: "125%"}} key={user}>{user}</Button>
                )}
            </ButtonGroup>
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