import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      首页 <Link to="/login">登录</Link>
    </div>
  );
}
