import axios from 'axios';

const SERVER_URI = 'http://localhost:3000';

function MemberWithQuitBtn({ email, nick, gpId, leader }) { 
    const onClick = () => {
        //event.preventDefault();
        axios.delete(`${SERVER_URI}/api/member`, {
            data: {
                memberEmail: email,
                gpId: gpId,
            }
        });
    };

    return (
        <p>
            {nick}
            {email===sessionStorage.getItem('user_email')?<button onClick={onClick}>스터디 탈퇴하기</button>:null}
            {leader===sessionStorage.getItem('user_email')?<button onClick={onClick}>스터디 탈퇴시키기</button>:null}
        </p>
    )
}

export default MemberWithQuitBtn;