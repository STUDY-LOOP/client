import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tooltip, Button, OverlayTrigger } from 'react-bootstrap';

const SERVER_URI =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.202.121:3000/'
    : 'http://localhost:3000/';

function AssignmentName({ gpId }) {
  const [events, setEvents] = useState([]);

  const callApi = async () => {
    const response = await axios.get(`${SERVER_URI}/api/${gpId}/event/title`);
    setEvents(response.data);

    console.log(response.data);
  };

  useEffect(() => {
    callApi();
  }, []);

  return (
    <>
      {events.map((event) => (
        <td>
          <OverlayTrigger
            key={event.id}
            placement="top"
            overlay={<Tooltip>{event.event_title}</Tooltip>}
          >
            <b>
              {new Date(event.date_start).getMonth() + 1}/
              {new Date(event.date_start).getDate()}
            </b>
          </OverlayTrigger>
        </td>
      ))}
    </>
  );
}

export default AssignmentName;
