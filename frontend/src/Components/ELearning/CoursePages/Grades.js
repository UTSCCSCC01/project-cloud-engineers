import React, { useState, useEffect } from "react";
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useParams, Link, useRouteMatch } from 'react-router-dom';
import { useFirebase } from '../../Utils/Firebase';

//Rows styling template: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/dashboard/Orders.js

function Grades(props) {
    let user = JSON.parse(localStorage.getItem("user"));
    let { courseId } = useParams();
    let { url } = useRouteMatch();
    let firebase = useFirebase();
    let db = firebase.firestore();

    const [values, loading, error] = useCollectionDataOnce(db.collection("assignments").where('courseId', '==', courseId));

    function generateMarkup() {
        return (
            <table class="table is-fullwidth is-hoverable">
                <thead>
                    <tr>
                        <th>Assignment</th>
                        <th>Deadline</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {values.map((ass) => {
                        return (
                            <tr key={ass.assignmentId}>
                                <td>{ass.title}</td>
                                <td>{ass.duedate}</td>
                                <td><Link className="navbar-item button is-primary is-small" to={`${url}/${ass.assignmentId}/viewgrade/somehting`}>View Grades Summary</Link></td>
                            </tr>
                        )
                    })}

                </tbody>
            </table>
        )
    }


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div className="column is-10">
            {user.role === 'instructor' ?
                generateMarkup() : <div>this poage is not for you</div>
            }
            <Link className="App-link" to={'/home/e-learning/' + courseId}>Back to Course Homepage</Link>
        </div>
    )
}

export default Grades;
