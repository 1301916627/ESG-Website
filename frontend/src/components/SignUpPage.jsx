import React, { useState } from 'react';
import styles from './SignUpPage.module.css';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add signup logic here
    console.log('Sign up submitted', { email, name, password });
  };

  const navigate = useNavigate();

  const handleClick = () => {
      navigate('/login');
  }


  return (
    <div className={styles.signupPage}>
      <header className={styles.header}>
        <div className={styles.logo}>eCom platform</div>
        <nav>
          <a href="#" className={styles.loginLink} onClick={handleClick} >Log in</a>
        </nav>
      </header>
      <main className={styles.main}>
        <div className={styles.backgroundImage}></div>
        <form className={styles.signupForm} onSubmit={handleSubmit}>
          <h2 className={styles.formTitle} >Sign up</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.submitButton}>Sign up</button>
        </form>
      </main>
    </div>
  );
};

export default SignUpPage;