import { TextInput } from '@molecules//textInput/TextInput';
import { useContext, useState } from 'react';
import styles from './Login.module.scss';
import { axiosInstance } from 'network/axiosInstance';
import { AppContext } from 'contexts/AppContext';

export const Login = () => {
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  const { setCurrentRoute } = useContext(AppContext);

  const loginInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'loginEmail') {
      setLoginEmail(value);
    } else if (name === 'loginPassword') {
      setLoginPassword(value);
    }
  };

  const loginUser = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const response = await axiosInstance.post('/login', {
      email: loginEmail,
      password: loginPassword
    });

    if (response.status === 200) {
      setCurrentRoute('providePdf');
    }
  };

  return <div className={styles['login__container']}>
    <div className={styles['login__contents']}>
      <h3 style={{ textAlign: 'center' }}>Exam Builder</h3>

      <h4 style={{ textAlign: 'center' }}>Login</h4>

      <TextInput label='Email' name='loginEmail' value={loginEmail} onChange={loginInputChange} />

      <br />

      <TextInput label='Password' name='loginPassword' value={loginPassword} onChange={loginInputChange} />

      <br />

      <button type='button' onClick={loginUser} style={{ width: '100%' }}>Login</button>
    </div>
  </div>;
};