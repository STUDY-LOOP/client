import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import PageLink from '../components/PageLink';
import AssignmentBox from '../components/AssignmentBox';

const SERVER_URI = 'http://localhost:3000';

function CalendarAssignment() {
    const { gpId, boxId } = useParams();
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState([]);

    const callApi = async () => {
        await axios.get(`${SERVER_URI}/api/${boxId}`)
            .then((res) => {
                setAssignments(res.data);
                setLoading(false);
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        callApi();
    }, []);

    return (
        <>
            {loading ? <h3>LOADING...</h3> :
            <AssignmentBox
                gpId={gpId}
                boxId={boxId}
                title={assignments.title}
                Assignments={assignments.Assignments}
            />}
        </>
    );
}

export default CalendarAssignment;