import { Link } from 'react-router-dom';

function PageLink({ link, title }) {
  return <Link to={`${link}`}>{title}</Link>;
}

export default PageLink;
