import axios from 'axios';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { renderToString } from 'react-dom/server';

const SERVER_URI = 'http://localhost:3000';

/* --- 본문 --- */
function Chat() {
  const { gpId } = useParams();

  const socket = io(SERVER_URI, {
    withCredentials: true,
    cors: {
      origin: '*',
    },
  });

  useEffect(() => {
    socket.emit('enter_chat_room', gpId);
    console.log('useEffect 실행 확인');
  }, []);

  // 버튼 클릭 시 msg 송신
  const sendMessage = () => {
    let datetime = new Date().toLocaleString();
    let userNick = sessionStorage.getItem('user_nick');
    let email = sessionStorage.getItem('user_email');
    let content = document.getElementById('content').value;

    document.getElementById('content').value = '';

    socket.emit('new_msg', userNick, content, datetime, gpId, () => {
      makeChatDiv(userNick, content, datetime);
    });

    console.log('msg 송신 확인');
    axios
      .post(
        `${SERVER_URI}/api/chat`,
        { email: email, gpId: gpId, content: content },
        { withCredentials: true }
      )
      .catch((err) => alert(err));
  };

  // msg 수신 시 채팅 컴포넌트 생성
  const makeChatDiv = async (userNick, content, datetime) => {
    console.log(userNick, content, datetime);
    const ChatDiv = await React.createElement(
      'div',
      { className: 'chat' },
      React.createElement(
        'div',
        { className: 'info', style: { marginBottom: '6px' } },
        React.createElement(
          'span',
          { style: { marginRight: '4px', color: '#4a4848' } },
          userNick
        ),
        React.createElement('span', { style: { color: '#c2c2c2' } }, datetime)
      ),
      React.createElement(
        'div',
        {
          className: 'content',
          style: {
            backgroundColor: '#f0f0f0',
            color: '#4a4848',
            padding: '10px 20px',
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

  // msg 수신 이벤트
  socket.on('new_msg', makeChatDiv);

  return (
    <div>
      <h2>CHAT</h2>
      <div id="chatArea"></div>
      <input id="content" type="text" placeholder="type.." />
      <button onClick={sendMessage}>SEND</button>
    </div>
  );
}

export default Chat;
