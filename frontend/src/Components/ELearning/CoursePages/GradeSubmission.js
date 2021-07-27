import React, { useState, useEffect } from "react";
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useParams, Link, useRouteMatch } from 'react-router-dom';
import { useFirebase } from '../../Utils/Firebase';

//Rows styling template: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/dashboard/Orders.js

function GradeSubmission(props) {
    let { courseId, assId, subId } = useParams();
    let firebase = useFirebase();
    let db = firebase.firestore();
    let [formData, setFormData] = useState({ grade: '', comments: '' });

    const [values, loading, error] = useCollectionDataOnce(db.collection("submissions").where('submissionId', '==', subId));

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
        await firebase.firestore().collection('submissions').doc(subId).set({
            grade: formData.grade,
            comments: formData.comments
          }, {merge: true})
        setFormData({ grade: '', comments: '' });
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div>
            <p>KAIEN KAEIN let instrcutor grade submission {subId} for assignment {assId}  in course {courseId}</p>
            {values.map((submission) => {
                return (
                    <div>
                        <p>sub by {submission.userId} at {submission.createdAt.seconds}</p>
                        <p>current grade is "{submission.grade}" and comments are "{submission.comments}"</p>
                        <iframe src={submission.url} style={{ width: '300px', height: '400px' }} frameborder="0"></iframe>
                    </div>
                )
            })}
            <form onSubmit={handleSubmit}>
                <input type="text" name="grade" value={formData.grade} onChange={handleChange} placeholder="numerical grade" required />
                <input type="text" name="comments" value={formData.comments} onChange={handleChange} placeholder="put some feedback here" required />
                <input type="submit" value="Create Ass" />
            </form>
        </div>
    )
}

export default GradeSubmission;
