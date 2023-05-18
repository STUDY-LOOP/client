import axios from 'axios';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Form, Button, Col, Row } from 'react-bootstrap';

import './style/Chat.css';

const SERVER_URI = 'http://localhost:3000';

/* --- 본문 --- */
function Chat() {
	const { gpId } = useParams();
	const email = sessionStorage.getItem('user_email');

	const [chats, setChats] = useState([]);
	const [notices, setNotices] = useState([]);
	const [key, setKey] = useState('notice');

	const socket = io(SERVER_URI, {
		withCredentials: true,
		cors: {
			origin: '*',
		},
	});

	const callApi = async () => {
		await axios
			.all([
				axios.get(`${SERVER_URI}/api/${gpId}/chat`),
				axios.get(`${SERVER_URI}/api/${gpId}/notice`),
			])
			.then(
				axios.spread((res1, res2) => {
					setChats(res1.data);
					setNotices(res2.data);
				})
			);
	};

	useEffect(() => {
		socket.emit('enter_chat_room', gpId);
		callApi();
	}, []);

	const getDate = () => {
		let today = new Date();

		let year = today.getFullYear();
		let month = ('0' + (today.getMonth() + 1)).slice(-2);
		let day = ('0' + today.getDate()).slice(-2);
		let dateString = year + '-' + month + '-' + day;

		let hours = ('0' + today.getHours()).slice(-2);
		let minutes = ('0' + today.getMinutes()).slice(-2);
		let seconds = ('0' + today.getSeconds()).slice(-2);
		let timeString = hours + ':' + minutes + ':' + seconds;

		const dateTimeString = dateString + ' ' + timeString; // YYYY-MM-DDTHH:MM:SSZ

		return dateTimeString;
	};

	// send 버튼 클릭 시 msg 송신
	const sendMessage = () => {
		let datetime = getDate();
		console.log('날짜 시간 확인: ', datetime);
		let userNick = sessionStorage.getItem('user_nick');
		let content = document.getElementById('chat-content').value;

		document.getElementById('chat-content').value = '';

		socket.emit('new_msg', userNick, content, datetime, gpId);
		console.log('msg 송신 확인');

		axios
			.post(
				`${SERVER_URI}/api/${gpId}/chat`,
				{ email: email, userNick: userNick, content: content },
				{ withCredentials: true }
			)
			.catch((err) => alert(err));
	};

	// send 버튼 클릭 시 notice 송신
	const sendNotice = () => {
		let datetime = getDate();
		let userNick = sessionStorage.getItem('user_nick');
		let content = document.getElementById('notice-content').value;

		document.getElementById('notice-content').value = '';

		socket.emit('new_notice', userNick, content, datetime, gpId);
		console.log('notice 송신 확인');

		axios
			.post(
				`${SERVER_URI}/api/${gpId}/notice`,
				{ email: email, userNick: userNick, content: content },
				{ withCredentials: true }
			)
			.catch((err) => alert(err));
	};

	// msg 수신 시 채팅 컴포넌트 생성
	const makeChatDiv = async (userNick, content, datetime) => {
		const ChatDiv = await React.createElement(
			'div',
			{ className: 'Chat-div' },
			React.createElement(
				'div',
				{ className: 'Chat-div-info', style: { marginBottom: '6px' } },
				React.createElement(
					'span',
					{
						className: 'Chat-span-usernick',
						style: { marginRight: '4px', color: '#4a4848' },
					},
					userNick
				),
				React.createElement(
					'span',
					{ className: 'Chat-span-datetime', style: { color: '#c2c2c2' } },
					datetime
				)
			),
			React.createElement(
				'div',
				{
					className: 'Chat-div-content',
					style: {
						backgroundColor: '#ffffff',
						color: '#4a4848',
						padding: '8px 15px',
					},
				},
				content
			)
		);

		const el = document.createElement('div');
		el.innerHTML = renderToString(ChatDiv);

		const chatContainer = document.getElementById('chatArea');
		chatContainer.append(el.firstChild);
	};

	// notice 수신 시 컴포넌트 생성
	const makeNoticeDiv = async (userNick, content, datetime) => {
		const NoticeDiv = await React.createElement(
			'div',
			{ className: 'Notice-div' },
			React.createElement(
				'div',
				{ className: 'Notice-div-info', style: { marginBottom: '6px' } },
				React.createElement(
					'span',
					{
						className: 'Notice-span-usernick',
						style: { marginRight: '4px', color: '#4a4848' },
					},
					userNick
				),
				React.createElement(
					'span',
					{ className: 'Notice-span-datetime', style: { color: '#c2c2c2' } },
					datetime
				)
			),
			React.createElement(
				'div',
				{
					className: 'Notice-div-content',
					style: {
						backgroundColor: '#ffffff',
						color: '#4a4848',
						padding: '8px 15px',
					},
				},
				content
			)
		);

		const el = document.createElement('div');
		el.innerHTML = renderToString(NoticeDiv);

		const noticeContainer = document.getElementById('noticeArea');
		noticeContainer.append(el.firstChild);
	};

	// 수신 이벤트
	socket.on('new_msg', makeChatDiv);
	socket.on('new_notice', makeNoticeDiv);

	// 렌더
	return (
		<div id="entire-chat-div">
			<Tabs
				id="controlled-chat-notice-tab"
				activeKey={key}
				onSelect={(k) => setKey(k)}
				className="chat-notice-tab"
				fill
				justify
			>
				<Tab eventKey="chat" title="Chat">
					<div id="div-tab-chat">
						<div id="chatArea">
							{chats.map((chat) => (
								<div className="Chat-div" style={{ margin: '5px 0px' }}>
									<div className="Chat-div-info" style={{ marginBottom: '6px' }}>
										<span
											className="Chat-span-usernick"
											style={{ marginRight: '4px', color: '#4a4848' }}
										>
											{chat.userNick}
										</span>
										<span
											className="Chat-span-datetime"
											style={{ color: '#c2c2c2' }}
										>
											{new Date(chat.datetime).getFullYear()}-{new Date(chat.datetime).getMonth() + 1}-{new Date(chat.datetime).getDate()} {new Date(chat.datetime).getHours()}:{new Date(chat.datetime).getMinutes()}
										</span>
									</div>
									<div
										className="Chat-div-content"
										style={{
											backgroundColor: '#ffffff',
											color: '#4a4848',
											padding: '8px 15px',
											marginBottom: '20px',
										}}
									>
										{chat.content}
									</div>
								</div>
							))}
						</div>

						<div className="Chat-input-div" style={{ marginTop: '12px' }}>
							<input id="chat-content" type="text"/>&nbsp;
							<Button variant="outline-dark" size="sm" onClick={sendMessage}>
								SEND
							</Button>
						</div>
					</div>


				</Tab>

				<Tab eventKey="notice" title="Notice">
					<div id="div-tab-notice">
						<div id="noticeArea">
							{notices.map((notice) => (
								<div className="Notice-div" style={{ margin: '5px 0px' }}>
									<div
										className="Notice-div-info"
										style={{ marginBottom: '6px' }}
									>
										<span
											className="Notice-span-usernick"
											style={{ marginRight: '4px', color: '#4a4848' }}
										>
											{notice.userNick}
										</span>
										<span
											className="Notice-span-datetime"
											style={{ color: '#c2c2c2' }}
										>
											{new Date(notice.datetime).getFullYear()}-{new Date(notice.datetime).getMonth() + 1}-{new Date(notice.datetime).getDate()} {new Date(notice.datetime).getHours()}:{new Date(notice.datetime).getMinutes()}
										</span>
									</div>
									<div
										className="Notice-div-content"
										style={{
											backgroundColor: '#ffffff',
											color: '#4a4848',
											padding: '8px 15px',
											marginBottom: '20px',
										}}
									>
										{notice.content}
									</div>
								</div>
							))}
						</div>

						<div className="Notice-input-div" style={{ marginTop: '12px' }}>
							<input id="notice-content" type="text" />&nbsp;
							<Button variant="outline-dark" size="sm" onClick={sendNotice}>
								SEND
							</Button>
						</div>
					</div>

				</Tab>
			</Tabs>
		</div>
	);
}

export default Chat;
