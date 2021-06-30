import React, { useState, useEffect } from "react";
import { nanoid } from 'nanoid'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';

import { useFirebase } from '../Utils/Firebase';

function CreateCourse(props) {
    let [formData, setFormData] = useState({title:'', description:''});

    let firebase = useFirebase();
    let db = firebase.firestore();

    let handleSubmit = (e) => {
        //
    }
    

    return (
        <div>
            <form>
                <input type="text" name="title" />
                <input type="text" name="description" />
            </form>
            <h2>form here that will create a new course eh?</h2>
        </div>
    )
}

export default CreateCourse;
