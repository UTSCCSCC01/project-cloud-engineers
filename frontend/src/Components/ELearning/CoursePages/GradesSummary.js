import React, { useState, useEffect } from "react";
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useParams, Link, useRouteMatch } from 'react-router-dom';
import { useFirebase } from '../../Utils/Firebase';

//Rows styling template: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/dashboard/Orders.js

function GradesSummary(props) {
    let user = JSON.parse(localStorage.getItem("user"));
    let { courseId, assId } = useParams();
    let { url } = useRouteMatch();
    let firebase = useFirebase();
    let db = firebase.firestore();

    const [values, loading, error] = useCollectionDataOnce(db.collection("submissions").where('assgnId', '==', assId));


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div className="column is-10">
            {user.role === 'instructor' ?
                <div>show grades summary for this assignment</div> : <div>this poage is not for you</div>
            }
            <Link className="App-link" to={'/home/e-learning/' + courseId}>Back to Course Homepage</Link>
        </div>
    )
}

export default GradesSummary;
