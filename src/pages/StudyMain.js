import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import PageLink from '../components/PageLink';
import StudyInfo from '../components/StudyInfo';
import Calendar from '../components/Calendar';

const SERVER_URI = 'http://localhost:3000';

function StudyMain() {
    const { gpId } = useParams();

    const [loading, setLoading] = useState(true);
    const [studyInfo, setStudyInfo] = useState([]);
    const [studyMembers, setStudyMembers] = useState([]);

    useEffect(() => {
        axios.all([
            axios.get(`${SERVER_URI}/api/${gpId}/info`),
            axios.get(`${SERVER_URI}/api/${gpId}/member`),
        ]).then(
            axios.spread((res1, res2) => {
                setStudyInfo(res1.data);
                setStudyMembers(res2.data);
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

            <Calendar />

            {sessionStorage.getItem("user_nick") !== null
                ? <div>
                    <button type="button" onClick={onClickJoin}>스터디 가입하기</button>
                </div>
                : <div/>
            }


            <div>
                <button type="button" onClick="location.href='/study-group/{{groupPublicId}}/setting'">스터디 설정</button> <br />
            </div>

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