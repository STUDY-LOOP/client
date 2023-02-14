import { useEffect, useState } from "react";

function EachAssignment({userId, title, assignment}){
    const [mine, setMine] = useState(false);

    useEffect(() => {
        assignment.map(
            (asgmt) => {
                if(userId === asgmt.uploader) setMine(true);
            }
        );
    }, []);
    

    return (
        <div>
            {title} : { mine ? "제출" : "미제출" }
        </div>
    )
}

export default EachAssignment;