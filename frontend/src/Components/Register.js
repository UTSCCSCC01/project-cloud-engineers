import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from './Utils/Auth';


function Register(props) {
  let auth = useAuth();
  let history = useHistory();

  const [info, setInfo] = useState({ username: "", email: "", password: "" });

  const signUp = e => {
    e.preventDefault();
    auth.signUp(info, () => {
      history.push('/login');
    });
  }

  return (
    <form>

      <input type="text" name="username" autoComplete="on" id="username" placeholder="Enter a username" required
        onChange={e => setInfo({ ...info, username: e.target.value })}/>

      <input type="text" name="email" autoComplete="on" id="email" placeholder="Enter an email" required
        onChange={e => setInfo({ ...info, email: e.target.value })} />

      <input type="password" name="password" autoComplete="on" id="password" placeholder="Enter a password" required
        onChange={e => setInfo({ ...info, password: e.target.value })} />

      <button id="signup" onClick={signUp} name="action">Sign up</button>
    </form>

  )
}


export default Register;
