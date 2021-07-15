import React, { useState, useEffect } from "react";
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useParams, Link } from 'react-router-dom';

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
    let { courseId } = useParams();
    let user = JSON.parse(localStorage.getItem("user"));
    let [curAss, setAss] = useState([]);
    const useStyles = makeStyles((theme) => ({
        seeMore: {
          marginTop: theme.spacing(3),
        },
      }));
    let firebase = useFirebase();
    let db = firebase.firestore();
    const [values, loading, error] = useCollectionDataOnce(db.collection("assignments").where('courseId', '==', courseId));


    useEffect(()=>{
        if(values){
            values.forEach((assignment)=>{
                let newAssignment= {};
                newAssignment.title = assignment.title;
                
                let test = Date.parse(assignment.duedate);
                let date = new Date(test * 1000);
      
                let dueDate = (date.getDate()+
                  "/"+(date.getMonth()+1)); 
                newAssignment.duedate = dueDate;


                setAss(oldArray => [...oldArray, newAssignment]);
            })
        }
    },[values]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;


    function generateMarkup(markupArray){
        return(
            <React.Fragment>
            <Alert severity="info">Assignment Information!</Alert>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Assignment</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell align="right">Weight</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {markupArray.map((ass) => (
                  <TableRow key={ass.assignmentId}>
                    <TableCell>{ass.duedate}</TableCell>
                    <TableCell>{ass.title}</TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell align="right">N/A</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </React.Fragment>
        )
    }
    return (
        <div>
            {user.role === 'instructor' ?
                <div>
                    <p> You are instructor: you can also go back and add a new assignment</p>
                </div> :  generateMarkup(curAss)
            }
            <Link className="App-link" to={'/home/e-learning/'+courseId}>Back to Course Homepage</Link>
        </div>
    )
}

export default Assignments;
