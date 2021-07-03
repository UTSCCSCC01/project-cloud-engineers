import React, { useEffect } from "react";
import { Switch, Route, Link, useHistory } from 'react-router-dom';
import { useAuth, PrivateRoute } from './Utils/Auth';

import Register from './External/Register';
import Login from './External/Login';
import Home from './Home/Home';
import logo from '../logo.svg';
import '../Styles/App.css';



function App() {
  let auth = useAuth();
  let history = useHistory();

  useEffect(() => {
    auth.checkSession(() => {
      history.push('/home');
    });
  }, []);

  return (
    <div className="App">
      <Switch>
        <Route exact path='/'>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p> Edit <code>src/App.js</code> and save to reload.</p>
            
            <Link className="App-link" to={`/register`}>Register</Link>
            <Link className="App-link" to={`/login`}>Login</Link>
            <Link className="App-link" to={`/home`}>try go home but cant, log in first</Link>

          </header>
        </Route>
        <Route exact path='/register'>
          <Register />
        </Route>
        <Route exact path='/login'>
          <Login />
        </Route>
        <PrivateRoute path="/home">
          <Home />
        </PrivateRoute>
      </Switch>
    </div>
  );
}

export default App;
