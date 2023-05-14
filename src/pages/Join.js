import { useEffect, useState } from "react";
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from "dayjs"
import { Button, Form, Col, Row } from "react-bootstrap"
import { InputLabel, MenuItem, FormControl } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import LayoutMain from '../components/LayoutMain';
import './style/Common.css'

const SERVER_URI = 'http://localhost:3000';

function Join() {

    const [isEqual, setIsEqual] = useState(false);
    const [email, setEmail] = useState(null);
    const [pw1, setPw1] = useState(null);
    const [pw2, setPw2] = useState(null);
    const [name, setName] = useState(null);
    const [nick, setNick] = useState(null);

    const [interest0, setInt0] = useState(false);
    const [interest1, setInt1] = useState(false);
    const [interest2, setInt2] = useState(false);
    const [interest3, setInt3] = useState(false);
    const [interest4, setInt4] = useState(false);
    const [interest5, setInt5] = useState(false);

    const emailHandler = (event) => { event.preventDefault(); setEmail(event.target.value); };
    const pw1Handler = (event) => { event.preventDefault(); setPw1(event.target.value); };
    const pw2Handler = (event) => { event.preventDefault(); setPw2(event.target.value); };
    const nameHandler = (event) => { event.preventDefault(); setName(event.target.value); };
    const nickHandler = (event) => { event.preventDefault(); setNick(event.target.value); };

    const int0Handler = (event) => { event.preventDefault(); setInt0(event.target.checked); };
    const int1Handler = (event) => { event.preventDefault(); setInt1(event.target.checked); };
    const int2Handler = (event) => { event.preventDefault(); setInt2(event.target.checked); };
    const int3Handler = (event) => { event.preventDefault(); setInt3(event.target.checked); };
    const int4Handler = (event) => { event.preventDefault(); setInt4(event.target.checked); };
    const int5Handler = (event) => { event.preventDefault(); setInt5(event.target.checked); };

    const onClickCheck = () => {
        const btn = document.getElementById('btn-pw-chk');
        if (pw1 === null || pw2 === null) {
            alert("비밀번호를 입력해 주세요.");
            setIsEqual(false);
            btn.innerText = "확인 필요"
        }
        else if (pw1 !== pw2) {
            alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
            setIsEqual(false);
            btn.innerText = "확인 필요"
        }
        else {
            alert("비밀번호가 일치합니다.");
            setIsEqual(true);
            btn.innerText = "확인 완료"
        }
    }

    const onClickJoin = async () => {
        console.log(interest0, interest1, interest2, interest3, interest4, interest5)
/*
        await axios.post(`${SERVER_URI}/api/user/interest`, {
            email, interest0, interest1, interest2, interest3, interest4, interest5,
        })
*/
        await axios
            .post(`${SERVER_URI}/api/user`, {
                email: email,
                userNick: nick,
                userPW: pw1,
                userName: name,
            }, {
                withCredentials: true
            })
            .then(async (result) => {
                if (result.data.code !== 0) alert('이미 존재하는 아이디입니다.');
                else {
                    await axios.post(`${SERVER_URI}/api/user/interest`, {
                        email, interest0, interest1, interest2, interest3, interest4, interest5,
                    })
                        .then(() => {
                            alert('회원가입이 완료되었습니다. 로그인 후 이용해주세요.');
                            window.location.href = '/';
                        })
                }
            })
            .catch(err => alert(err));
            

    }

    return (
        <div class="div-layout-upper">
            <div class="div-layout-lower-1">
                <LayoutMain />
            </div>

            <div id="div-scroll-join" class="div-layout-lower-2">
                <div>
                    <h2><b>회원가입</b></h2> <br />

                    <Form id="join-form">
                        <Form.Group as={Row} class="join-row">
                            <Form.Label column sm="2"> 이메일 </Form.Label>
                            <Col sm="3">
                                <Form.Control type="email" id="email" onChange={emailHandler} required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} class="join-row">
                            <Form.Label column sm="2"> 비밀번호 </Form.Label>
                            <Col sm="3">
                                <Form.Control type="password" id="pw1" onChange={pw1Handler} required />
                                <Form.Text>
                                    6자 이상, 20자 이하로 입력해주세요.
                                </Form.Text>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} class="join-row">
                            <Form.Label column sm="2"> 비밀번호 재확인 </Form.Label>
                            <Col sm="3">
                                <Form.Control type="password" id="pw2" onChange={pw2Handler} required />
                            </Col>
                            <Col sm="3">
                                <Button
                                    id="btn-pw-chk"
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={onClickCheck}
                                >
                                    확인
                                </Button>
                            </Col>
                        </Form.Group> <br /><br />

                        <Form.Group as={Row} class="join-row">
                            <Form.Label column sm="2"> 이름 </Form.Label>
                            <Col sm="3"> <Form.Control type="text" id="name" onChange={nameHandler} required /> </Col>
                        </Form.Group>

                        <Form.Group as={Row} class="join-row">
                            <Form.Label column sm="2"> 닉네임 </Form.Label>
                            <Col sm="3"> <Form.Control type="text" id="nickname" onChange={nickHandler} required /> </Col>
                        </Form.Group>

                        <Form.Group as={Row} class="join-row">
                            <Form.Label column sm="2"> 관심사 </Form.Label>
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
                        <Button id="create-btn" onClick={onClickJoin}>계정 생성</Button>
                    </Form>
                </div>
            </div>
        </div >
    );
}

export default Join;