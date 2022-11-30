import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import configData from "../config.json";

//a
function CreateChat(props) {
    // const [visible, setVisible] = useState(false);

    // const handleClose = () => {
    //     visible ? setVisible(false) : setVisible(true);
    // }
    const MAX_CHATNAME_LENGTH = 512;
    const {onClose, selectedValue, open} = props;
    // const {open} = props;
    const [users, setUsers] = useState([]);
    const [chatName, setChatName] = useState("");
    const [chatMembers, setChatMembers] = useState([]);
    const [isChatNameValid, setIsChatNameValid] = useState(true);
    const checkChatName = (text) => {
        return !!text && !/[^a-zA-Z0-9 ():;@#$+,.-]/.test(text) && text.length <= MAX_CHATNAME_LENGTH;
    }
    // const dummyUsers = ["adam", "brandon", "caleb", "donovan", "ethan", "francis"];

    
    useEffect(() => {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('x-access-token', sessionStorage.getItem('token'));
        fetch(configData.HOSTNAME + ":5000/user", {
            headers: headers,
            method: 'GET'
        }).then((response) => {
            if (response.ok) 
                return response.json();
            else 
                throw response
            }
        ).then((response) => {
            if (response.users) {
                let otherUsers = response.users.filter(uname => uname != sessionStorage.Username);
                console.log(otherUsers);
                setUsers(otherUsers);
                return otherUsers;
            }
        }).catch((err) => {
            console.error(`error from ${err}`);
        })
    }, []);

    const handleAutocomplete = (event, value) => {
        //setChatMembers(oldChatMembersList => [...oldChatMembersList, value])
        setChatMembers(value);
    }

    const handleSubmit = (value) => {
        if (!isChatNameValid) {
            return;
        }
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('x-access-token', sessionStorage.getItem('token'));
        fetch(configData.HOSTNAME + ":5000/chat", {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({'name': chatName, 'users': chatMembers})
        }).then(response => {
            if (response.ok) {
                onClose(value);
                return response.json();
            }
            else
                throw response;
        });
    }

    const handleClose = (value) => {
        onClose(value);
    }

    const handleChatName = (event) => {
        setIsChatNameValid(checkChatName(event.target.value));
        if (isChatNameValid) {
            setChatName(event.target.value);
        }
        // console.log("set chat name to "+ event.target.value);
    }
    // a

    return (
        <Dialog open={open} onClose={handleClose} data-testid={'dialog'}>
            <DialogTitle>Create a New Chat</DialogTitle>
            {/* <DialogContent>
                <DialogContentText>
                    Create a chat with the following users, separated by commas.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="User"
                    fullWidth
                    variant="standard"
                />
            </DialogContent> */}
            <br></br>
            <DialogContent data-testid={'dialogcontent'}>
                <TextField
                    label='Chat Name'
                    error={!isChatNameValid}
                    onChange={handleChatName}
                    helperText={isChatNameValid ? "" : "Invalid chat name."}
                    required
                    sx={{width: 300}}
                    // inputProps={{ "data-testid": "content-input" }}
                    data-testid={'search-text-field'}
                />
                <br></br>
                <br></br>
                <Autocomplete
                    multiple
                    options={users}
                    sx={{ width: 300 }}
                    onChange={handleAutocomplete}
                    renderInput={(params) => <TextField {...params} variant="filled" label="Users"/>}
                    data-testid={'autocomp'}
                />
            </DialogContent>
            <DialogActions>
                <Button data-testid={'cancel'} onClick={handleClose}>Cancel</Button>
                <Button data-testid={'submit'} onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateChat;

// s

// S