import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import UserAssignment from '../components/UserAssignment';
import MemberWithQuitBtn from '../components/MemberWithQuitBtn';

const SERVER_URI = 'http://localhost:3000';

function StudyMember(){
    
    const { gpId } = useParams();
    const [loading, setLoading] = useState(true);

    const [studyInfo, setStudyInfo] = useState([]);
    const [studyMembers, setStudyMembers] = useState([]);
    const [assignments, setAssignments] = useState([]);
    


    useEffect(() => {
        axios.all([
            axios.get(`${SERVER_URI}/api/${gpId}/info`),
            axios.get(`${SERVER_URI}/api/${gpId}/member`),
            axios.get(`${SERVER_URI}/api/${gpId}/assignment`),
        ]).then(
            axios.spread((res1, res2, res3) => {
                setStudyInfo(res1.data);
                setStudyMembers(res2.data);
                setAssignments(res3.data);
                setLoading(false);
            })
        ).catch((err) => console.log(err));
    }, []);

    

    return (
        <div>
            [스터디장] {studyInfo.groupLeader} <br/><br/>
            
            <div>
                [스터디원]

                {studyMembers.map((member) => 
                    <MemberWithQuitBtn
                        key={member.email}
                        email={member.email}
                        nick={member.userNick}
                        gpId={studyInfo.groupPublicId}
                    />
                )}
            </div>

            <hr/>

            <div>
                {loading ? <h3>LOADING...</h3> : studyMembers.map(
                    (member) => 
                        <UserAssignment
                            email={member.email}
                            nick={member.userNick}
                            gpId={studyInfo.groupPublicId}
                        />
                    
                )}
            </div>
        </div>
    );
}

export default StudyMember;