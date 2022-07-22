import { Fragment } from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
function App() {
  return (
    <Fragment>
      <Navbar/>
      {window.location.pathname==='/' && <Landing/>}
      {window.location.pathname==='/register.html' && <Register/>}
    </Fragment>
  );
}

export default App;
