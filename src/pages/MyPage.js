import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Button, Form } from 'react-bootstrap';

import LayoutMain from '../components/LayoutMain';

import './style/Common.css';
import './style/StudyMain.css';
import './style/MyPage.css';

const SERVER_URI = 'http://localhost:3000';

function MyPage() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState(null);
  const [asLeader, setAsLeader] = useState([]);
  const [asMember, setAsMember] = useState([]);

  const initialValues = {
    nickname: '',
    password: '',
  };
  const [values, setValues] = useState(initialValues);

  //const [modalIsOpen, setModalIsOpen] = useState(false);

  /*
  const [nick, setNick] = useState(null);
  const [password, setPassword] = useState(null);
  //state 수정
  const nickInputHandler = (event) => {
    event.preventDefault();
    setNick(event.target.value);
  };
  const pwInputHandler = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };
  */

  const email = sessionStorage.getItem('user_email');

  useEffect(() => {
    axios
      .all([
        axios.get(`${SERVER_URI}/api/user/${email}/info`), //email, userNick 가져옴
        axios.get(`${SERVER_URI}/api/user/${email}/leader`),
        axios.get(`${SERVER_URI}/api/user/${email}/member`),
      ])
      .then(
        axios.spread((res1, res2, res3) => {
          setInfo(res1.data);
          setAsLeader(res2.data);
          setAsMember(res3.data.StudyGroups);
          setLoading(false);
        })
      )
      .catch((err) => console.log(err));
  }, []);

  const onFormChange = (e) => {
    //const name = e.target.name;
    //const value = e.target.value;
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const onClickEdit = () => {
    //db상 수정
    axios.post(`${SERVER_URI}/api/user/${email}/modify`, {
      newNick: values.nickname,
      newPW: values.password,
    });
  };

  return (
    <>
      {loading ? (
        <h3>LOADING...</h3>
      ) : (
        <div class="div-layout-upper">
          <div class="div-layout-lower-1">
            <LayoutMain />
          </div>

          <div class="div-layout-lower-2-custom">
            <h4 style={{ fontWeight: 600 }}>내 정보</h4>

            <Form>
              <Form.Group as={Row} controlId="myPage.PlaintextEmail">
                <Form.Label column sm="2">
                  Email address
                </Form.Label>
                <Col sm="8">
                  <Form.Control plaintext readOnly defaultValue={email} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="myPage.NickInput">
                <Form.Label column sm="2">
                  Nickname
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    name="nickname"
                    placeholder={info.userNick}
                    onChange={onFormChange}
                  />
                  <Form.Text className="text-muted">
                    Type in your new nickname, should you wish to change it.
                  </Form.Text>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="myPage.PasswordInput">
                <Form.Label column sm="2">
                  New Password
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="password"
                    name="password"
                    aria-describedby="passwordHelpBlock"
                    onChange={onFormChange}
                  />
                  <Form.Text id="passworkdHelpBlock" muted>
                    Your password should be 8-20 characters long, contain
                    letters and numbers, must not contain special characters.
                  </Form.Text>
                </Col>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                onClick={onClickEdit}
                size="sm"
                style={{ position: 'absolute', right: 205, bottom: 290 }}
              >
                Submit
              </Button>
            </Form>
            <br />
            <hr />
            <h4 style={{ fontWeight: 600 }}>내가 만든 스터디</h4>
            {!asLeader ? (
              <>만든 스터디가 없습니다</>
            ) : (
              <>
                {asLeader.map((study) => (
                  <>
                    <div>
                      <ul>
                        <li>
                          <Link
                            className="mypage-link"
                            to={`/study-group/${study.groupPublicId}`}
                          >
                            {study.groupName}
                          </Link>{' '}
                          <br />{' '}
                        </li>
                      </ul>
                    </div>
                  </>
                ))}
              </>
            )}
            <hr />
            <h4 style={{ fontWeight: 600 }}>내가 가입한 스터디</h4>
            {!asMember ? (
              <>가입한 스터디가 없습니다</>
            ) : (
              <>
                {asMember.map((study) => (
                  <>
                    <div>
                      <ul>
                        <li>
                          <Link
                            className="mypage-link"
                            to={`/study-group/${study.groupPublicId}`}
                          >
                            {study.groupName}
                          </Link>{' '}
                          <br />{' '}
                        </li>
                      </ul>
                    </div>
                  </>
                ))}
              </>
            )}
            <hr />
            <h4 style={{ fontWeight: 600 }}>내가 제출한 과제</h4>
          </div>
        </div>
      )}
    </>
  );
}

export default MyPage;
