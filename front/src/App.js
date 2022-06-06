import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import io from "socket.io-client";

import IndexPage from "./components/IndexPage";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ChatRoom from "./components/Chat/Chatroom";
import Chatbox from "./components/Chat/Chatbox";

import "./styles/common.css";
import "./styles/chatroom.css";

function App() {

	const [socket, setSocket] = React.useState(null);

	const setupSocket = () => {
		const token = localStorage.getItem("CC_Token");
		
		if (token) {
			const newSocket = io("http://localhost:8000", {
				query: {
					token: localStorage.getItem("CC_Token"),
				},
			});

			newSocket.on("disconnect", () => {
				setSocket(null);
				setTimeout(setupSocket, 3000);
				console.log("Socket Disconnected!");
			});

			newSocket.on("connect", () => {
				console.log("Socket Connected!");
			});

			setSocket(newSocket);
		}
	};

	React.useEffect(() => {
		setupSocket();
	}, []);

	return (
		<Router>
			<Routes>
				<Route path="/" element={<IndexPage/>} exact />
				
				<Route path="/login" element={<Login setupSocket={setupSocket} />} exact />
				<Route path="/register" element={<Register/>} exact />
				<Route path="/chatRoom" element={<ChatRoom/>} exact />
				<Route path="/chatRoom/:id" element={<Chatbox socket={socket}/>} exact />
				
			</Routes>
		</Router>
	);
}

export default App;
