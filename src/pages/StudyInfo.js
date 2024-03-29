import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';

import LayoutMain from '../components/LayoutMain';
import LayoutStudyPage from '../components/LayoutStudyPage';
import './style/Common.css';
import './style/CreateGroup.css';
import './style/StudyInfo.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';
import { Button, Form, Col, Row, Alert } from 'react-bootstrap';
import { InputLabel, MenuItem, FormControl } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { TimePicker } from 'antd';

const SERVER_URI =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.202.121:3000'
    : 'http://localhost:3000';

function StudyInfo() {
  const { gpId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [studyInfo, setStudyInfo] = useState([]);
  const [studyRule, setStudyRule] = useState('');
  const [studySchedule, setStudySchedule] = useState([]);
  const [time, setTime] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    axios
      .get(`${SERVER_URI}/api/${gpId}/info`)
      .then((res) => {
        setStudyInfo(res.data);
        setStudyRule(res.data.StudyRule);
        setStudySchedule(res.data.StudySchedules[0]);

        var timeInfo = res.data.StudySchedules[0].scheduleTime;
        timeInfo = timeInfo.substring(0, 5);
        setTime(timeInfo);

        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const onClick = (event) => {
    event.preventDefault();

    const createdValue = {
      groupDescription: document.getElementById('create-desc').value,

      rule: document.getElementById('create-rule').value,
      lateTime: document.getElementById('create-late-time').value,
      lateFee: document.getElementById('create-late-fee').value,
      absentTime: document.getElementById('create-absent-time').value,
      absentFee: document.getElementById('create-absent-fee').value,

      scheduleDay: document.getElementById('create-day').value,
      scheduleTime: document.getElementById('create-time').value,
    };

    // null과 빈 문자열 모두 아닌 경우에만 updatedValue
    const updatedValue = Object.fromEntries(
      Object.entries(createdValue).filter(
        ([_, value]) => value !== null && value !== ''
      )
    );

    axios.post(`${SERVER_URI}/api/${gpId}/info`, updatedValue);
  };

  const onClickDelete = async () => {
    await axios.post(`${SERVER_URI}/api/remove/${gpId}`);
    navigate(`/`);
  };

  return (
    <div className="div-layout-upper">
      <div className="div-layout-lower-1">
        <LayoutMain />
      </div>

      <div id="div-scroll-create" className="div-layout-lower-2">
        <div id="div-setting-form">
          <div class="colored-layout-div">
            <LayoutStudyPage
              gpId={studyInfo.groupPublicId}
              groupName={studyInfo.groupName}
            />
          </div>

          <div id="inner-div-of-setting-scroll">
            <h2>
              <b>스터디 설정</b>
            </h2>{' '}
            <br />
            <h3>스터디 소개</h3>
            <Form id="createForm">
              <Form.Group as={Row} class="row">
                <Form.Label column sm="2">
                  {' '}
                  스터디명{' '}
                </Form.Label>
                <Col sm="10">
                  {' '}
                  <Form.Control
                    type="text"
                    id="create-title"
                    placeholder={studyInfo.groupName}
                    disabled
                    readOnly
                  />{' '}
                </Col>
              </Form.Group>
              <Form.Group as={Row} class="row">
                <Form.Label column sm="2">
                  {' '}
                  한줄소개{' '}
                </Form.Label>
                <Col sm="10">
                  {' '}
                  <Form.Control
                    id="create-desc"
                    as="textarea"
                    rows={2}
                    placeholder={studyInfo.groupDescription}
                  />{' '}
                </Col>
              </Form.Group>
              <hr />
              <h3>규칙</h3>
              <Form.Group as={Row} class="row">
                <Form.Label column sm="2">
                  {' '}
                  규칙{' '}
                </Form.Label>
                <Col sm="10">
                  {' '}
                  <Form.Control
                    id="create-rule"
                    as="textarea"
                    rows={4}
                    placeholder={studyRule.rule}
                  />{' '}
                </Col>
              </Form.Group>
              <Form.Group as={Row} class="row">
                <Form.Label column sm="2">
                  {' '}
                  지각{' '}
                </Form.Label>
                <Col sm="2">
                  <Form.Control
                    type="text"
                    id="create-late-time"
                    placeholder={studyRule.lateTime}
                  />
                </Col>
                분부터, 벌금{' '}
                <Col sm="2">
                  <Form.Control
                    type="text"
                    id="create-late-fee"
                    placeholder={studyRule.lateFee}
                  />
                </Col>
                원
              </Form.Group>
              <Form.Group as={Row} class="row">
                <Form.Label column sm="2">
                  {' '}
                  결석{' '}
                </Form.Label>
                <Col sm="2">
                  <Form.Control
                    type="text"
                    id="create-absent-time"
                    placeholder={studyRule.absentTime}
                  />
                </Col>
                분부터, 벌금{' '}
                <Col sm="2">
                  <Form.Control
                    type="text"
                    id="create-absent-fee"
                    placeholder={studyRule.absentFee}
                  />
                </Col>
                원
              </Form.Group>
              <hr />
              <h3>일정</h3>
              <Form.Group as={Row} class="row">
                <Form.Label column sm="2">
                  {' '}
                  요일{' '}
                </Form.Label>
                <Col sm="10">
                  <FormControl sx={{ minWidth: 200 }} size="small">
                    <Select
                      id="create-day"
                      name="scheduleDay"
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                      // defaultValue={studySchedule.scheduleDay}
                      required
                    >
                      {/* <MenuItem value={null}>미정</MenuItem> */}
                      <MenuItem value="Mon">월</MenuItem>
                      <MenuItem value="Tue">화</MenuItem>
                      <MenuItem value="Wed">수</MenuItem>
                      <MenuItem value="Thu">목</MenuItem>
                      <MenuItem value="Fri">금</MenuItem>
                      <MenuItem value="Sat">토</MenuItem>
                      <MenuItem value="Sun">일</MenuItem>
                    </Select>
                  </FormControl>
                </Col>
              </Form.Group>
              <Form.Group as={Row} class="row">
                <Form.Label column sm="2">
                  {' '}
                  시간{' '}
                </Form.Label>
                <Col sm="10">
                  <TimePicker
                    id="create-time"
                    minuteStep={10}
                    hourStep={1}
                    format="HH:mm"
                    defaultValue={time ? dayjs(time, 'HH:mm') : null}
                  />
                </Col>
              </Form.Group>
              <br />
              <div id="info-buttons">
                <Button variant="success" id="upate-btn" onClick={onClick}>
                  스터디 정보 수정
                </Button>
                &nbsp;
                <Button
                  variant="outline-danger"
                  id="study-delete-btn"
                  onClick={onClickDelete}
                >
                  스터디 삭제
                </Button>
              </div>
              <Alert show={show} variant="success">
                <Alert.Heading>스터디를 삭제하시겠습니까?</Alert.Heading>
                <p>삭제 이후에는 저장된 데이터를 복구할 수 없습니다.</p>
                <hr />
                <div className="d-flex justify-content-end">
                  <Button onClick={() => setShow(false)} variant="success">
                    뒤로가기
                  </Button>
                  <Button onClick={onClickDelete} variant="outline-danger">
                    삭제하기
                  </Button>
                </div>
              </Alert>
              <br /> <br />
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyInfo;
