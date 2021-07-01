import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';

import { useFirebase } from '../../Utils/Firebase';


function CreateAssignment(props) {
    let { courseId } = useParams();
    let user = JSON.parse(localStorage.getItem("user"));
    
    let [formData, setFormData] = useState({ title: ''});
    let [modItems, setModItems] = useState([]);
    let [allItems, setAllItems] = useState([]);

    let firebase = useFirebase();
    let db = firebase.firestore();
    const [lessons, lessLoading, lessError] = useCollectionDataOnce(db.collection("lessons").where('courseId', '==', courseId));
    const [assigns, assLoading, assError] = useCollectionDataOnce(db.collection("assignments").where('courseId', '==', courseId));
    

    useEffect(() => {
        if (lessons && assigns) {
            console.log("here")
            let list = [];
            assigns.forEach((item) => {
                list.push({
                    ...item,
                    type: 'assignment'
                })
            })
            lessons.forEach((item) => {
                list.push({
                    ...item,
                    type: 'lesson'
                })
            })
            setAllItems(old => list);
        }
    }, [lessons, assigns])

    let handleChange = (e) => {
        setFormData((old) => {
            return ({
                ...old,
                [e.target.name]: e.target.value
            })
        });
    }

    let handleSubmit =  async (e) => {
        e.preventDefault();
        let modId = nanoid();
        // await firebase.firestore().collection('modules').doc(modId).set({
        //     ...formData,
        //     moduleId: modId,
        //     courseId: courseId,
        //     creatorId: user.userID,
        //     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        // });
        setFormData({ title: ''});
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="title" required />
                <p>{JSON.stringify(allItems)}</p>
                
                

                <input type="submit" value="Create Module" />

            </form>
            <h2>create a new mod here in {courseId} course</h2>
        </div>
    )
}

export default CreateAssignment;
