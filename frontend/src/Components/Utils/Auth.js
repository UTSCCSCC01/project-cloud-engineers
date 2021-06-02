import React, { useState, useContext, createContext } from "react";
import { Route, Redirect } from 'react-router-dom';
import { useFirebase } from './Firebase'

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
    console.log(details);
    // first check if this user already exists
    firebase.firestore().collection("users").where("email", "==", details.email).get()
      .then((querySnapShot) => {
        console.log(querySnapShot);
      })
      .catch(err => {
        console.log(err)
      })
    // setTimeout(() => {
    //   cb();
    // }, 1000)
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