import React, { useState, useContext, createContext } from "react";
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';

const authContext = createContext();

function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

function useAuth() {
  return useContext(authContext);
}

function useAuthProvider() {
  const [user, setUser] = useState(null);

  const signUp = (details, cb) => {
    return axios.post('http://localhost:8080/register', details)
      .then((response) => {
        cb();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const signIn = (details, cb) => {
    return axios.post('http://localhost:8080/login', details)
      .then((response) => {
        // set the user info into state
        let user = { userID: response.data.userID, username: response.data.username };
        setUser(user);
        // store the JWT and user in localStorage
        localStorage.setItem("authToken", response.data.authToken);
        localStorage.setItem("user", JSON.stringify(user));
        cb();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const signOut = (cb) => {
    return axios.post('http://localhost:8080/logout', {}, {
      headers: {
        'Authorization': `token ${localStorage.getItem("authToken")}`
      }
    }).then((response) => {
      // set the local storage of auth and user to null
      localStorage.setItem("authToken", "");
      localStorage.setItem("user", "");
      setUser(null);
      cb();
    }).catch((error) => {
      console.error(error);
    });
  }

  return {
    user,
    signIn,
    signOut,
    signUp
  };
}

function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export {
  AuthProvider,
  PrivateRoute,
  useAuth
}