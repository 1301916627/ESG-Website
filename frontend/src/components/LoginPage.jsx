import React, { useState } from 'react';
import styles from './SignUpPage.module.css';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log('Login submitted', { email, password });
        setError('');
        setIsLoading(true);

        try{
          const request = {
            email: email,
            password: password
          }
          console.log(request);
          const response = await fetch('http://localhost:5000/api/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json' 
              },
              body: JSON.stringify(request) ,  // 直接发送 FormData 对象
          });

          const data = await response.json();
          console.log('Login response:', data);

          if (data.result_code === 200) {
            console.log('Login successfully');

            // 保存token等信息到localStorage，如果有
            localStorage.setItem('userToken', data.token);
            navigate('/search'); // 跳转到登录成功后的页面
          } else {
            console.log('Login failed');
            setError(data.message || 'Login failed. Please try again.');
          }
        }catch(err){
            setError('An error occurred. Please try again later.');
            console.error('Login error:', err);
        }finally{
            setIsLoading(false);
        }
    };

    const handleClick = () => {
      navigate('/signup');
    }

    return(
        <div className={styles.signupPage}>
            <header className={styles.header}>
                <div className={styles.logo}>eCom platform</div>
                <nav>
                  <a href="#" className={styles.loginLink} onClick={handleClick}>Sign up </a>
                </nav>
            </header>
            <main className={styles.main}>
                <div className={styles.backgroundImage}></div>
                <form className={styles.signupForm} onSubmit={handleSubmit}>
                    <h2 className={styles.formTitle}>Log in</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    {error && <p className={styles.errorMessage}>{error}</p>}  {/* 错误提示 */}
                    <button type="submit" className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Log in'}
                    </button>
                </form>
            </main>
        </div>
    );

}

export default LoginPage;
