import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table } from 'react-bootstrap';

import Submitted from '../components/SubmittedAssignment';
import AssignmentName from '../components/AssignmentName';

import './style/AssignmentBox.css';

const SERVER_URI =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.202.121:3000'
    : 'http://localhost:3000';

function AssignmentResult({ summary, isAsgmt }) {
  return (
    <>
      {isAsgmt ? (
        <>
          {summary &&
            summary.map((row) => (
              <>
                {row.submitState === 0 ? (
                  <td>O</td>
                ) : (
                  <>
                    {row.submitState === 1 ? (
                      <td>지각</td>
                    ) : (
                      <>{row.submitState === -1 ? <td>X</td> : <td></td>}</>
                    )}
                  </>
                )}
              </>
            ))}
        </>
      ) : (
        <>
          {summary &&
            summary.map((row) => (
              <>
                {row.attendState === 0 ? (
                  <td>O</td>
                ) : (
                  <>
                    {row.attendState === 1 ? (
                      <td>지각</td>
                    ) : (
                      <>{row.attendState === -1 ? <td>X</td> : <td></td>}</>
                    )}
                  </>
                )}
              </>
            ))}
        </>
      )}
    </>
  );
}

export default AssignmentResult;
