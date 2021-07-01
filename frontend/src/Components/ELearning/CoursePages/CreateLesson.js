import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

import { useFirebase } from '../../Utils/Firebase';


function CreateLesson(props) {
    let { courseId } = useParams();

    let firebase = useFirebase();
    let db = firebase.firestore();


    return (
        <div>
            <h2>create a new lesson here in {courseId} course</h2>
        </div>
    )
}

export default CreateLesson;
