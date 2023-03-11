import { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { io } from "socket.io-client";
import { Peer } from "peerjs";
import { useNavigate } from 'react-router-dom';

const SERVER_URI = 'http://localhost:3000';

function VideoChat() {
    const location = useLocation();
    const navigate = useNavigate();

    let myStream = null;
    const peers = []
    let room_id, user_id, user_name

    const NICKNAME = "닉네임";
    const ROOM_ID = "group public Id";

    const [message, setMessage] = useState(''); //chat input
    const [users, setUsers] = useState(1);

    const [mic, setMic] = useState({
        curState: true, 
        name: "Mute"
    });

    const [camera, setCamera] = useState({
        curState: true,  
        name: "Turn Camera Off"
    });

    const allStream = useRef();
    const videoGrid = useRef();
    const chatContent = document.querySelector('#chat-content');

    const handleMuteClick = () => {
        if (mic.curState) {  
            let audio = allStream.current.getAudioTracks();
            audio[0].enabled = false;
            setMic({
                curState: false,
                name: "UnMute"
            });
        } else { 
            let audio = allStream.current.getAudioTracks();
            audio[0].enabled = true;
            setMic({
                curState: true,
                name: "Mute"
            });
        }
    }

    const handleCameraClick = () => {
        if (camera.curState) {  //카메라가 켜져 있을 때 끄기
            let video = allStream.current.getVideoTracks();
            video[0].enabled = false;
            setCamera({
                curState: false,
                name: "Turn Camera On"
            });
        } else {  //카메라가 꺼져 있을 때 켜기
            let video = allStream.current.getVideoTracks();
            video[0].enabled = true;
            setCamera({
                curState: true,
                name: "Turn Camera Off"
            });
        }
    }

    const handleExitClick = () => {
        navigate(-1); //이전 페이지로 이동 
    }

    const myDiv = document.createElement('div');
    const myVideo = document.createElement('video');
    const myNickDiv = document.createElement('div');

    const socket = io();
    const myPeer = new Peer({
        path: '/peerjs',
        host: '/',
        port: '3000'
    });

    useEffect(() => {

        myPeer.on('open', peerid => {
            room_id = ROOM_ID
            user_name = NICKNAME
            socket.emit('join-room', room_id, peerid, user_name);
        })

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {

            // my stream
            user_name = NICKNAME
            addVideoStream(myVideo, stream);

            if (videoGrid.current) {
                videoGrid.current.append(myVideo);
            }

            myStream = stream;
            allStream.current = stream;

            // call에 answer
            myPeer.on('call', call => {
                call.answer(stream);
                const video = document.createElement('video');
                const nickDiv = document.createElement('span');
                const div = document.createElement('div');
                var callerName = call.metadata.callerName;

                call.on('stream', userVideoStream => {
                    addVideoStream(video, userVideoStream);
                    videoGrid.current.append(video);
                })

            })

            // 새 유저 오면 
            socket.on("new-user-connected", data => {
                console.log('new user connected, ', data); //o
                setTimeout(() => { connectToNewUser(data.id, data.name, stream) }, 2000);
            })

        });

        socket.on("user-disconnected", userId => {
            console.log('user disconn. ', userId);
            if (peers[userId]) {
                peers[userId].close();
            }
        })

        function connectToNewUser(userId, calleeName, stream) {
            const userDiv = document.createElement('div');
            const userNickDiv = document.createElement('div');
            const userVideo = document.createElement('video')

            const call = myPeer.call(userId, stream, { metadata: { callerName: NICKNAME } });

            // 상대방이 그들의 video stream 보내면 작동
            call.on('stream', userVideoStream => {
                addVideoStream(userVideo, userVideoStream);
            });

            call.on('close', () => { //
                console.log('close call', stream);
                removeVideoStream(userVideo, stream);
            });

            peers[userId] = call;
        }

        function addVideoStream(userVideo, stream) {
            userVideo.srcObject = stream;
            userVideo.addEventListener('loadedmetadata', () => {
                userVideo.play();
            });
            videoGrid.current.append(userVideo); 
        }

        function removeVideoStream(userVideo, stream) {
            console.log('remove video stream run', stream);
            userVideo.srcObject = stream;
            const videoParent = userVideo.parentNode;
            userVideo.remove(); 
        }

        socket.on("update-video", data => {
            window.location.reload(false);
        })

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
    }

    const handleMessage = () => {
        console.log('handle message run ', message);
        let text = message;
        if (message === '') {
        }
        else {
            const sender = NICKNAME;
            setMessage(''); //입력창 비우기
            socket.emit('new_message', sender, text, ROOM_ID, () => {
                console.log('socket emit');
                addMessage(sender, `You: ${text}`);
            });
        }    
    }

    socket.on('new_message', addMessage);

    function addMessage(sender, message) {
        console.log(sender, ': ', message);
        const ul = chatContent.querySelector('ul');
        const li = document.createElement('li');
        li.innerText = message;
        ul.appendChild(li);
        if (sender === NICKNAME) { //내가 보낸 메시지면
            li.style.textAlign = 'right';
        }
    }

    return (
        <div>
            <div>
                <p>[gpId:] {ROOM_ID}</p>
                <p>[userNick:] {NICKNAME}</p>

                <div>
                    <div className="main_container">
                        <div className="videochat_container">
                            <div className="videochat_room">
                                <div ref={videoGrid} id="video-grid">
                                    
                                </div>
                            </div>
                        </div>

                        <div className="button_container">
                            <div className="button_grid">
                                <button onClick={handleMuteClick} id="mute-btn">{mic.name}</button>
                            </div>
                            <div className="button_grid">
                                <button onClick={handleCameraClick} id="camera-btn">{camera.name}</button>
                            </div>
                            <div className="button_grid">
                                <button onClick={handleExitClick} id="exit-btn">Exit</button>
                            </div>
                        </div>

                        <div className="chat_container">
                            <div id="chat-room">
                                <span> Chat </span>
                            </div>

                            <div id="chat-content">
                                <ul className="message">

                                </ul>

                            </div>

                            <div className="enter_message">
                                <input 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)} 
                                onKeyPress={handleOnKeyPress} 
                                id="enter-message" 
                                type="text" 
                                placeholder="Type message here..." />
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default VideoChat;
