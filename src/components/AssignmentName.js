import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tooltip, Button, OverlayTrigger } from 'react-bootstrap';

const SERVER_URI =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.202.121:3000/'
    : 'http://localhost:3000/';

function AssignmentName({ gpId }) {
  const [assignmentBoxes, setAssignmentBoxes] = useState([]);

  const callApi = async () => {
    const response = await axios.get(`${SERVER_URI}/api/${gpId}/assignment`);
    setAssignmentBoxes(response.data);
  };

  useEffect(() => {
    callApi();
  }, []);

  return (
    <>
      {assignmentBoxes.map((asgmt) => (
        <td>
          <OverlayTrigger
            key={asgmt.boxId}
            placement="top"
            overlay={<Tooltip>{asgmt.title}</Tooltip>}
          >
            <b>
              {new Date(asgmt.deadline).getMonth() + 1}/
              {new Date(asgmt.deadline).getDate()}
            </b>
          </OverlayTrigger>
        </td>
      ))}
    </>
  );
}

export default AssignmentName;
