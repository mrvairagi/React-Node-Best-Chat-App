import React, { useState, useEffect } from "react";
// import queryString from 'query-string';
import io from "socket.io-client";
import { useParams } from 'react-router-dom';

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;
const userid = localStorage.getItem("CC_Userid")
let messages = []
const ENDPOINT = 'http://localhost:8000/';
socket = io(ENDPOINT);


const Chatbox = (props) => {
    let { id } = useParams();
	const [name, setName] = useState('');
	const [room, setRoom] = useState('');
	const [users, setUsers] = useState('');
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [lagesMsgs, setLagesMsgs] = useState([]);
	const [flag, setFlag] = useState(0);
	
	

	useEffect(() => {
		// const { name, room } = queryString.parse(location.search);
        /* socket.on("FromAPI", data => {
            console.log(data);
        }); */

		setRoom('room')
		setName('name')
		
        /* if(socket){
            socket.emit("joinRoom", {
                id,
            });
        } */
        
		socket.emit('join', { id }, (error) => {
            console.log(error)
			if (error) {
				setFlag(1);
				alert(error);
			}
		});
	// }, [ENDPOINT, location.search]);
	}, []);

	useEffect(() => {
		socket.on('newMessage', message => {
			console.log("test--", message)
			setMessages(message);
			// setMessages(messages => [message]);
		});

		/* socket.on("roomData", ({ users }) => {
			setUsers(users);
		}); */
	}, [messages]);

	/* useEffect(() => {
		
        if (socket) {
			
			socket.on("newMessage", (msgData) => {
				if(msgData){
					setMessages(messages => [...messages, msgData]);
				}
				
			});

			socket.emit("onlineUsers", id, (data) => {
				setUsers(data);
			});

            socket.on("lastMsgs", ({ messages }) => {
                setLagesMsgs(messages);
            });
        }
	}, 0); */

	const sendMessage = (event) => {
		event.preventDefault();
        
		if (message && userid) {
			socket.emit('sendMessage', userid, id, message, () => setMessage(''));
		}
	}

	return (
		<div className="outerContainer">
			<div className="container">
				<InfoBar room={room} />
				<Messages messages={messages} name={name} />
				<Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
			</div>
			<TextContainer users={users} messages={lagesMsgs} />
		</div>
	);
}

export default Chatbox;
