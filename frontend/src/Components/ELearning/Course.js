import React, { useState, useEffect } from "react";
import { useFirebase } from '../Utils/Firebase';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { Switch, Route, useRouteMatch, Link, useParams, useLocation } from 'react-router-dom';

import Modules from './CoursePages/Modules';
import Assignments from './CoursePages/Assignments';
import People from './CoursePages/People';
import CreateAssignment from './CoursePages/CreateAssignment';
import CreateLesson from './CoursePages/CreateLesson';
import CreateModule from './CoursePages/CreateModule';


import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';

function Course(props) {
    //https://material-ui.com/components/drawers/ Template for drawer component
    let { courseId } = useParams();
    let { path } = useRouteMatch();
    const drawerWidth = 240;

    let user = JSON.parse(localStorage.getItem("user"));
    
    let firebase = useFirebase();
    let db = firebase.firestore();
    const [values, loading, error] = useCollectionDataOnce(db.collection("courses").where('courseId', '==', courseId));

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerContainer: {
            overflow: 'auto',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
        }));

    const classes = useStyles();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <Switch>
            <Route exact path={path}>
                <div>
                    <div className={classes.root}>
                        <CssBaseline />
                        <AppBar position="fixed" className={classes.appBar}>
                            <Toolbar>
                            <Typography variant="h6" noWrap>
                                E-Learning
                            </Typography>
                            </Toolbar>
                        </AppBar>
                        <Drawer
                            className={classes.drawer}
                            variant="permanent"
                            classes={{
                            paper: classes.drawerPaper,
                            }}
                        >
                            <Toolbar />
                            <div className={classes.drawerContainer}>
                            <List>
                                <ListItem button>
                                    <Link className="App-link" to={'/home/e-learning'}>Back to E-Learning</Link>
                                </ListItem>
                            </List>
                            <Divider />
                            <List>
                                <ListItem button>
                                    <Link to={`${courseId}/modules`}>Modules</Link>
                                </ListItem>
                                <ListItem button>
                                    <Link to={`${courseId}/assignments`}>Assignments</Link>
                                </ListItem>
                                <ListItem button>
                                    <Link to={`${courseId}/people`}>People</Link>
                                </ListItem>
                            </List>
                            </div>
                        </Drawer>
                        <main className={classes.content}>
                            <Toolbar />
                            <Typography variant="h3">Welcome to {values[0].title}</Typography>
                            <br></br>
                            <Typography variant="h6">{values[0].description}</Typography>

                        </main>
                    </div>

                    { user.role === 'instructor' ? 
                    <div>
                        <Link to={`${courseId}/create-assignment`}>Create New Assignment</Link>
                        <br />
                        <Link to={`${courseId}/create-lesson`}>Create New Lesson</Link>
                        <br />
                        <Link to={`${courseId}/create-module`}>Create Module</Link>
                    </div> : true
                    }
                </div>
            </Route>
            <Route path={`${path}/modules`}>
                <Modules />
            </Route>
            <Route path={`${path}/people`}>
                <People />
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
            <Route path={`${path}/create-module`}>
                <CreateModule />
            </Route>

        </Switch>

    )
}

export default Course;
