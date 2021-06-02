import React, { useState, useContext, createContext } from "react";
import { Route, Redirect } from 'react-router-dom';

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
    setTimeout(() => {
      cb();
    }, 1000)
  };

  return {
    user,
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