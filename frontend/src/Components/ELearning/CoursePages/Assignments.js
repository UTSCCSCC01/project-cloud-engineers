import React, { useState, useEffect } from "react";
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useParams } from 'react-router-dom';

import { useFirebase } from '../../Utils/Firebase';


function Assignments(props) {
    let { courseId } = useParams();

    let firebase = useFirebase();
    let db = firebase.firestore();
    const [values, loading, error] = useCollectionDataOnce(db.collection("modules").where('courseId', '==', courseId));


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div>
            <h2>shows all the assignments in this course</h2>
        </div>
    )
}

export default Assignments;
