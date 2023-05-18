import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Peer } from 'peerjs';
import axios from 'axios';
import { renderToString } from 'react-dom/server';

// component for chat drawer
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import MuiAppBar from '@mui/material/AppBar';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// icons in button container
import TextsmsIcon from '@mui/icons-material/Textsms';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import LogoutIcon from '@mui/icons-material/Logout';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import BootstrapButton from 'react-bootstrap/Button';
import LayoutMain from '../components/LayoutMain';

import './style/VideoChat.css';
import './style/Common.css';

const SERVER_URI =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.202.121:3000/'
    : 'http://localhost:3000/';

const drawerWidth = 350;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

function VideoChat() {
  const { gpId } = useParams();
  var today = new Date();

  const [date, setDate] = useState('');

  const theme = useTheme();

  const [numberOfUsers, setNumberOfUsers] = useState(1);
  const videoContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    height: '100vh',
    width: '100vw',
  };

  const videoStyle = {
    width: numberOfUsers > 1 ? `calc(${100 / numberOfUsers}% - 10px)` : '100%',
    height: numberOfUsers > 1 ? `calc(${100 / numberOfUsers}% - 10px)` : '100%',
    margin: '5px',
    maxHeight: '300px',
  };

  const [chatOpen, setChatOpen] = useState(false);

  const handleChatOpen = () => {
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setChatOpen(false);
  };

  // dateTimeString 코드 정리
  var year = today.getFullYear();
  var month = ('0' + (today.getMonth() + 1)).slice(-2);
  var day = ('0' + today.getDate()).slice(-2);
  var dateString = year + '-' + month + '-' + day;

  var hours = ('0' + today.getHours()).slice(-2);
  var minutes = ('0' + today.getMinutes()).slice(-2);
  var seconds = ('0' + today.getSeconds()).slice(-2);
  var timeString = hours + ':' + minutes + ':' + seconds;

  const dateTimeString = dateString + 'T' + timeString + '.000Z'; // YYYY-MM-DDTHH:MM:SSZ

  const callApi = async () => {
    await axios
      .get(`${SERVER_URI}/api/${gpId}/meet`)
      .then((res) => {
        var meetId = res.data.id;
        var date = res.data.date_start;
        toDate(date);

        axios
          .post(`${SERVER_URI}/api/${gpId}/check-attendance/${meetId}`, {
            email: sessionStorage.getItem('user_email'),
            enterDate: dateTimeString,
          })
          .then()
          .catch((err) => alert(err));
      })
      .catch(
        alert('회의가 없는 날입니다.')
        // err => alert(err)
        // 스터디 메인 페이지로 이동
      );
  };

  useEffect(() => {
    callApi();
  }, []);

  const toDate = (date) => {
    setDate(date.substring(5, 10));
  };

  const location = useLocation();
  const navigate = useNavigate();

  let myStream = null;
  const peers = [];
  let room_id, user_id, user_name;

  const NICKNAME = sessionStorage.getItem('user_nick');
  const ROOM_ID = gpId;
  const [studyInfo, setStudyInfo] = useState([]);
  const [message, setMessage] = useState(''); //chat input
  const [users, setUsers] = useState(1);

  const [mic, setMic] = useState({
    curState: true,
    name: 'Mute',
  });

  const [camera, setCamera] = useState({
    curState: true,
    name: 'Turn Camera Off',
  });

  const allStream = useRef();
  const videoGrid = useRef();
  const nameGrid = useRef();
  const chatContent = document.querySelector('#chat-content');

  const handleMuteClick = () => {
    if (mic.curState) {
      let audio = allStream.current.getAudioTracks();
      audio[0].enabled = false;
      setMic({
        curState: false,
        name: 'UnMute',
      });
    } else {
      let audio = allStream.current.getAudioTracks();
      audio[0].enabled = true;
      setMic({
        curState: true,
        name: 'Mute',
      });
    }
  };

  const handleCameraClick = () => {
    if (camera.curState) {
      //카메라가 켜져 있을 때 끄기
      let video = allStream.current.getVideoTracks();
      video[0].enabled = false;
      setCamera({
        curState: false,
        name: 'Turn Camera On',
      });
    } else {
      //카메라가 꺼져 있을 때 켜기
      let video = allStream.current.getVideoTracks();
      video[0].enabled = true;
      setCamera({
        curState: true,
        name: 'Turn Camera Off',
      });
    }
  };

  const handleExitClick = () => {
    navigate(-1); //이전 페이지로 이동
  };

  // const myDiv = React.createElement('div');
  const myVideo = document.createElement('video');
  // const myName = React.createElement('span');
  // const myNickDiv = React.createElement('div');

  const socket = io();
  const myPeer = new Peer({
    path: '/peerjs',
    host: '/',
    port: '3000',
  });

  useEffect(() => {
    myPeer.on('open', (peerid) => {
      room_id = ROOM_ID;
      user_name = NICKNAME;
      socket.emit('join-room', room_id, peerid, user_name);
    });

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        // my stream
        user_name = NICKNAME;

        addVideoStream(myVideo, stream);

        if (videoGrid.current) {
          videoGrid.current.append(myVideo);
          // nameGrid.current.append(user_name);
        }

        myStream = stream;
        allStream.current = stream;

        // call에 answer
        myPeer.on('call', (call) => {
          call.answer(stream);
          const video = document.createElement('video');
          // const nickDiv = React.createElement('span');
          // const div = React.createElement('div');
          var callerName = call.metadata.callerName;

          call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream);
            videoGrid.current.append(video);
            // nameGrid.current.append(callerName);
          });
        });

        // 새 유저 오면
        socket.on('new-user-connected', (data) => {
          // console.log('new user connected, ', data); //o
          setTimeout(() => {
            connectToNewUser(data.id, data.name, stream);
          }, 2000);
          setNumberOfUsers(numberOfUsers + 1);
        });
      });

    socket.on('user-disconnected', (userId) => {
      // console.log('user disconn. ', userId);
      if (peers[userId]) {
        peers[userId].close();
      }
    });

    function connectToNewUser(userId, calleeName, stream) {
      // const userDiv = React.createElement('div');
      // const userNickDiv = React.createElement('div');
      const userVideo = document.createElement('video');

      const call = myPeer.call(userId, stream, {
        metadata: { callerName: NICKNAME },
      });

      // 상대방이 그들의 video stream 보내면 작동
      call.on('stream', (userVideoStream) => {
        addVideoStream(userVideo, userVideoStream);
      });

      call.on('close', () => {
        //
        // console.log('close call', stream);
        removeVideoStream(userVideo, stream);
      });

      peers[userId] = call;
    }

    function addVideoStream(userVideo, stream) {
      // userNickDiv.innerText = userName;
      userVideo.srcObject = stream;
      userVideo.addEventListener('loadedmetadata', () => {
        userVideo.play();
      });
      videoGrid.current.append(userVideo);
      // nameGrid.current.append(userName);
      // userDiv.append(userVideo)
      // userDiv.append(userNickDiv);
      // videoGrid.append(userDiv);
    }

    function removeVideoStream(userVideo, stream) {
      // console.log('remove video stream run', stream);
      userVideo.srcObject = stream;
      const videoParent = userVideo.parentNode;
      userVideo.remove();
    }

    socket.on('update-video', (data) => {
      window.location.reload(false);
    });

    return function cleanup() {
      myStream.getTracks().forEach((track) => {
        track.stop(); //카메라, 오디오 꺼짐
      });
      socket.disconnect();
    };
  }, []);

  const handleOnKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleMessage();
    }
  };

  const handleMessage = () => {
    let datetime = new Date().toLocaleString();
    let content = document.getElementById('chat-content').value;
    document.getElementById('chat-content').value = '';

    if (content === '') {
    } else {
      const sender = NICKNAME;
      setMessage(''); //입력창 비우기
      socket.emit('new-message', sender, content, datetime, ROOM_ID);
    }
  };

  const makeChatDiv = async (sender, content, datetime) => {
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
          sender
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

  socket.on('new-message', makeChatDiv);

  function addMessage(sender, message) {
    // console.log(sender, ': ', message);
    const ul = chatContent.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = message;
    ul.appendChild(li);
    if (sender === NICKNAME) {
      //내가 보낸 메시지면
      li.style.textAlign = 'right';
    }
  }

  return (
    <div className="div-layout-upper-2">
      <div className="main-container">
        <DrawerHeader />

        <div style={videoContainerStyle}>
          {[...Array(numberOfUsers)].map((_, index) => (
            <div
              key={index}
              style={videoStyle}
              ref={videoGrid}
              id="video-grid"
            ></div>
          ))}
        </div>

        {/* <div className="videochat-container">
                    <div className="videochat-room">
                        <div
                            ref={videoGrid}
                            id="video-grid">
                        </div>
                    </div>
                </div> */}
      </div>
      <div className="button-container">
        <div className="div-meet-info">
          {studyInfo.groupName} {date} &nbsp;
          {NICKNAME}
        </div>

        <div className="div-button-grid" open={chatOpen}>
          <div onClick={handleMuteClick} id="mic-btn">
            {mic.curState ? (
              <MicIcon sx={{ color: 'white' }} fontSize="medium" />
            ) : (
              <MicOffIcon sx={{ color: 'white' }} fontSize="medium" />
            )}
          </div>
          <div onClick={handleCameraClick} id="camera-btn">
            {camera.curState ? (
              <VideocamIcon sx={{ color: 'white' }} fontSize="medium" />
            ) : (
              <VideocamOffIcon sx={{ color: 'white' }} fontSize="medium" />
            )}
          </div>
          <div onClick={handleExitClick} id="exit-btn">
            <LogoutIcon sx={{ color: 'white' }} fontSize="medium" />
          </div>

          <div
            id="chat-btn"
            onClick={handleChatOpen}
            sx={{ ...(chatOpen && { display: 'none' }) }}
          >
            <TextsmsIcon sx={{ color: 'white' }} fontSize="medium" />
          </div>
        </div>
      </div>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={chatOpen}
      >
        <DrawerHeader>
          <div onClick={handleChatClose}>
            {theme.direction === 'rtl' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </div>
        </DrawerHeader>
        <div>
          <Tabs>
            <Tab eventKey="chat" title="Chat">
              <div id="chatArea"></div>
              <div className="Chat-input-div" style={{ marginTop: '12px' }}>
                <input id="chat-content" type="text" placeholder="type.." />
                <BootstrapButton
                  variant="outline-dark"
                  size="sm"
                  onClick={handleMessage}
                >
                  SEND
                </BootstrapButton>
              </div>
            </Tab>
          </Tabs>
        </div>
      </Drawer>
    </div>
  );
}

export default VideoChat;
