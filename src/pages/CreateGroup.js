import axios from 'axios';

import LayoutMain from '../components/LayoutMain';
import './style/Common.css'
import './style/CreateGroup.css'

import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from "dayjs"
import { Button, Form, Col, Row } from "react-bootstrap"
import { InputLabel, MenuItem, FormControl } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { TimePicker } from 'antd';

const SERVER_URI = 'http://localhost:3000';

function CreateGroup() {
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
        });
    };

    return (
        <div className="div-layout-upper">
            <div className="div-layout-lower-1">
                <LayoutMain />
            </div>

            <div id="div-scroll-create" className="div-layout-lower-2">
                <div id="div-create-form">
                    <h2><b>스터디 만들기</b></h2> <br />

                    <h3>스터디 소개</h3>
                    <Form id="createForm">
                        <Form.Group as={Row} class="row">
                            <Form.Label column sm="2"> 스터디명 </Form.Label>
                            <Col sm="10"> <Form.Control type="text" id="create-title" /> </Col>
                        </Form.Group>

                        <Form.Group as={Row} class="row">
                            <Form.Label column sm="2"> 한줄소개 </Form.Label>
                            <Col sm="10"> <Form.Control id="create-desc" as="textarea" rows={2} /> </Col>
                        </Form.Group>


                        <hr />
                        <h3>규칙</h3>

                        <Form.Group as={Row} class="row">
                            <Form.Label column sm="2"> 규칙 </Form.Label>
                            <Col sm="10"> <Form.Control id="create-rule" as="textarea" rows={4} /> </Col>
                        </Form.Group>

                        <Form.Group as={Row} class="row">
                            <Form.Label column sm="2"> 지각 </Form.Label>
                            <Col sm="2">
                                <Form.Control type="text" id="create-late-time" />
                            </Col>분부터,

                            벌금 <Col sm="2">
                                <Form.Control type="text" id="create-late-fee" />
                            </Col>원
                        </Form.Group>

                        <Form.Group as={Row} class="row">
                            <Form.Label column sm="2"> 결석 </Form.Label>
                            <Col sm="2">
                                <Form.Control type="text" id="create-absent-time" />
                            </Col>분부터,

                            벌금 <Col sm="2">
                                <Form.Control type="text" id="create-absent-fee" />
                            </Col>원
                        </Form.Group>



                        <hr />
                        <h3>일정</h3>

                        <Form.Group as={Row} class="row">
                            <Form.Label column sm="2"> 요일 </Form.Label>
                            <Col sm="10">
                                <FormControl sx={{ minWidth: 200 }} size="small">
                                    <Select
                                        id="create-day"
                                        name="scheduleDay"
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
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
                            <Form.Label column sm="2"> 시간 </Form.Label>
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

                        <br />
                        <Button id="create-btn" onClick={onClick}>스터디 생성</Button>
                    </Form>
                </div>
            </div >
        </div >
    );
}

export default CreateGroup;