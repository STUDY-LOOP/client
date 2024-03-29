import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

import LayoutMain from '../components/LayoutMain';
import StudyList from '../components/StudyList';
import SearchResult from '../components/SearchResult';
import './style/Common.css';
import './style/Main.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, CardGroup, Col, Row, Carousel, Modal, Container } from 'react-bootstrap';
import { Hidden } from '@mui/material';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigationIcon from '@mui/icons-material/Navigation';

const SERVER_URI =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.202.121:3000'
    : 'http://localhost:3000';
const DIVIDER_HEIGHT = 5;

function Main() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [studies, setStudies] = useState([]);
  const [user, setUser] = useState(sessionStorage.getItem('user_nick'));
  const [keyword, setKeyword] = useState(null);
  const [noResult, setNoResult] = useState(true);
  const [searchModal, setSearchModal] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  const imgNum = [1, 2, 3];
  const imgUrl1 = `cover/main${imgNum[0]}.jpg`;
  const imgUrl2 = `cover/main${imgNum[1]}.jpg`;
  const imgUrl3 = `cover/main${imgNum[2]}.jpg`;

  // const onChageSearch = (e) => {
  //   setKeyword(e.target.value);
  // };
  const onClickSearch = async () => {
    let keyword = document.getElementById('input-search').value;
    const result = await axios.get(`${SERVER_URI}/api/search/${keyword}`);
    if (result !== null) {
      setSearchResult(result.data);
      setNoResult(false);
    }
    setSearchModal(true);
  };

  const callApi = async () => {
    const response = await axios.get(`${SERVER_URI}/api/study/all`);
    setStudies(response.data);
    setLoading(false);
  };

  useEffect(() => {
    callApi();
  }, []);

  useEffect(() => {
    setUser(sessionStorage.getItem('user_nick'));
  }, [sessionStorage.getItem('user_nick')]);

  const onClickCreate = () => {
    navigate('/group/create');
  };

  return (
    <div class="div-layout-upper">
      <div class="div-layout-lower-1">
        <LayoutMain />
      </div>

      <div id="div-scroll-main" class="div-layout-lower-2">
        <Modal
          size="lg"
          show={searchModal}
          onHide={() => setSearchModal(false)}
          aria-labelledby="modal-search-result"
        >
          <Modal.Header closeButton>
            <Modal.Title id="modal-search-result">
              {keyword} 검색 결과
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {noResult ? (
              <>검색 결과가 없습니다. </>
            ) : (
              searchResult &&
              searchResult.map((rst) => (
                <SearchResult
                  gpId={rst.groupPublicId}
                  groupName={rst.groupName}
                  groupLeader={rst.groupLeader}
                  groupDesc={rst.groupDescription}
                />
              ))
            )}
          </Modal.Body>
        </Modal>

        <div id="div-scroll-main-child">
          <div id="div-search">
            <div id="div-search-input-btn">
              <h1>
                <b>스터디 준비부터 진행까지</b>
              </h1>
              <h3>새로운 스터디를 시작하세요!</h3> <br />
                
              <input
                id="input-search"
                type="search"
                placeholder="관심있는 스터디를 검색하세요"
                // onChange={onChageSearch}
              />
              <Button variant="success" style={{ marginLeft: '20px' }} onClick={onClickSearch}>
                검색
              </Button>

            </div>
          </div>
          <div class="divider"></div>
          <Container fixed id="div-list-groups">
            <Row xs={2} md={3} lg={4} xl={4} id="row-main">
              {loading ? (
                <Button variant="secondary" onClick={() => window.location.reload()} size="sm">새로고침</Button>
                // <h3>LOADING...</h3>
              ) : (
                studies.map((study) => (
                  <>
                    <Col className="col-3">
                      <StudyList
                        key={study.gpId}
                        gpId={study.groupPublicId}
                        groupName={study.groupName}
                        groupDesc={study.groupDescription}
                      />
                    </Col>
                  </>
                ))
              )}
            </Row>
          </Container>{' '}

          <br />
          <br />
          {user ? (
            <div id="div-btn-to-create-study">
              <Fab variant="extended" color="success" href="/group/create">
                <AddIcon sx={{ mr: 1 }} />
                스터디 만들기
              </Fab>
            </div>
          ) : (
            <div id="div-btn-to-create-study">
              <Fab variant="extended" color="success" href="/group/create">
                <AddIcon sx={{ mr: 1 }} />
                스터디 만들기
              </Fab>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;
