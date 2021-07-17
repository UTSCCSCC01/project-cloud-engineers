import React, { useState, useEffect } from "react";
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useParams, Link, useRouteMatch } from 'react-router-dom';

//Rows styling template: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/dashboard/Orders.js

function GradeSubmission(props) {
  let assId = window.location.href.substring(window.location.href.lastIndexOf("/assignments/") + 13, window.location.href.lastIndexOf("/gradesubmission/"));
  let subId = window.location.href.substring(window.location.href.lastIndexOf("/gradesubmission/") + 17);
  let { courseId } = useParams();

  return (
    <div>
      <p>let instrcutor grade submission {subId} for assignment {assId}  in course {courseId}</p>
    </div>
  )
}

export default GradeSubmission;
