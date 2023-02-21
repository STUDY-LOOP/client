import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SERVER_URI = 'http://localhost:3000';

function Layout({ participatingCount }) {

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [userNick, setUserNick] = useState(null);

    const callApi = async() => {
        const response = axios.get(`${SERVER_URI}/api/user/info`);
        console.log(response);
        console.log(response.data);
        //setStudies(response.data);
        //setLoading(false);
    };

    useEffect(()=>{
        callApi();
    }, []);


    const emailInputHandler = (event) => { event.preventDefault(); setEmail(event.target.value); };
    const pwInputHandler = (event) => { event.preventDefault(); setPassword(event.target.value); };


    const onSubmit = async (event) => {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        //console.log(formData);

        await axios
            .post(`${SERVER_URI}/api/login`, {
                email: event.target.email.value,
                password: event.target.password.value,
                }, { 
                    //'Content-Type': 'application/json', withCredentials: false 
                });
            // .then(async (res, req) => {
            //     const response = await axios.get(`${SERVER_URI}/api/user/info`, {
            //         //withCredentials: false,
            //     });
            //     console.log(response);
            //     //setUserNick(response.data.userinfo.userNick);
            // });
            // .then((res, req) => {
            //     console.log(res.data);
            //     //console.log(res.data);
            //     //let { userNick } = res.data.data;
            //     //setUserNick(userNick);
            // })
            // .catch((err) => alert(err));

        //let { email2, userNick } = userinfo.data;
        //setUserNick(userNick);
    // };
    }

    

    return (
        <div className="profile-wrap">
            <div className="profile">
                {userNick !== null

                    ? <div>
                        <div className="user-name">{`안녕하세요! ${userNick}님`}</div>
                        <div className="study-info">
                            <div>참여중인 스터디</div>
                            <div className="count participating-count">
                                {`${participatingCount}개`}
                            </div>
                        </div>
                        <input id="my-id" type="hidden" value={email} />
                        <a id="my-profile" href="/my/profile" className="btn">마이페이지</a>
                        <a id="logout" href="/auth/logout" className="btn">로그아웃</a>
                    </div>

                    : <form id="login-form" onSubmit={onSubmit} method="post" action="/api/login">
                        <div className="input-group">
                            <label htmlFor="email">이메일</label>
                            <input type="email" name="email" onChange={emailInputHandler} required autoFocus />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">비밀번호</label>
                            <input type="password" name="password" onChange={pwInputHandler} required />
                        </div>
                        <a id="join" href="/join" className="btn">회원가입</a>
                        <button id="login" type="submit" className="btn">로그인</button>
                    </form>
                }

            </div>
        </div>
    )
}

export default Layout;