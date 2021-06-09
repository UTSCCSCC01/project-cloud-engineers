import { Switch, Route, Link } from 'react-router-dom';
import { useAuth, PrivateRoute } from './Utils/Auth';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import Elearning from './ELearning/ELearning';
import Community from './Community/Community';
import Admin from "./Admin/Admin";
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
        <PrivateRoute path="/community">
          <Community/>
        </PrivateRoute>
        <PrivateRoute path="/e-learning">
          <Elearning/>
        </PrivateRoute>
        <PrivateRoute path="/admin">
          <Admin/>
        </PrivateRoute>
      </Switch>
    </div>
  );
}

export default App;
