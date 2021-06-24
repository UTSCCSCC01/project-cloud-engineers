import { Switch, Route, Link } from 'react-router-dom';
import { useAuth, PrivateRoute } from './Utils/Auth';
import Register from './External/Register';
import Login from './External/Login';
import Home from './Home/Home';
import Elearning from './ELearning/ELearning';
import Community from './Community/Community';
import Preincubation from './ELearning/Stages/Preincubation'
import Incubation from './ELearning/Stages/Incubation'
import ImpactAnalysis from './ELearning/Stages/ImpactAnalysis'
import Implementation from './ELearning/Stages/Implementation'
import Admin from "./Admin/Admin";
import logo from '../logo.svg';
import '../Styles/App.css';
import UserPreferences from './UserPreferences';


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
        
      </Switch>
    </div>
  );
}

export default App;
