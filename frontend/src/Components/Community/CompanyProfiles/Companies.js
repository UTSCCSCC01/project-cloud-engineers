import React, { useState } from 'react'
import Company from './Company';
import '../../../Styles/Companies.css'
import { useFirebase } from "../../Utils/Firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import { nanoid } from 'nanoid';

function AddCompany({onClose, open}) {

    const [company, setCompany] = useState('');
    const [mission, setMission] = useState('');

    return (
        <Dialog open={open} onClose={() => onClose(company, mission, false)} aria-labelledby="form-dialog-title">

            <DialogTitle id="form-dialog-title">Create a new company</DialogTitle>

            <DialogContent>

                <DialogContentText>
                    Fill out the information below to create a new company.
                </DialogContentText>

                <TextField
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Company Name"
                    fullWidth
                />

                <TextField
                    value={mission}
                    onChange={ (e) => setMission(e.target.value) }
                    autoFocus
                    margin="dense"
                    id="mission"
                    label="Mission Statement"
                    fullWidth
                />

            </DialogContent>

            <DialogActions>
                <Button onClick={() => onClose(company, mission, false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={ () => onClose(company, mission, true)} color="primary">
                    Create
                </Button>
            </DialogActions>

        </Dialog>

    )
}


function Companies() {
    // This hook will re-render the componenet everytime the "user" collection changes on firebase.
    const firebase = useFirebase();
    const db = firebase.firestore();
    const userID = JSON.parse(localStorage.user).userID;
    const [company, loading] = useCollectionData(db.collection('companies').where('members', 'array-contains-any', [userID]));

    const [open, setOpen] = useState(false);

    const handleClose = (company, mission, flag) => {
        console.log(company, mission, flag)
        setOpen(false);
        // If the flag is false then user just clicked cancel
        if (!flag) return;

        // Check if the data is given is valid
        if ((company.length == 0) || (mission.length == 0)) return;

        // Add the company to database
        const companyID = nanoid()
        const companyDb = {
            companyId: companyID,
            courses: [],
            creatorId: userID,
            members: [userID],
            mission: mission,
            name: company,
            stage: 0
        }
        db.collection('companies').doc(companyID).set(companyDb)
        // On success
        .then((val) => {
            console.log("Added", company, "to firebase!")
        })
        // On Error
        .catch((val) => {
            console.log("Could not add", company, ":", val)
        });
        
    }

    // First determine if the user is in a company.
    console.log(company);
    if (loading) return (<h1>  Loading </h1>);

    return (
        <div className='companies_container'>  
            {/* If the user is a part of a company display the company info, otherwise display the option
            to create a new company */}
            { 
            company.length != 0 ?
                <Company name={company[0].name} mission={company[0].mission}/> 
            :
                <>
                    <h3>You are not apart of any company!</h3>
                    <Button variant="contained" onClick={() => setOpen(true)}>Add a company</Button>
                </>
            }
            
            {/* Pop form to create a new company. */}
            <AddCompany open={open} onClose={handleClose}/>
            
            <br/>
            <Button variant="contained" onClick={() => console.log('Joining a new company')}>Join another company</Button>

        </div>
    );
}

export default Companies
