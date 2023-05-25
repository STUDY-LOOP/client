import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Peer } from 'peerjs';
import axios from 'axios';
import { renderToString } from 'react-dom/server';

// component for chat drawer
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
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

const SERVER_URI = 'http://localhost:3000';

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
    navigate(-1); // 이전 페이지로 이동
  };

  const myVideo = document.createElement('video');
  myVideo.muted = true; // 하울링 X

  const socket = io.connect(); //io();

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
        console.log('214: add my stream');
        user_name = NICKNAME;
        addVideoStream(myVideo, stream, user_name);

        myStream = stream;
        allStream.current = stream;

        // call에 answer
        myPeer.on('call', (call) => {
          call.answer(stream, { metadata: { calleeName: NICKNAME } })
          const video = document.createElement('video');
          var callerName = call.metadata.callerName;

          call.on('stream', (userVideoStream) => {
            console.log('231: add stream for', callerName);
            console.log('232 video: ', userVideoStream);
            addVideoStream(video, userVideoStream, callerName);
          });

          call.on('close', () => {
            removeVideoStream(video, stream);
          });
        });

        // 새 유저 오면
        socket.on('new-user-connected', (data) => {
          console.log('new user connected, ', data);
          setTimeout(() => { connectToNewUser(data.id, data.name, stream) }, 2000);
        });
      });

    function connectToNewUser(userId, calleeName, stream) {
      const userVideo = document.createElement('video');
      const call = myPeer.call(userId, stream, {
        metadata: { callerName: NICKNAME },
      });

      // 상대방이 그들의 video stream 보내면 작동
      call.on('stream', (userVideoStream) => {
        console.log('264: add stream for', calleeName); // 두 번  실행됨
        console.log('265 video: ', userVideoStream);
        addVideoStream(userVideo, userVideoStream, calleeName);
      });

      call.on('close', () => {
        removeVideoStream(userVideo, stream);
      });
    }

    function addVideoStream(userVideo, stream, nickname) {
      console.log('(1)userVideo: ', userVideo, '(2)stream: ', stream, '(3)nickname', nickname);
      const videoParent = document.createElement('div');

      userVideo.srcObject = stream;
      userVideo.addEventListener('loadedmetadata', () => {
        userVideo.play();
      });

      videoParent.classList.add('video-container');
      const nicknameElement = document.createElement('div');
      nicknameElement.classList.add('nickname');
      nicknameElement.textContent = nickname;

      videoParent.append(userVideo);
      videoParent.append(nicknameElement);
      videoGrid.current.append(videoParent);
    }

    socket.on('user-disconnected', (userId, streamId) => {
      console.log('user disconnected, ', userId, streamId);
      if (peers[userId]) {
        peers[userId].close();
      }
    });

    function removeVideoStream(userVideo, stream) {
      console.log('remove video stream run, ', stream)
      // Remove the video element
      userVideo.srcObject = null;
      userVideo.parentNode.remove(userVideo);

      // Remove the nickname element
      const nicknameElement = userVideo.nextSibling;
      nicknameElement.parentNode.remove(nicknameElement);

      // Remove the parent container
      const videoParent = userVideo.parentNode;
      videoParent.parentNode.remove(videoParent); 

      // Clean up the stream tracks
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    }

    socket.on('update-video', () => {
      window.location.reload(true);
    });

    return function cleanup() {
      myStream.getTracks().forEach((track) => {
        track.stop(); //카메라, 오디오 꺼짐
      });
      removeVideoStream(myVideo, myStream);
      socket.disconnect();
    };
  }, []);


  return (
    <div className="div-layout-upper-2">
      <div className="main-container">
        <DrawerHeader />

        <div className="videochat-container">
          <div className="videochat-room">
            <div
              ref={videoGrid}
              id="video-grid">
            </div>
          </div>
        </div>
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
