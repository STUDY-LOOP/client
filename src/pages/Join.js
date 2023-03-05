import { useState } from "react";
import axios from 'axios';

const SERVER_URI = 'http://localhost:3000';

function Join() {
    const [email, setEmail] = useState(null);
    const [nick, setNick] = useState(null);
    const [password, setPassword] = useState(null);

    const emailInputHandler = (event) => { event.preventDefault(); setEmail(event.target.value); };
    const nickInputHandler = (event) => { event.preventDefault(); setNick(event.target.value); };
    const pwInputHandler = (event) => { event.preventDefault(); setPassword(event.target.value); };

    const onClick = async () => {
        await axios
            .post(`${SERVER_URI}/api/user`, {
                email: email,
                userNick: nick,
                userPW: password,
            }, {
                withCredentials: true
            })
            .then(result => {
                if(result.data.code !== 0) alert('이미 존재하는 아이디입니다.');
                else {
                    alert('회원가입이 완료되었습니다. 로그인 후 이용해주세요.');
                    window.location.href = '/';
                }
            })
            .catch(err => alert(err));
    }

    return (
        <div className="timeline">
            <form>
                <div className="input-group">
                    <label htmlFor="email">이메일</label>
                    <input type="email" name="email" onChange={emailInputHandler} required />
                </div>
                <div className="input-group">
                    <label htmlFor="nickname">닉네임</label>
                    <input type="nickname" name="nickname" onChange={nickInputHandler} required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">비밀번호</label>
                    <input type="password" name="password" onChange={pwInputHandler} required />
                </div>
                <button id="join-btn" type="button" onClick={onClick} className="btn">회원가입</button>
            </form>
        </div>
    );
}

export default Join;