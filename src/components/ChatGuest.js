import axios from 'axios';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Form, Button, Col, Row } from 'react-bootstrap';

import './style/Chat.css';

const SERVER_URI =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.202.121:3000'
    : 'http://localhost:3000';

/* --- 본문 --- */
function ChatGuest() {

  const [key, setKey] = useState('notice');

  

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
            <div id="chatArea" class="guestSection">
            스터디 가입 후 확인 가능합니다.
            </div>

            <div className="Chat-input-div" style={{ marginTop: '12px' }}>
              <input id="chat-content" type="text" />
              &nbsp;
              <Button variant="outline-dark" size="sm" disabled>
                SEND
              </Button>
            </div>
          </div>
        </Tab>

        <Tab eventKey="notice" title="Notice">
          <div id="div-tab-notice">
            <div id="noticeArea" class="guestSection">
                스터디 가입 후 확인 가능합니다.
            </div>

            <div className="Notice-input-div" style={{ marginTop: '12px' }}>
              <input id="notice-content" type="text" />
              &nbsp;
              <Button variant="outline-dark" size="sm" disabled>
                SEND
              </Button>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default ChatGuest;
