import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Form,
  FloatingLabel,
  OverlayTrigger,
  Popover,
  Button,
} from 'react-bootstrap';

import './style/Login.css';

const SERVER_URI =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.202.121:3000/'
    : 'http://localhost:3000/';

function Login() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();

  const emailInputHandler = (event) => {
    event.preventDefault();
    setEmail(event.target.value);
  };
  const pwInputHandler = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };

  const onClickLogin = async () => {
    // console.log(email);
    // console.log(password);

    await axios
      .post(
        `${SERVER_URI}/api/user/login`,
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      )
      .then((result) => {
        if (result.data.code !== 0) alert('아이디 혹은 비밀번호가 틀렸습니다');
        else {
          alert(`${result.data.user_nick}님 환영합니다!`);
          sessionStorage.setItem('user_email', result.data.user_email);
          sessionStorage.setItem('user_nick', result.data.user_nick);
          sessionStorage.setItem('preTab', -1);
          navigate('/');
        }
      })
      .catch((err) => alert(err));
  };

  const onClickLogout = async () => {
    await axios.get(`${SERVER_URI}/api/user/logout`);
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('user_nick');
    navigate('/');
  };

  const onClickProfile = async () => {
    navigate('/my/profile');
  };

  return (
    <div id="div-login" className="profile">
      {sessionStorage.getItem('user_nick') !== null ? (
        <div id="after-login">
          <div id="welcome-name">
            <br />
            <h5>
              <b>
                안녕하세요
                <br />
                {`${sessionStorage.getItem('user_nick')}님`}
              </b>
            </h5>
          </div>

          <br />
          <button id="btn-my-profile" onClick={onClickProfile} className="btn">
            마이페이지
          </button>
          <button id="btn-logout" onClick={onClickLogout} className="btn">
            로그아웃
          </button>
        </div>
      ) : (
        <div id="login-input">
          <br />
          <OverlayTrigger
            trigger="click"
            placement="right"
            overlay={
              <Popover>
                <Popover.Header>
                  <h4>
                    <b>LOGIN</b>
                  </h4>
                </Popover.Header>
                <Popover.Body>
                  <FloatingLabel label="이메일">
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      onChange={emailInputHandler}
                      required
                    />
                  </FloatingLabel>{' '}
                  <br />
                  <FloatingLabel label="비밀번호">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={pwInputHandler}
                      required
                    />
                  </FloatingLabel>{' '}
                  <br />
                  <Button
                    variant="success"
                    id="enter-login"
                    type="button"
                    onClick={onClickLogin}
                    className="btn"
                  >
                    로그인 하기
                  </Button>{' '}
                  <br />
                  <br />
                </Popover.Body>
              </Popover>
            }
          >
            <button id="login" type="button" className="btn">
              로그인
            </button>
          </OverlayTrigger>

          <a id="join" href="/join" className="btn">
            회원가입
          </a>
        </div>
      )}
    </div>
  );
}

export default Login;
