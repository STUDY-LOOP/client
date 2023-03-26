import { useState } from "react";
import axios from 'axios';

const SERVER_URI = 'http://localhost:3000';

function Layout() {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const emailInputHandler = (event) => { event.preventDefault(); setEmail(event.target.value); };
    const pwInputHandler = (event) => { event.preventDefault(); setPassword(event.target.value); };

    const onClickLogin = async () => {
        await axios
            .post(
                `${SERVER_URI}/api/user/login`, 
                { 
                    email: email, 
                    password: password 
                },
                { withCredentials: true })
            .then(result => {
                if (result.data.code !== 0) alert("아이디 혹은 비밀번호가 틀렸습니다");
                else {
                    alert(`${result.data.user_nick}님 환영합니다!`);
                    sessionStorage.setItem('user_email', result.data.user_email);
                    sessionStorage.setItem('user_nick', result.data.user_nick);
                    sessionStorage.setItem('preTab', -1);
                    window.location.href = '/';

                }
            })
            .catch(err => alert(err));
    }

    const onClickLogout = async () => {
        await axios.get(`${SERVER_URI}/api/user/logout`);
        sessionStorage.removeItem('user_email');
        sessionStorage.removeItem('user_nick');
        window.location.href = "/";
    }

    return (
        <div className="profile">
            {sessionStorage.getItem("user_nick") !== null

                ? <div>
                    <div className="user-name">{`안녕하세요! ${sessionStorage.getItem("user_nick")}님`}</div>
                    <a id="my-profile" href="/my/profile" className="btn">마이페이지</a>&nbsp;
                    <button type="button" onClick={onClickLogout} className="btn">로그아웃</button>
                </div>

                : <form>
                    <div className="input-group">
                        <label htmlFor="emailInput">이메일</label>
                        <input type="email" name="emailInput" onChange={emailInputHandler} required autoFocus />
                    </div>
                    <div className="input-group">
                        <label htmlFor="pwInput">비밀번호</label>
                        <input type="password" name="pwInput" onChange={pwInputHandler} required />
                    </div>
                    <a id="join" href="/join" className="btn">회원가입</a>
                    <button id="login" type="button" onClick={onClickLogin} className="btn">로그인</button>
                </form>
            }

        </div>
    )
}

export default Layout;