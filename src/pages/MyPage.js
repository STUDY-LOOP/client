import { useEffect, useState } from "react";
import Modal from 'react-modal';
import axios from 'axios';

import PageLink from '../components/PageLink';

const SERVER_URI = 'http://localhost:3000';

function MyPage() {
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState(null);
    const [asLeader, setAsLeader] = useState([]);
    const [asMember, setAsMember] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [nick, setNick] = useState(null);
    const [password, setPassword] = useState(null);
    const nickInputHandler = (event) => { event.preventDefault(); setNick(event.target.value); };
    const pwInputHandler = (event) => { event.preventDefault(); setPassword(event.target.value); };

    const email = sessionStorage.getItem('user_email');

    useEffect(() => {
        axios.all([
            axios.get(`${SERVER_URI}/api/user/${email}/info`),
            axios.get(`${SERVER_URI}/api/user/${email}/leader`),
            axios.get(`${SERVER_URI}/api/user/${email}/member`),
        ])
            .then(axios.spread((res1, res2, res3) => {
                setInfo(res1.data);
                setAsLeader(res2.data);
                setAsMember(res3.data.StudyGroups);
                setLoading(false);
            }))
            .catch((err) => console.log(err));
    }, []);

    const handleModal = () => {
        setModalIsOpen(true);
    }

    const onClickEdit = () => {

    }

    return (
        <>{loading ? <h3>LOADING...</h3> :
            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => { setModalIsOpen(false); }}
                    ariaHideApp={false}
                >
                    <form>
                        <label htmlFor="nickname">닉네임</label>
                        <input type="text" name="nickname" onChange={nickInputHandler} value={info.userNick} required />
                        <label htmlFor="password">비밀번호</label>
                        <input type="password" name="password" onChange={pwInputHandler} required />

                        <button onClick={onClickEdit}>수정하기</button>
                    </form>
                </Modal>

                <h3>내 정보</h3>
                아이디: {info.email} <br />
                닉네임: {info.userNick} <br />
                <button id="btn-edit" type="button" onClick={handleModal}>개인정보 수정하기</button>
                <hr />

                <h3>내가 만든 스터디</h3>
                {!asLeader ? <>만든 스터디가 없습니다</> : <>
                    {asLeader.map((study) =>
                        <><PageLink
                            link={`/study-group/${study.groupPublicId}`}
                            title={study.groupName}
                        /> <br /> </>
                    )}
                </>}
                <hr />

                <h3>내가 가입한 스터디</h3>
                {!asMember ? <>가입한 스터디가 없습니다</> : <>
                    {asMember.map((study) =>
                        <><PageLink
                            link={`/study-group/${study.groupPublicId}`}
                            title={study.groupName}
                        /> <br /> </>
                    )}
                </>}
                <hr />

                <h3>내가 제출한 과제</h3>

            </div>
        }</>
    );
}

export default MyPage;