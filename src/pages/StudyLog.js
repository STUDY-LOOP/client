import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import Button from 'react-bootstrap/Button';
/* import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css'; */

import LayoutMain from '../components/LayoutMain';
import './style/StudyLog.css';
import './style/Common.css';

import PageLink from '../components/PageLink';
import MeetAttendance from '../components/MeetAttendance';
import { valueToPercent } from '@mui/base';

const SERVER_URI = 'http://localhost:3000';

function StudyLog() {
  const { log } = useParams();

  const str = `
### Preview Markdown

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/react-md-editor-preview-markdown-vrucl?fontsize=14&hidenavigation=1&theme=dark)

\`\`\`jsx
import React from "react";
import ReactDOM from "react-dom";
import MDEditor from '@uiw/react-md-editor';

export default function App() {
  return (
    <div className="container">
      <MDEditor.Markdown source="Hello Markdown!" />
    </div>
  );
}
\`\`\`
`;

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [date, setDate] = useState('');

  const callApi = async () => {
    axios
      .all([
        axios.get(`${SERVER_URI}/api/event/${log}`),
        axios.get(`${SERVER_URI}/api/log/${log}`),
      ])
      .then(
        axios.spread((res1, res2) => {
          var dateInfo = res1.data[0].date_start;
          setContent(res2.data.content);
          toDate(dateInfo);
        })
      )
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    callApi();
  }, []);

  const handleCloseOnClick = async () => {
    setModalIsOpen(false);
    await axios.post(`${SERVER_URI}/api/log/${log}/modify`, {
      newContent: content,
    });
  };

  const toDate = (dateInfo) => {
    setDate(dateInfo.substring(5, 10));
  };

  return (
    <div class="div-layout-upper">
      <div class="div-layout-lower-1">
        <LayoutMain />
      </div>
      <div id="div-studylog" class="div-layout-lower-2">
        <div class="div-page-header">
          <h1>{date} 로그</h1>
        </div>

        <div id="div-minutes">
          <div class="div-component-header">회의록</div>
          <div class="div-component">
            <MDEditor.Markdown source={content} />
            <br />
            <Button variant="primary" onClick={() => setModalIsOpen(true)}>
              수정하기
            </Button>{' '}
            <Modal isOpen={modalIsOpen} ariaHideApp={false}>
              <MDEditor
                value={content}
                preview="edit"
                onChange={(con) => setContent(con)}
              />
              <br />
              <Button variant="primary" onClick={handleCloseOnClick}>
                완료하기
              </Button>{' '}
            </Modal>
          </div>
        </div>

        <div id="div-attendance">
          <div class="div-component-header">출석부</div>
          <div class="div-component">
            <MeetAttendance />
          </div>
        </div>

        <div id="div-assignment">
          <div class="div-component-header">과제함</div>
          <div class="div-component"></div>
        </div>
      </div>{' '}
      <hr />
    </div>
  );
}

export default StudyLog;
