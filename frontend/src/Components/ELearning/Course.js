import React, { useState, useEffect } from "react";
import { useFirebase } from '../Utils/Firebase';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useParams } from 'react-router-dom';


function Course(props) {
    let { courseId } = useParams();

    let firebase = useFirebase();
    let db = firebase.firestore();
    const [values, loading, error] = useCollectionDataOnce(db.collection("modules").where('courseId', '==', courseId));


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div>
            <h2>course id from url params {courseId}</h2>
            <p>{JSON.stringify(values)}</p>

        </div>
    )
}

export default Course;
