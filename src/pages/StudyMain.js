import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
//import { useDispatch } from 'react-redux';
import axios from 'axios';

import StudyInfo from '../components/StudyInfo';
import PageLink from '../components/PageLink';

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
            
        </div>
    );
}

export default StudyMain;