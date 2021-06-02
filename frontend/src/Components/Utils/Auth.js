import React, { useState, useContext, createContext } from "react";
import { Route, Redirect } from 'react-router-dom';
import { useFirebase } from './Firebase';
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
  const firebase = useFirebase();

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
    return setTimeout(() => {
      cb();
    }, 500);
  }

  return {
    user,
    signIn,
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