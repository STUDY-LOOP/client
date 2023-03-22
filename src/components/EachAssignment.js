import { useEffect, useState } from "react";

function EachAssignment({userId, title, assignment, userNick}){
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
            {title? title: userNick} : { mine ? "제출" : "미제출" }
        </div>
    )
}

export default EachAssignment;