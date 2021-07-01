import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';

import { useFirebase } from '../../Utils/Firebase';


function CreateAssignment(props) {
    let { courseId } = useParams();
    let date = new Date();
    
    const [files, setFiles] = useState([]);
    let [formData, setFormData] = useState({ title: '', description: '', duedate: date.toISOString() , expiry: date.toISOString()});
    const fileInput = useRef();

    let firebase = useFirebase();
    let db = firebase.firestore();

    useEffect(() => {
        fileInput.current.value = '';
    }, [files]);

    let handleChange = (e) => {
        setFormData((old) => {
            return ({
                ...old,
                [e.target.name]: e.target.value
            })
        });
    }

    let handleSubmit = (e) => {
        e.preventDefault();
        // Array.from(files).map(file => addImage(file, privacy));
        console.log(formData);
        console.log(files);

        setFiles([]);
        setFormData({ title: '', description: '', duedate: date.toLocaleTimeString() , expiry: date.toLocaleTimeString() });
    }

    function fileChange(e) {
        setFiles(old => {
            return([...old, e.target.files[0]])
        });
    }

    function fileDelete(e) {
        console.log(e.target.id);
        setFiles(old => {
            return Array.from(old).filter(fileObj => fileObj.name !== e.target.id);
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="title" required/>
                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="descrip" required />
                <br /> assignment due date <br />
                <input  type="datetime-local" name="duedate" value={formData.duedate} onChange={handleChange} placeholder="Enter an email" required/>
                <br /> assignment expiry date <br />
                <input  type="datetime-local" name="expiry" value={formData.expiry} onChange={handleChange} placeholder="Enter an email" required/>
                <br />
                <input ref={fileInput} onChange={fileChange} name="attachments" type="file"/>
                <div>
                    <ul>
                        { Array.from(files).map(file => {
                            return (
                                <li>{file.name} <a id={file.name} href='#' onClick={fileDelete}>remove file</a></li>
                            )
                        })}
                    </ul>
                </div>

                <input type="submit" value="Create Ass" />

                {/* <input type="text" name="" value={} onChange={handleChange} placeholder="Enter an email" required/> */}
            </form>
            <h2>create a new assingment here in {courseId} course</h2>
        </div>
    )
}

export default CreateAssignment;
