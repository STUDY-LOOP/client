import { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import PageLink from '../components/PageLink';
import StudyInfo from '../components/StudyInfo';

const SERVER_URI = 'http://localhost:3000';

function StudyMain(){
    const { gpId } = useParams();

    //const dispatch = useDispatch();
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

            <div>
                <PageLink
                    link={`/study-group/${gpId}/member`}
                    title={'회원 관리'}
                /><br/>
                <PageLink
                    link={`/study-group/${gpId}/assignment`}
                    title={'과제함'}
                /><br/>
                <PageLink
                    link={`/study-group/${gpId}/videoChat`}
                    title={'화상회의'}
                />
            </div>
            
        </div>
    );
}

export default StudyMain;