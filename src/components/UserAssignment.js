import { useEffect, useState } from "react";
import axios from 'axios';

import EachAssignment from './EachAssignment';

const SERVER_URI = 'http://localhost:3000';

function UserAssignment({ email, nick, gpId }){

    const [assignmentBoxes, setAssignmentBoxes] = useState([]);

    const callApi = async() => {
        const response = await axios.get(`${SERVER_URI}/api/${gpId}/assignment`);
        setAssignmentBoxes(response.data);
    };

    useEffect(()=>{
        callApi();
    }, []);
    

    return (
        <div>
            <p><b>{nick}</b></p>

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
        </div>
    )
}

export default UserAssignment;