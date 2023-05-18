import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// table UI
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { typography } from '@mui/system';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const SERVER_URI =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.202.121:3000/'
    : 'http://localhost:3000/';

function MemberAttendance() {
  const { gpId } = useParams();
  const [attendance, setAttendance] = useState([]);

  const callApi = async () => {
    const res = await axios.get(`${SERVER_URI}/api/${gpId}/attendance`);
    console.log(res.data);
    setAttendance(res.data);
  };

  useEffect(() => {
    callApi();
  }, []);

  return (
    <div>
      <TableContainer sx={{ width: 400 }} component={Paper}>
        <Table stickyHeader="true">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  typography: 'body1',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                이름
              </TableCell>
              <TableCell
                sx={{
                  typography: 'body1',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                출석
              </TableCell>
              <TableCell
                sx={{
                  typography: 'body1',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                지각
              </TableCell>
              <TableCell
                sx={{
                  typography: 'body1',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                결석
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.map((row) => (
              <TableRow
                key={row.User.userNick}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ textAlign: 'center' }}
                >
                  {row.User.userNick}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {row.attendCnt}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {row.lateCnt}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {row.absentCnt}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default MemberAttendance;
