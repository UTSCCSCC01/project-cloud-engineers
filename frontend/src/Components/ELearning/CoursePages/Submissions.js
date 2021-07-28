import React, { useState, useEffect } from "react";
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useParams, Link, useRouteMatch } from 'react-router-dom';
import { useFirebase } from '../../Utils/Firebase';

//Rows styling template: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/dashboard/Orders.js

function Submissions(props) {
  let { courseId, assId } = useParams();
  let { url } = useRouteMatch();
  let firebase = useFirebase();
  let db = firebase.firestore();

  const [values, loading, error] = useCollectionDataOnce(db.collection("submissions").where('assignId', '==', assId));

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="column is-10">
      <table class="table  is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>submitting student id</th>
            <th>submission id</th>
            <th>submission time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {values.map((sub) => {
            return (
              <tr key={sub.submissionId}>
                <td>{sub.userId}</td>
                <td>{sub.submissionId}</td>
                <td>{sub.createdAt.seconds}</td>
                <td><Link className="navbar-item button is-primary is-small" to={`${url.replace('submissions', 'gradesubmission')}/${sub.submissionId}`}>Grade Submission</Link></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Submissions;
