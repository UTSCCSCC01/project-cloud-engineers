import { Switch, Route, Link } from 'react-router-dom'

import Register from './Register';
import Login from './Login';

import logo from '../logo.svg';
import '../Styles/App.css';


function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path='/'>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p> Edit <code>src/App.js</code> and save to reload.</p>
            
            <Link className="App-link" to={`/register`}>Register</Link>
            <Link className="App-link" to={`/login`}>Login</Link>

          </header>
        </Route>
        <Route exact path='/register'>
          <Register />
        </Route>
        <Route exact path='/login'>
          <Login />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
