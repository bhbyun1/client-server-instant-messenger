import { Box, ButtonGroup, Button } from "@mui/material";
import React from "react";
import styles from '../../styles.module.css';
import createMuiTheme from "@mui/material/styles";

export class ConversationPanel extends React.Component {
    constructor() {
        super();
        this.conversations = [
            <Button key="0">Select a Conversation:</Button>,
            <Button key="1">Adam</Button>,
            <Button key="2">Bob</Button>,
            <Button key="3">Claire</Button>,
          ];
    }

    render() {
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
                    {this.conversations}
                </ButtonGroup>
            </Box>
        )
    }
};

export default ConversationPanel;