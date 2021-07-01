import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';

import { useFirebase } from '../../Utils/Firebase';


function CreateAssignment(props) {
    let { courseId } = useParams();
    let user = JSON.parse(localStorage.getItem("user"));

    let [formData, setFormData] = useState({ title: '' });
    let [modItems, setModItems] = useState([]);
    let [allItems, setAllItems] = useState([]);

    let firebase = useFirebase();
    let db = firebase.firestore();
    const [lessons, lessLoading, lessError] = useCollectionDataOnce(db.collection("lessons").where('courseId', '==', courseId));
    const [assigns, assLoading, assError] = useCollectionDataOnce(db.collection("assignments").where('courseId', '==', courseId));


    useEffect(() => {
        if (lessons && assigns) {
            let list = [];
            assigns.forEach((item) => {
                list.push({
                    id: item.assignmentId,
                    title: item.title,
                    type: 'assignment'
                })
            })
            lessons.forEach((item) => {
                list.push({
                    id: item.lessonId,
                    title: item.title,
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

    let handleSubmit = async (e) => {
        e.preventDefault();
        let modId = nanoid();
        await firebase.firestore().collection('modules').doc(modId).set({
            ...formData,
            moduleId: modId,
            courseId: courseId,
            creatorId: user.userID,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            items: modItems
        });
        setFormData({ title: '' });
        setModItems([]);
    }

    function handleAdd(e) {
        setModItems(old => {
            return ([...old, {
                id: e.target.id,
                type: e.target.getAttribute('data-type'),
                title: e.target.getAttribute('data-title'),
            }])
        });
    }

    function handleDelete(e) {
        setModItems(old => {
            return modItems.filter(item => item.id !== e.target.id);
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="title" required />
                <p>module items:</p>
                <ul>
                    {modItems.map((item) => {
                        return (
                            <li id={item.id}>
                                {item.title} -- {item.type} --
                                <a href="#" id={item.id} data-title={item.title} data-type={item.type} onClick={handleDelete}>delete from module</a>
                            </li>
                        )
                    })
                    }
                </ul>

                <input type="submit" value="Create Module" />


                <ul>
                    {allItems.filter((item) => {
                        return (!(modItems.map(item => item.id).includes(item.id)))
                    }).map((item) => {
                        return (
                            <li id={item.id}>
                                {item.title} -- {item.type} --
                                <a href="#" id={item.id} data-title={item.title} data-type={item.type}  onClick={handleAdd}>add to module</a>
                            </li>
                        )
                    })
                    }
                </ul>



                

            </form>
            <h2>create a new mod here in {courseId} course</h2>
        </div>
    )
}

export default CreateAssignment;
