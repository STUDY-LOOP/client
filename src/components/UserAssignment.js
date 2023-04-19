import { useEffect, useState } from "react";
import axios from 'axios';

import EachAssignment from './EachAssignment';

const SERVER_URI = 'http://localhost:3000';

function UserAssignment({ email, nick, gpId }) {

    const [assignmentBoxes, setAssignmentBoxes] = useState([]);
    const [total, setTotal] = useState(0);
    let submitted=0, mine;

    const callApi = async () => {
        const response = await axios.get(`${SERVER_URI}/api/${gpId}/assignment`);
        setAssignmentBoxes(response.data);

        submitted = 0;
        {response.data.map(
            box => {
                mine = false;
                box.Assignments.map(file => { if (email === file.uploader) mine = true; })
                if(mine) submitted += 1;
            }
        )}
        setTotal(response.data.length-submitted);
    };

    useEffect(() => {
        callApi();
    }, []);


    return (
        <tr>
            <td><b>{nick}</b></td>

            {assignmentBoxes.map(
                asgmt => (
                    <EachAssignment
                        key={email}
                        userId={email}
                        title={asgmt.title}
                        assignment={asgmt.Assignments}
                    />
                )
            )}

            <td><b>{total}회</b></td>
        </tr>
    )
}

export default UserAssignment;