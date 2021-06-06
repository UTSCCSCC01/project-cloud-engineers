import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

import logo from '../logo.svg';
import '../Styles/App.css';

import { useAuth } from './Utils/Auth'

function Home() {
  let auth = useAuth();
  let history = useHistory();
  
  return (
    <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p> Add some shtings here</p>

            <a onClick={() => auth.signOut(() => history.push("/"))}><strong>Log Out</strong></a>
            <Link class="App-link" to={'/user-preferences'}>Update Profile</Link>
            
          </header>
    </div>
  );
}

export default Home;
