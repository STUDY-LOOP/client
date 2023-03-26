import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

import PageLink from '../components/PageLink';
import StudyInfo from '../components/StudyInfo';
import Chat from '../components/Chat';
import Calendar from '../components/Calendar';

const SERVER_URI = 'http://localhost:3000';

function StudyMain() {
    const { gpId } = useParams();
    const userEmail = sessionStorage.getItem("user_email");

    const [loading, setLoading] = useState(true);
    const [studyInfo, setStudyInfo] = useState([]);
    const [studyMembers, setStudyMembers] = useState([]);
    let membersEmail = [];

    useEffect(() => {
        axios.all([
            axios.get(`${SERVER_URI}/api/${gpId}/info`),
            axios.get(`${SERVER_URI}/api/${gpId}/member`),
        ]).then(
            axios.spread((res1, res2) => {
                setStudyInfo(res1.data);
                setStudyMembers(res2.data);
                res2.data.map((m) => membersEmail.push(m.email));
                console.log(membersEmail.includes(userEmail))
                setLoading(false);
            })
        ).catch((err) => console.log(err));

    }, []);

    const onClickJoin = async () => {
        await axios
            .post(`${SERVER_URI}/api/group/member`, {
                gpId: gpId,
            })
            .then(res => res)
            .then(result => {
                if (result.data.code == 0) {
                    alert("스터디 그룹 가입 완료");
                    window.location.href = '/';
                }
            })
            .catch(err => alert(err));
    }

    return (
        <div>
            <div>
                <PageLink
                    link={'/'}
                    title={'메인화면으로'}
                />
            </div>

            <div>
                <StudyInfo
                    gpId={studyInfo.groupPublicId}
                    groupName={studyInfo.groupName}
                    members={studyMembers}
                />
            </div>
            
            <hr />
            <div>
              <Chat />
            </div>
            <hr />

            <Calendar />

            {/* 로그인 안했거나 || 스터디장이거나 || 스터디원이라면 -> 가입 불가 */}
            {userEmail===null || userEmail===studyInfo.groupLeader || membersEmail.includes(userEmail) ? null
                : <div>
                    <button type="button" onClick={onClickJoin}>스터디 가입하기</button>
                </div>
            }

            {userEmail === studyInfo.groupLeader?
            <button type="button" onClick="location.href='/study-group/{{groupPublicId}}/setting'">스터디 설정</button>
            : null}

            <div>
                <PageLink
                    link={`/study-group/${gpId}/member`}
                    title={'회원 관리'}
                /><br />
                <PageLink
                    link={`/study-group/${gpId}/assignment`}
                    title={'과제함'}
                /><br />
                <PageLink
                    link={`/study-group/${gpId}/videoChat`}
                    title={'화상회의'}
                />
            </div>      
      </div>
  );
}

export default StudyMain;
