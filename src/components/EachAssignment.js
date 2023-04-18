import { useEffect, useState } from "react";

function EachAssignment({userId, assignment}){
    const [mine, setMine] = useState(false);

    useEffect(() => {
        assignment.map(
            (asgmt) => {
                if(userId === asgmt.uploader) setMine(true);
            }
        );
    }, []);
    

    return (
        <td>
            { mine ? "O" : "X" }
        </td>
    )
}

export default EachAssignment;