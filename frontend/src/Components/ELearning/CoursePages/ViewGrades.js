import React, { useState, useEffect } from "react";
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useParams, Link, useRouteMatch } from 'react-router-dom';
import { useFirebase } from '../../Utils/Firebase';

//Rows styling template: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/dashboard/Orders.js

function ViewGrades(props) {
  let user = JSON.parse(localStorage.getItem("user"));
  let { courseId, assId, subId } = useParams();
  let firebase = useFirebase();
  let db = firebase.firestore();

  const [values, loading, error] = useCollectionDataOnce(db.collection("submissions").where('submissionId', '==', subId));

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="column is-10">
      {user.role === 'instructor' ?
        <div>this instructor show a list of grades for and avgs and sit for thia ass</div> : <div>student want to look at his feedback fir this sub</div>
      }
      <Link className="App-link" to={'/home/e-learning/' + courseId}>Back to Course Homepage</Link>
    </div>
  )
}

export default ViewGrades;
