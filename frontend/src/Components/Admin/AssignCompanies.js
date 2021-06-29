import React, { useState } from "react";
import { useFirebase } from "../Utils/Firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import { Typography, Button, Select, InputLabel, MenuItem, FormHelperText, FormControl, Snackbar } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 400,
    }
  }));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function AssignCompanies() {

    // This hook will re-render the componenet everytime the "user" collection changes on firebase.
    const firebase = useFirebase();
    const db = firebase.firestore();
    const [companies, loadingCompanies] = useCollectionData(db.collection('companies'));
    const [courses, loadingCourses] = useCollectionData(db.collection('courses'));
    
    //const founders = companies.map((company) => company.creatorID)) TODO

    // To keep track of the user and role selected in the drop down menu.
    const [selectedCompany, setSelecteCompany] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [successAlert, setSuccessAlert] = useState(false);
    const [failAlert, setFailAlert] = useState(false);
    const [infoAlert, setInfoAlert] = useState(false);
    const classes = useStyles();
    

    // Sort the users array. (This must be done here due to limitations of firebase query)
    if (!loadingCompanies && !loadingCourses) {
        companies.sort( (firstEle, secondElement) => {
            if (firstEle.name < secondElement.name) {
                return -1;
            }
            else if (firstEle.name > secondElement.name) {
                return 1;
            }
            else {
                return 0;
            };
        });
    }


    // When the success alert is closed
    const handleClose = (event, reason, type) => {
        if (reason === 'clickaway') {
          return;
        }
        
        switch (type) {
            case 0:
                setSuccessAlert(false);                
            case 1:
                setFailAlert(false);
            case 2:
                setInfoAlert(false);
            default:
                break;
        }
        setSuccessAlert(false);
    };

    // When form is submitted update firebase.
    const handleSubmit = () => {
        // For the case when form is not complete.
        if ((selectedCompany === "") || (selectedCourse === "")){
            return;
        }

        // If the new role selected is the same.
        if (courses[selectedCourse].courseID in companies[selectedCompany].courses) {
            console.log('This company is already enrolled in ', courses[selectedCourse].title , '! No updates required');
            setInfoAlert(true);
        }
        // send request to db to change role
        else {
            const membersNotInCourse = companies[selectedCompany].members
                .filter((memberID) => memberID in courses[selectedCourse].students);

            console.log('Enrolling memers of ', companies[selectedCompany].name, 'to course ', selectedCourse.title);
            Promise.all(
                //add courses to company (so future members can be easily added to course)
                db.collection('companies').doc(companies[selectedCompany].companyID).update( {
                courses: [...companies[selectedCompany].courses, selectedCourse.courseID]
            }), 
                //enroll members of company into course
                db.collection('courses').doc(courses[selectedCourse].courseID).upldate( {
                students: [...courses[selectedCourse].students, ...membersNotInCourse]
                }))
            .then(
                // on successful change
                (val) => {
                    console.log('Done update!', val);
                    setSuccessAlert(true);
                },
                // on non-sucessful change
                (err) => {
                    console.log('Could not update!', err);
                    setFailAlert(true);
                }
            );

            

            
        }
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Assign Courses to Company
            </Typography>

            <FormControl className={classes.formControl}>
                <InputLabel>Select a Company</InputLabel>
                <Select
                    autoWidth={true}
                    value={selectedCompany}
                    onChange={(event) => setSelecteCompany(event.target.value)}>

                    {
                        !loadingCompanies ? 
                        companies.map((company,index) => <MenuItem key={company.id} value={index}> {company.name} : {company.creatorID} </MenuItem>) 
                        : <MenuItem> </MenuItem> }

                </Select>
                <FormHelperText>The names beside each company are the founders of that company page</FormHelperText>
            </FormControl>

            <br></br>
            <FormControl className={classes.formControl}>
                <InputLabel>Select a Course</InputLabel>
                <Select 
                    autoWidth={true} 
                    value={selectedCourse}
                    onChange={(event) => setSelectedCourse(event.target.value)}
                    >
                    {
                        !loadingCourses ? 
                        courses.map((course,index) => <MenuItem key={course.id} value={index}> {course.title} : {course.description} </MenuItem>) 
                        : <MenuItem> </MenuItem> }
                
                </Select>
                <br></br>

            </FormControl>
            <br></br>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Enroll
            </Button>

            <Snackbar open={successAlert} autoHideDuration={1000} onClose={(event, reason) => handleClose(event, reason, 0)}>
                <Alert onClose={(event, reason) => handleClose(event, reason, 0)} severity="success">
                    Update Sucessful!
                </Alert>
            </Snackbar>

            <Snackbar open={failAlert} autoHideDuration={1000} onClose={(event, reason) => handleClose(event, reason, 1)}>
                <Alert onClose={(event, reason) => handleClose(event, reason, 1)} severity="error">
                    Something went wrong!
                </Alert>
            </Snackbar>

            <Snackbar open={infoAlert} autoHideDuration={1000} onClose={(event, reason) => handleClose(event, reason, 2)}>
                <Alert onClose={(event, reason) => handleClose(event, reason, 2)} severity="info">
                    The company selected is already enrolled in this course!
                </Alert>
            </Snackbar>
           
        </div>
    );

}

export default AssignCompanies;
