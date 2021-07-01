import React, { useState, useEffect } from "react";
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useParams, Link } from 'react-router-dom';

import { useFirebase } from '../../Utils/Firebase';


function Assignments(props) {
    let { courseId } = useParams();
    let user = JSON.parse(localStorage.getItem("user"));

    let firebase = useFirebase();
    let db = firebase.firestore();
    const [values, loading, error] = useCollectionDataOnce(db.collection("modules").where('courseId', '==', courseId));


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div>
            {user.role === 'instructor' ?
                <div>
                    <p> You are instructor: you can also go back and add a new assignment</p>
                </div> :
                <p>you are not instructor so you only see the assignment list</p>
            }

            <h2>shows all the assignments in this course</h2>
        </div>
    )
}

export default Assignments;
