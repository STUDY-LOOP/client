import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import AssignmentBox from '../components/AssignmentBox';

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
            axios.get(`${SERVER_URI}/api/${gpId}/assignment`),
        ]).then(
            axios.spread((res1, res2) => {
                setStudyInfo(res1.data);
                setAssignments(res2.data);
                setLoading(false);
            })
        ).catch((err) => console.log(err));
    }, []);

    

    return (
        <div>
            <form id="form" action="/group/assignmentBox" method="post">
                <input type="hidden" value="{{groupPublicId}}" name="gpId" /> <br />
                log <input type="input" name="log" /> <br />
                title <input type="input" name="title" /> <br />
                content <input type="input" name="content" /> <br /> 
                deadline <input type="input" name="deadline" /> <br />
                <button type="submit">과제함 생성</button>
            </form>

            <hr/>

            <div>
                {loading ? <h3>LOADING...</h3> : assignments.map(
                    (assignment) => 
                        <AssignmentBox
                            gpId={gpId}
                            boxId={assignment.boxId}
                            title={assignment.title}
                            Assignments={assignment.Assignments}
                        />
                    
                )}
            </div>            
        </div>
    );
}

export default StudyMember;