import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { useFirebase } from '../../Utils/Firebase';


function CreateAssignment(props) {
    let { courseId } = useParams();
    let user = JSON.parse(localStorage.getItem("user"));
    let [formData, setFormData] = useState({ title: '', description: '' });

    let firebase = useFirebase();
    let db = firebase.firestore();


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
        await firebase.firestore().collection('modules').doc(modId).set({
            ...formData,
            moduleId: modId,
            courseId: courseId,
            creatorId: user.userID,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        
        setFormData({ title: '', description: '' });
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="title" required />
                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="descrip" required />
                
                <br />
                

                <input type="submit" value="Create Module" />

            </form>
            <h2>create a new mod here in {courseId} course</h2>
        </div>
    )
}

export default CreateAssignment;
