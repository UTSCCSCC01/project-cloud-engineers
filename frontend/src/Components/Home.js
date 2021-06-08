import { Switch, Route, Link, useRouteMatch, useHistory } from "react-router-dom";
import Admin from "./Admin";
import logo from '../logo.svg';
import '../Styles/App.css';

import { useAuth } from './Utils/Auth'

function Home() {
  let auth = useAuth();
  let history = useHistory();
  let { path, url } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/admin`}>
        <Admin/>
      </Route>
      <Route exact={path}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p> Add some shtings here</p>
            {
              // Render Admin setting only for admins.
              JSON.parse(localStorage.user).role === "admin" ? 
                <Link className="admin-link" to={`${path}/admin`}>Admin Settings</Link>
                :
                <></>
            }
            <a onClick={() => auth.signOut(() => history.push("/"))}><strong>Log Out</strong></a>
            
          </header>
        </div>
      </Route>
    </Switch>
  );
}

export default Home;
