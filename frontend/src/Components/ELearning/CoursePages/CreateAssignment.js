import React, { useState, useEffect } from "react";
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useParams } from 'react-router-dom';

import { useFirebase } from '../../Utils/Firebase';


function CreateAssignment(props) {
    let { courseId } = useParams();

    let firebase = useFirebase();
    let db = firebase.firestore();

    return (
        <div>
            <h2>create a new assingment here in {courseId} course</h2>
        </div>
    )
}

export default CreateAssignment;
