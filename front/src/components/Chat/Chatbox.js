import React, { useState, useEffect } from "react";
// import queryString from 'query-string';
import io from "socket.io-client";
import { useParams } from 'react-router-dom';
import axios from "axios";
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
		axios
			.get("http://localhost:8000/chatroom/name?id=" + id, {
				headers: {
					Authorization: "Bearer " + localStorage.getItem("CC_Token"),
				},
			})
			.then((response) => {
				setRoom(response.data.name);
			})
			.catch((err) => {
				console.log(err)
			});
	})

	useEffect(() => {

		if (socket) {
			socket.on("newMessage", (message) => {
				if (typeof message === 'object' && message.text !== null && message.text.length > 0) {
					const newMessages = [...messages, message];
					setMessages(newMessages);
				}
			});

			socket.emit('lastMsgs', userid, id, (data) => {
				setLagesMsgs(data)
			});

			

		}
		//eslint-disable-next-line

	}, [messages]);

	useEffect(() => {
		if(socket){
			socket.emit("onlineUsers", id, (data) => {
				setUsers(data);
				setFlag(1)
			});
		}
	},[flag])

	useEffect(() => {
		if (socket) {
			socket.emit("joinRoom", {
				id, userid,
			});
		}

		return function cleanup() {      
			console.log("leaved---45646---")
			if (socket) {
				socket.emit("leaveRoom", {
					id, userid,
				});
				setFlag(0)
			}
		};

		/* return () => {
			//Component Unmount
			if (socket) {
				socket.emit("leaveRoom", {
					id, userid,
				});
			}
		}; */
	},[])


	const sendMessage = (event) => {
		event.preventDefault();

		if (socket && message && userid) {
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
