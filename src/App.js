import React, { useState } from 'react';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import BookForm from './components/BookForm';

const App = () => {
  const [currentForm, setCurrentForm] = useState('login'); // Tracks current form displayed

  const navigateTo = (form) => {
    setCurrentForm(form);
  };

  return (
    <div style={styles.container}>
      {currentForm === 'login' && <LoginForm navigateTo={navigateTo} />}
      {currentForm === 'register' && <RegisterForm navigateTo={navigateTo} />}
      {currentForm === 'book' && <BookForm />}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f2f2f2',
  },
};

export default App;
