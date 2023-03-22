import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import AssignmentBox from '../components/AssignmentBox';
import EachAssignment from '../components/EachAssignment';

const SERVER_URI = 'http://localhost:3000';

function CalendarAssignment() {
    const { gpId, boxId } = useParams();
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        axios.all([
            axios.get(`${SERVER_URI}/api/${boxId}`),
            axios.get(`${SERVER_URI}/api/${gpId}/member`),
        ]).then(
            axios.spread((res1, res2) => {
                setAssignments(res1.data);
                setMembers(res2.data);
                setLoading(false);
            })
        ).catch((err) => console.log(err));
    }, []);

    return (
        <>
            <div>
                {loading ? <h3>LOADING...</h3> :
                    <AssignmentBox
                        gpId={gpId}
                        boxId={boxId}
                        title={assignments.title}
                        Assignments={assignments.Assignments}
                    />}
            </div>

            <div>
                {members.map(
                    member => (
                        <EachAssignment
                            userId={member.email}
                            userNick={member.userNick}
                            assignment={assignments.Assignments}
                        />
                    )
                )}
            </div>
        </>


    );
}

export default CalendarAssignment;