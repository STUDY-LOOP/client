import axios from 'axios';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const SERVER_URI = 'http://localhost:3000';

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
  const makeChatDiv = (userNick, content, datetime) => {
    let div = document.createElement('div');
    let nameH3 = document.createElement('h3');
    let contentP = document.createElement('p');
    let dateP = document.createElement('p');

    nameH3.innerHTML = userNick;
    contentP.innerHTML = content;
    dateP.innerHTML = datetime;

    div.appendChild(nameH3);
    div.appendChild(contentP);
    div.appendChild(dateP);

    div.className = 'chat';

    document.getElementById('chatArea').prepend(div);
  };

  // msg 수신 이벤트
  socket.on('new_msg', makeChatDiv);

  return (
    <div>
      <h2>CHAT</h2>
      <input id="content" type="text" placeholder="type.." />
      <button onClick={sendMessage}>SEND</button>
      <div id="chatArea"></div>
    </div>
  );
}

export default Chat;
