import { useEffect, useState } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";

function CreateStudyBtn() {

    const [user, setUser] = useState(sessionStorage.getItem("user_nick"));

    // useEffect(() => {
    //     setUser()    
    // }, [user]);

    return (
        <>
            {user
                ? <div>
                    <form action="/study-group" method="get">
                        <Button type="submit">스터디 만들기</Button>
                    </form>
                </div>
                : <>로그인 안 된 상태</>}
        </>
    )
}

export default CreateStudyBtn;