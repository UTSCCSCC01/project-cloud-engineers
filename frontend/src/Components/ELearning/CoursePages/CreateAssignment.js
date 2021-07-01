import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { useFirebase } from '../../Utils/Firebase';


function CreateAssignment(props) {
    let { courseId } = useParams();
    let date = new Date();
    let user = JSON.parse(localStorage.getItem("user"));
    const [files, setFiles] = useState([]);
    let [formData, setFormData] = useState({ title: '', description: '', duedate: date.toISOString().slice(0, -1), expiry: date.toISOString().slice(0, -1) });
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

    async function uploadFile(fileObj) {
        let fileId = nanoid();
        let fileRef = firebase.storage().ref().child(fileId);
        await fileRef.put(fileObj);
        let Url = await fileRef.getDownloadURL();
        await firebase.firestore().collection('files').doc(fileId).set({
            fileId: fileId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uploaderId: user.userID,
            url: Url,
            name: fileObj.name,
            type: fileObj.type
            // privacy: pri,
        });
        return fileId;
    }

    let handleSubmit =  async (e) => {
        e.preventDefault();
        // first we deal with the files, list of promises that will resolve to list of fileIds
        let fileIds = await Promise.all(files.map(file => uploadFile(file)));
        // then we add the assignment with the file ids
        let assId = nanoid();
        await firebase.firestore().collection('assignments').doc(assId).set({
            ...formData,
            assignmentId: assId,
            courseId: courseId,
            creatorId: user.userID,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            files: fileIds
        });

        setFiles([]);
        setFormData({ title: '', description: '', duedate: date.toISOString().slice(0, -1), expiry: date.toISOString().slice(0, -1) });
    }

    function fileChange(e) {
        setFiles(old => {
            return ([...old, e.target.files[0]])
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
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="title" required />
                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="descrip" required />
                <br /> assignment due date <br />
                <input type="datetime-local" name="duedate" value={formData.duedate} onChange={handleChange} placeholder="Enter an email" required />
                <br /> assignment expiry date <br />
                <input type="datetime-local" name="expiry" value={formData.expiry} onChange={handleChange} placeholder="Enter an email" required />
                <br />
                <input ref={fileInput} onChange={fileChange} name="attachments" type="file" />
                <div>
                    <ul>
                        {Array.from(files).map(file => {
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
