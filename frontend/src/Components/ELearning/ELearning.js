import React, { useState, useEffect } from "react";
import { useFirebase } from '../Utils/Firebase';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import Course from './Course';
import Card from '../Home/Card';

function Elearning() {
  let { path, url } = useRouteMatch();

  let firebase = useFirebase();
  let db = firebase.firestore();
  let user = JSON.parse(localStorage.getItem("user"));

  const [values, loading, error] = useCollectionDataOnce(db.collection("stages"));
  const [visStages, setStages] = useState([]);
  const [visStageSteps, setStageSteps] = useState([]);



  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Switch>
      <Route exact path={path}>
      <div className="home__page">
          <div className="selectionPage">
            <Card
              imgSrc="https://www.elegantthemes.com/blog/wp-content/uploads/2020/06/Divi-Community-Update-May-2020-scaled.jpg"
              title="test course"
              description="yea eh"
              linkPath={`${path}/test`}
              buttonText="Go to course"
            />
          </div>
        </div>
      </Route>

      <Route path={`${path}/test`}>
        <Course title="test course cameing from learning" />
      </Route>

    </Switch>
  )
}

export default Elearning
