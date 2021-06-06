import { Link } from 'react-router-dom'
import { useHistory } from "react-router-dom";
import '../Styles/App.css';

import { useAuth } from './Utils/Auth';

function UserPreferences() {
  let auth = useAuth();
  let history = useHistory();
  
  return (
    <div className="App">
        <header className="App-header">
            <Link class="App-link" to={'/home'}>Back to Home</Link>
            <h3>Update Fields here</h3>
        </header>
    </div>
  );
}

export default UserPreferences;
