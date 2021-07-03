import React, { useState } from "react";
import { nanoid } from 'nanoid'
import { useHistory } from "react-router";
import { useFirebase } from '../Utils/Firebase';

function CreateCourse(props) {
    let [formData, setFormData] = useState({ title: '', description: '' });
    let history = useHistory();
    let firebase = useFirebase();
    let db = firebase.firestore();

    let handleSubmit = (e) => {
        e.preventDefault();

        let courseId = nanoid();
        db.collection('courses').doc(courseId).set({
            ...formData,
            courseId: courseId
        })
        .then((docRef) => {
            history.push('/home/e-learning');
        })
        .catch((error) => {
            console.log("Error:",error)
        });

        setFormData({ title: '', description: '' });
    }

    let handleChange = (e) => {
        setFormData((old) => {
            return ({
                ...old,
                [e.target.name]: e.target.value
            })
        });
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                title: <input type="text" name="title" onChange={handleChange} value={formData.title} />
                description: <input type="text" name="description" onChange={handleChange} value={formData.description} />
                <input type="submit" value="Create new course" />
            </form>
            <h2>form here that will create a new course eh?</h2>
        </div>
    )
}

export default CreateCourse;
