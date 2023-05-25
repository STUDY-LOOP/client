import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import LayoutMain from '../components/LayoutMain';
import './style/Common.css';
import './style/CreateGroup.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { InputLabel, MenuItem, FormControl } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { TimePicker } from 'antd';

const SERVER_URI =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.202.121:3000'
    : 'http://localhost:3000';

function CreateGroup() {
  const navigate = useNavigate();

  const [interest0, setInt0] = useState(false);
  const [interest1, setInt1] = useState(false);
  const [interest2, setInt2] = useState(false);
  const [interest3, setInt3] = useState(false);
  const [interest4, setInt4] = useState(false);
  const [interest5, setInt5] = useState(false);

  const int0Handler = (event) => {
    event.preventDefault();
    setInt0(event.target.checked);
  };
  const int1Handler = (event) => {
    event.preventDefault();
    setInt1(event.target.checked);
  };
  const int2Handler = (event) => {
    event.preventDefault();
    setInt2(event.target.checked);
  };
  const int3Handler = (event) => {
    event.preventDefault();
    setInt3(event.target.checked);
  };
  const int4Handler = (event) => {
    event.preventDefault();
    setInt4(event.target.checked);
  };
  const int5Handler = (event) => {
    event.preventDefault();
    setInt5(event.target.checked);
  };

  const onClick = (event) => {
    event.preventDefault();
    axios.post(`${SERVER_URI}/api/group`, {
      groupName: document.getElementById('create-title').value,
      groupDescription: document.getElementById('create-desc').value,

      rule: document.getElementById('create-rule').value,
      lateTime: document.getElementById('create-late-time').value,
      lateFee: document.getElementById('create-late-fee').value,
      absentTime: document.getElementById('create-absent-time').value,
      absentFee: document.getElementById('create-absent-fee').value,

      scheduleDay: document.getElementById('create-day').value,
      scheduleTime: document.getElementById('create-time').value,

      interest0,
      interest1,
      interest2,
      interest3,
      interest4,
      interest5,
    });
    // navigate('/');
    window.location.replace('/');
  };

  return (
    <div className="div-layout-upper">
      <div className="div-layout-lower-1">
        <LayoutMain />
      </div>

      <div id="div-scroll-create" className="div-layout-lower-2">
        <div id="div-create-form">
          <h2>
            <b>스터디 만들기</b>
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
                <Form.Control type="text" id="create-title" />{' '}
              </Col>
            </Form.Group>

            <Form.Group as={Row} class="row">
              <Form.Label column sm="2">
                {' '}
                한줄소개{' '}
              </Form.Label>
              <Col sm="10">
                {' '}
                <Form.Control id="create-desc" as="textarea" rows={2} />{' '}
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
                <Form.Control id="create-rule" as="textarea" rows={4} />{' '}
              </Col>
            </Form.Group>

            <Form.Group as={Row} class="row">
              <Form.Label column sm="2">
                {' '}
                지각{' '}
              </Form.Label>
              <Col sm="2">
                <Form.Control type="text" id="create-late-time" />
              </Col>
              분부터, 벌금{' '}
              <Col sm="2">
                <Form.Control type="text" id="create-late-fee" />
              </Col>
              원
            </Form.Group>

            <Form.Group as={Row} class="row">
              <Form.Label column sm="2">
                {' '}
                결석{' '}
              </Form.Label>
              <Col sm="2">
                <Form.Control type="text" id="create-absent-time" />
              </Col>
              분부터, 벌금{' '}
              <Col sm="2">
                <Form.Control type="text" id="create-absent-fee" />
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
                    required
                  >
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
                  defaultValue={dayjs('18:00', 'HH:mm')}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm="2">
                {' '}
                스터디 종류{' '}
              </Form.Label>
              <Col sm="1">
                <Form.Check
                  type="checkbox"
                  id="chkbox-0"
                  label="어학"
                  onChange={int0Handler}
                />
                <Form.Check
                  type="checkbox"
                  id="chkbox-1"
                  label="취업"
                  onChange={int1Handler}
                />
              </Col>

              <Col sm="1">
                <Form.Check
                  type="checkbox"
                  id="chkbox-2"
                  label="개발"
                  onChange={int2Handler}
                />
                <Form.Check
                  type="checkbox"
                  id="chkbox-3"
                  label="기타"
                  onChange={int3Handler}
                />
              </Col>

              <Col sm="2">
                <Form.Check
                  type="checkbox"
                  id="chkbox-4"
                  label="취미/교양"
                  onChange={int4Handler}
                />
                <Form.Check
                  type="checkbox"
                  id="chkbox-5"
                  label="고시/공시"
                  onChange={int5Handler}
                />
              </Col>
            </Form.Group>

            <br />
            <Button variant="success" id="create-btn" onClick={onClick}>
              스터디 생성
            </Button>
          </Form>
          <br /> <br />
        </div>
      </div>
    </div>
  );
}

export default CreateGroup;
