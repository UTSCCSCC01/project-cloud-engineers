import React, { useState, useEffect } from "react";
import { useFirebase } from '../Utils/Firebase';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { Switch, Route, useRouteMatch, Link, useParams, useLocation } from 'react-router-dom';

import Modules from './CoursePages/Modules';
import Assignments from './CoursePages/Assignments';
import CreateAssignment from './CoursePages/CreateAssignment';
import CreateLesson from './CoursePages/CreateLesson';

function Course(props) {
    let { courseId } = useParams();
    let { path } = useRouteMatch();
    let user = JSON.parse(localStorage.getItem("user"));
    

    let firebase = useFirebase();
    let db = firebase.firestore();
    const [values, loading, error] = useCollectionDataOnce(db.collection("modules").where('courseId', '==', courseId));


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <Switch>
            <Route exact path={path}>
                <div>
                <Link to={`${courseId}/modules`}>Modules</Link>
                <br />
                <Link to={`${courseId}/assignments`}>Assignments</Link>

                    <h2>course id from url params {courseId}</h2>
                    <p>we will show title nad description og this course here</p>

                    { user.role === 'instructor' ? 
                    <div>
                        <Link to={`${courseId}/create-assignment`}>Create New Assignment</Link>
                        <br />
                        <Link to={`${courseId}/create-lesson`}>Create New Lesson</Link>
                    </div> : 
                    <p>you are not instructor so you only see the options above</p>
                    }

                </div>
            </Route>
            <Route path={`${path}/modules`}>
                <Modules />
            </Route>
            <Route path={`${path}/assignments`}>
                <Assignments />
            </Route>
            <Route path={`${path}/create-assignment`}>
                <CreateAssignment />
            </Route>
            <Route path={`${path}/create-lesson`}>
                <CreateLesson />
            </Route>

        </Switch>

    )
}

export default Course;
