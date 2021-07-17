import React, { useState, useEffect } from "react";
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useParams, Link, useRouteMatch } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Alert from '@material-ui/lab/Alert';
import { useFirebase } from '../../Utils/Firebase';


//Rows styling template: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/dashboard/Orders.js

function Assignments(props) {
  let assId = window.location.href.substring(window.location.href.lastIndexOf("/assignments/") + 13, window.location.href.lastIndexOf("/submissions"));
  let { courseId } = useParams();

  return (
    <div>
      <p>{courseId}</p>
      <p>{assId}</p>
    </div>
  )
}

export default Assignments;
