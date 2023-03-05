import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import AssignmentBox from '../components/AssignmentBox';

const SERVER_URI = 'http://localhost:3000';

function StudyMember(){
    
    const { gpId } = useParams();
    const [loading, setLoading] = useState(true);

    const [studyInfo, setStudyInfo] = useState([]);
    const [assignments, setAssignments] = useState([]);

    const [log, setLog] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [deadline, setDeadline] = useState("");
    
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

    const logHandler = (event) => { event.preventDefault(); setLog(event.target.value); };
    const titleHandler = (event) => { event.preventDefault(); setTitle(event.target.value); };
    const contentHandler = (event) => { event.preventDefault(); setContent(event.target.value); };
    const deadlineHandler = (event) => { event.preventDefault(); setDeadline(event.target.value); };


    const onSubmit = async () => {     
        const formData = new FormData();
        formData.append('log', log);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('deadline', deadline);
        
        await axios.post(`${SERVER_URI}/api/assignmentBox`, formData);
    };

    return (
        <div>
            <form onSubmit={onSubmit} method="post">
                <input type="hidden" value="{{groupPublicId}}" name="gpId" /> <br />
                log <input type="input" onChange={logHandler} /> <br />
                title <input type="input" onChange={titleHandler} /> <br />
                content <input type="input" onChange={contentHandler} /> <br /> 
                deadline <input type="input" onChange={deadlineHandler} /> <br />
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