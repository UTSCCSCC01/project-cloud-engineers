import { Switch, Route, Link } from 'react-router-dom'

import Register from './Register';
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

          </header>
        </Route>
        <Route exact path='/register'>
          <Register />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
