import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from '../Utils/Auth';

function Login(props) {
  const [form, updateForm] = useState({ email: "", password: "" });
  let history = useHistory();
  let auth = useAuth();

  function handleFormChange(e) {
    let newState = {
      ...form,
    };
    newState[e.target.id] = e.target.value;
    updateForm(newState);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    auth.signIn(form, () => {
      history.push('/home');
    });
    updateForm({ email: "", password: "" });
  }

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <input placeholder="hello@example.com" autoComplete="username"
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleFormChange}
          required />
        <input placeholder="**********" autoComplete="current-password"
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleFormChange}
          required />

        <button type="submit">Login</button>
      </form>
      <br />
      <div className="level-item has-text-centered">
        <div>
          <Link to={`/`}>Forgot Password?</Link>
        </div>
      </div>
      <div className="level-item has-text-centered">
        <div>
          <Link to={`/register`}>Create Account</Link>
        </div>
      </div>
    </>
  );
}

export default Login;

