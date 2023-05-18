import { useNavigate, Link } from 'react-router-dom';

import Login from './Login';
import './style/LayoutMain.css';

const SERVER_URI =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.202.121:3000/'
    : 'http://localhost:3000/';

function LayoutMain() {
  const navigate = useNavigate();

  const onClickTitle = () => {
    navigate('/');
  };

  return (
    <div id="div-layout-black">
      <h1 onClick={onClickTitle}>
        <b>
          STUDY <br />
          LOOP
        </b>
      </h1>
      <Login />
    </div>
  );
}

export default LayoutMain;
