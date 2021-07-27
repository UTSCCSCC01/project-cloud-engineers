import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { useFirebase } from '../../Utils/Firebase';


function CreateAssignment(props) {
    let { courseId } = useParams();
    let user = JSON.parse(localStorage.getItem("user"));
    const [files, setFiles] = useState([]);
    let [formData, setFormData] = useState({ title: '', description: '', content: '' });
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

    let handleSubmit = async (e) => {
        e.preventDefault();
        // first we deal with the files, list of promises that will resolve to list of fileIds
        let fileIds = await Promise.all(files.map(file => uploadFile(file)));
        // then we add the assignment with the file ids
        let lessId = nanoid();
        await firebase.firestore().collection('lessons').doc(lessId).set({
            ...formData,
            lessonId: lessId,
            courseId: courseId,
            creatorId: user.userID,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            files: fileIds
        });

        setFiles([]);
        setFormData({ title: '', description: '', content: '' });
    }

    function fileChange(e) {
        setFiles(old => {
            return ([...old, e.target.files[0]])
        });
    }

    function fileDelete(e) {
        setFiles(old => {
            return Array.from(old).filter(fileObj => fileObj.name !== e.target.id);
        })
    }

    return (
        <div className="column is-8 is-offset-1">
            <h1 className="is-size-4 has-text-left has-text-weight-medium">Create A New Lesson</h1>
            <form onSubmit={handleSubmit}>
                
                <div class="field is-horizontal">
                    <div class="field-label is-normal">
                        <label class="label">Title</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                            <input type="text" class="input" name="title" value={formData.title} onChange={handleChange} placeholder="ex Lesson 1 - BEDMAS" required />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field is-horizontal">
                    <div class="field-label is-normal">
                        <label class="label">Question</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                            <textarea class="textarea" name="content" value={formData.content} onChange={handleChange} placeholder="Lesson Content" required />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="file is-boxed">
                    <label class="file-label">
                        <input ref={fileInput} class="file-input" onChange={fileChange} name="attachments" type="file" />
                        <span class="file-cta">
                            <span class="file-icon">
                                <i class="fas fa-upload" />
                            </span>
                            <span class="file-label">
                                Add files…
                            </span>
                        </span>
                    </label>
                </div>
                <div class="control">
                    <button class="button is-primary">Create</button>
                </div>

                <div>
                    <ul>
                        {Array.from(files).map(file => {
                            return (
                                <li>{file.name} <a id={file.name} href='#' onClick={fileDelete}>remove file</a></li>
                            )
                        })}
                    </ul>
                </div>
            </form>
        </div>
    )
}

export default CreateAssignment;
