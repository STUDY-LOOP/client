import axios from 'axios';

const SERVER_URI = 'http://localhost:3000';

function StudyMain(){
    const onSubmit = (event) => {

        event.preventDefault();
        axios.post(`${SERVER_URI}/api/group`, {
            groupName: document.getElementById('create-title').value,
            rule: document.getElementById('create-rule').value,
            scheduleDay: document.getElementById('create-day').value,
            scheduleHour: document.getElementById('create-hour').value,
            scheduleMinute: document.getElementById('create-min').value,
        });
    };

    return (
        <div className="timeline">
            {/* <form id="create-form" action="group" method="post"> */}
            <form id="createForm" onSubmit={onSubmit}>
                <div className="input-group">
                    <label htmlFor="create-title">스터디명</label>
                    <input id="create-title" type="text" name="groupName" require="true" />
                </div>
                <div className="input-group">
                    <label htmlFor="create-rule">스터디 규칙</label>
                    <input id="create-rule" type="text" name="rule" required />
                </div>
                <div className="input-group">
                    <label htmlFor="create-day">스터디 요일</label>
                    <select id="create-day" name="scheduleDay" required>
                        <option value="Mon">월</option>
                        <option value="Tue">화</option>
                        <option value="Wed">수</option>
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="create-hour">스터디 시간</label>
                    <select id="create-hour" name="scheduleHour" required>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                    </select>시
                </div>
                <div className="input-group">
                    <label htmlFor="create-min">스터디 시간</label>
                    <select id="create-min" name="scheduleMinute" required>
                        <option value="00">00</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>분
                </div>
                {/* <button id="create-btn" type="submit" className="btn">스터디 생성</button> */}
                <button id="create-btn">스터디 생성</button>
            </form>
        </div>
    );
}

export default StudyMain;