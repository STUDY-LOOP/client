import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Tabs, Tab, Button, Row, Col } from 'react-bootstrap';

import './style/AddEvent.css';

const SERVER_URI =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.202.121:3000'
    : 'http://localhost:3000';

function AddEvent({ date_start }) {
  const { gpId } = useParams();
  let ini_date;

  // -- 이벤트 등록 -- //
  const [eventTitle, setEventTitle] = useState(null);
  const [type, setType] = useState(null);
  const [startDateTime, setStartDateTime] = useState(date_start);
  const [endDateTime, setEndDateTime] = useState(date_start);
  const [description, setDescription] = useState(null);

  const color = ['#088A29', '#5882FA', '#FACC2E']; // 초록 파랑 주황

  useEffect(() => {
    ini_date = new Date(date_start);
    setStartDateTime(ini_date);
    setEndDateTime(ini_date);
  }, [date_start]);

  useEffect(() => {
    if (endDateTime && startDateTime > endDateTime) {
      window.alert('시작일 이후의 날짜를 선택하세요.');
      setEndDateTime(startDateTime);
    }
  }, [endDateTime]);

  const eventTitleInputHandler = (event) => {
    event.preventDefault();
    setEventTitle(event.target.value);
  };
  const descriptionHandler = (event) => {
    event.preventDefault();
    setDescription(event.target.value);
  };

  // -- 스터디 생성 -- //
  const onClickStudyEvent = async () => {
    window.location.replace(`/study-group/${gpId}`);
    axios
      .post(
        `${SERVER_URI}/api/event`,
        {
          gpId: gpId,
          event_title: eventTitle,
          event_type: '0',
          date_start: startDateTime,
          event_color: color[0],
        },
        {
          withCredentials: true,
        }
      )

      .then((res) => {
        axios.post(`${SERVER_URI}/api/${gpId}/create-attendance/${res.data}`);
      })
      // .then(() => window.location.replace(`/study-group/${gpId}`))
      .catch((err) => alert(err));
  };

  // -- 과제함 생성 -- //
  const [log, setLog] = useState('');
  const [content, setContent] = useState('');

  const logHandler = (event) => {
    event.preventDefault();
    setLog(event.target.value);
  };
  const contentHandler = (event) => {
    event.preventDefault();
    setContent(event.target.value);
  };

  const onClickAsgmtEvent = async (event) => {
    window.location.replace(`/study-group/${gpId}`);
    const boxId = await axios.post(`${SERVER_URI}/api/assignmentBox`, {
      gpId: gpId,
      log: log,
      title: eventTitle,
      content: content,
      deadline: startDateTime,
    });

    await axios.post(`${SERVER_URI}/api/event`, {
      gpId: gpId,
      event_title: eventTitle,
      event_type: '1',
      date_start: startDateTime,
      event_color: color[1],
      boxId: boxId.data,
    });

    // window.location.replace(`/study-group/${gpId}`);
  };

  // -- 기타 일정 생성 -- //
  const onClickEtcEvent = async () => {
    window.location.replace(`/study-group/${gpId}`);
    await axios
      .post(
        `${SERVER_URI}/api/event`,
        {
          gpId: gpId,
          event_title: eventTitle,
          event_type: '2',
          date_start: startDateTime,
          date_end: endDateTime,
          event_des: description,
          event_color: color[2],
        },
        {
          withCredentials: true,
        }
      )
      // .then(() => window.location.replace(`/study-group/${gpId}`))
      .catch((err) => alert(err));
  };

  return (
    <Tabs defaultActiveKey="event-study" id="event-tabs">
      <Tab eventKey="event-study" title="스터디">
        <br />
        <Form>
          <Form.Group as={Row} class="form-add-event">
            <Form.Label column sm="2">
              <strong>날짜</strong>
            </Form.Label>
            <Col>
              <DateTimePicker
                onChange={setStartDateTime}
                value={startDateTime}
                format="y-MM-dd a h:mm"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} class="form-add-event">
            <Form.Label column sm="2">
              <strong>일정명</strong>
            </Form.Label>
            <Col>
              <Form.Control
                type="input"
                onChange={eventTitleInputHandler}
                required
              />
            </Col>
          </Form.Group>
        </Form>

        <hr />
        <Button
          variant="success"
          onClick={onClickStudyEvent}
          style={{ float: 'right' }}
        >
          스터디 만들기
        </Button>
      </Tab>

      <Tab eventKey="event-assignment" title="과제">
        <br />
        <Form>
          <Form.Group as={Row} class="form-add-event">
            <Form.Label column sm="2">
              <strong>날짜</strong>
            </Form.Label>
            <Col>
              <DateTimePicker
                onChange={setStartDateTime}
                value={startDateTime}
                format="y-MM-dd a h:mm"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} class="form-add-event">
            <Form.Label column sm="2">
              <strong>과제명</strong>
            </Form.Label>
            <Col>
              <Form.Control
                type="input"
                onChange={eventTitleInputHandler}
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} class="form-add-event">
            <Form.Label column sm="2">
              <strong>로그</strong>
            </Form.Label>
            <Col>
              <Form.Control type="text" onChange={logHandler} required />
            </Col>
          </Form.Group>

          <Form.Group as={Row} class="form-add-event">
            <Form.Label column sm="2">
              <strong>설명</strong>
            </Form.Label>
            <Col>
              <Form.Control
                as="textarea"
                onChange={contentHandler}
                rows={3}
                required
              />
            </Col>
          </Form.Group>
        </Form>

        <hr />
        <Button
          variant="success"
          onClick={onClickAsgmtEvent}
          style={{ float: 'right' }}
        >
          과제함 만들기
        </Button>
      </Tab>

      <Tab eventKey="event-etc" title="기타 일정">
        <br />
        <Form>
          <Form.Group as={Row} class="form-add-event">
            <Form.Label column sm="2">
              <strong>시작일</strong>
            </Form.Label>
            <Col>
              <DateTimePicker
                onChange={setStartDateTime}
                value={startDateTime}
                format="y-MM-dd a h:mm"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} class="form-add-event">
            <Form.Label column sm="2">
              <strong>종료일</strong>
            </Form.Label>
            <Col>
              <DateTimePicker
                onChange={setEndDateTime}
                value={endDateTime}
                format="y-MM-dd a h:mm"
              />{' '}
              <br />
            </Col>
          </Form.Group>

          <Form.Group as={Row} class="form-add-event">
            <Form.Label column sm="2">
              <strong>일정명</strong>
            </Form.Label>
            <Col>
              <Form.Control
                type="input"
                onChange={eventTitleInputHandler}
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} class="form-add-event">
            <Form.Label column sm="2">
              <strong>설명</strong>
            </Form.Label>
            <Col>
              <Form.Control
                as="textarea"
                onChange={descriptionHandler}
                rows={3}
                required
              />
            </Col>
          </Form.Group>
        </Form>

        <hr />
        <Button
          variant="success"
          onClick={onClickEtcEvent}
          style={{ float: 'right' }}
        >
          일정 만들기
        </Button>
      </Tab>
    </Tabs>
  );
}

export default AddEvent;
