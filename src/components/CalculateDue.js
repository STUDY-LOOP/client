import { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge } from 'react-bootstrap';

const SERVER_URI =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.202.121:3000'
    : 'http://localhost:3000';

function CalculateDue({ describe, inputDate }) {
  const [newYear, setYear] = useState();
  const [newMonth, setMonth] = useState();
  const [newDate, setDate] = useState();
  const [newHour, setHour] = useState();
  const [newMin, setMin] = useState();
  const [gap, setGap] = useState();

  useEffect(() => {
    const submitted = new Date(inputDate);
    const nowD = new Date();
    setGap(nowD.getTime() - submitted.getTime());

    setYear(submitted.getFullYear());
    setMonth(submitted.getMonth() + 1);
    setDate(submitted.getDate());
    setHour(submitted.getHours());
    setMin(submitted.getMinutes());
  }, []);

  return (
    <>
      <Badge pill bg="primary">
        과제 설명
      </Badge>{' '}
      {describe} <br />
      {gap < 0 ? (
        <>
          <Badge pill bg="primary">
            제출 마감
          </Badge>{' '}
          {newYear}년 {newMonth}월 {newDate}일, {newHour}시 {newMin}분
        </>
      ) : (
        <>
          <Badge pill bg="secondary">
            제출 마감
          </Badge>{' '}
          {newYear}년 {newMonth}월 {newDate}일, {newHour}시 {newMin}분
        </>
      )}
    </>
  );
}

export default CalculateDue;
