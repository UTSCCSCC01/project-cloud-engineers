import React, { useState, useEffect } from "react";
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useParams, Link, useRouteMatch } from 'react-router-dom';
import { useFirebase } from '../../Utils/Firebase';

//Rows styling template: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/dashboard/Orders.js

function Submissions(props) {
  let assId = window.location.href.substring(window.location.href.lastIndexOf("/assignments/") + 13, window.location.href.lastIndexOf("/submissions"));
  let { courseId } = useParams();
  let firebase = useFirebase();
  let db = firebase.firestore();

  const [values, loading, error] = useCollectionDataOnce(db.collection("submissions").where('assignId', '==', assId));

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <p>show all submission for assignment {assId} to this instructor in course {courseId}</p>
      <table class="table">
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
                <td><Link className="navbar-item button is-primary is-small" to={'/home/e-learning/' + courseId + '/assignments/' + assId + '/gradesubmission/' + sub.submissionId}>Grade Submission</Link></td>
              </tr>
            )
          })}

          {/* <tr>
            <td>38</td>
            <td>Qualification for the <a href="https://en.wikipedia.org/wiki/2016%E2%80%9317_UEFA_Champions_League#Group_stage" title="2016–17 UEFA Champions League">Champions League group stage</a></td>
            <td><Link className="navbar-item button is-primary is-small" to={'/home/e-learning/' + courseId + '/assignments/' + assId + '/gradesubmission/' + '646464'}>Grade Submissions</Link></td>
            <td><a className="button is-primary is-small">View Submissions</a></td>
          </tr> */}

        </tbody>
      </table>
    </div>
  )
}

export default Submissions;
