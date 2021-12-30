import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './index.module.less';
import { useAuth } from '../../components/AuthProvider';

export default function Login() {
  let auth = useAuth();
  let navigate = useNavigate();
  let location = useLocation();
  function submit(event) {
    event.preventDefault();
    let formData = new FormData(event.currentTarget);
    let username = formData.get('username');
    let password = formData.get('password');
    let from = location.state && location.state.from ? location.state.from.pathname || '/' : '/';
    auth.signin({ username, password }, () => {
      // Send them back to the page they tried to visit when they were
      // redirected to the login page. Use { replace: true } so we don't create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won't end up back on the login page, which is also really nice for the
      // user experience.
      navigate(from, { replace: true });
    });
  }
  return (
    <form onSubmit={submit}>
      <div className={styles.login}>
        <div className={styles.formItem}>
          <label>Username:</label>
          <input type="text" name="username" placeholder="Username" />
        </div>
        <div className={styles.formItem}>
          <label>Password:</label>
          <input type="text" name="password" placeholder="Input your password" />
        </div>
        <button type="submit" className={styles.btn}>
          Login
        </button>
      </div>
    </form>
  );
}
