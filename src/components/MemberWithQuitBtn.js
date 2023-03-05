import axios from 'axios';

const SERVER_URI = 'http://localhost:3000';

function MemberWithQuitBtn({ email, nick, gpId }) { 
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
            {nick} <button onClick={onClick}>스터디 탈퇴하기</button>
        </p>
    )
}

export default MemberWithQuitBtn;