import React, { useEffect, useState } from 'react'
import Company from './Company';
import '../../../Styles/Companies.css'
import { useFirebase } from "../../Utils/Firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItem, List, ListItemText} from "@material-ui/core";
import { nanoid } from 'nanoid';

function JoinCompany({onClose, open, userId, update, db}) {
    
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        async function fetchData() {
            let newCompanies = [];
            await db.collection('companies').get().then( querySnapshot => {
                querySnapshot.docs.map( doc => {
                    if (!doc.data().members.includes(userId)) {
                        newCompanies.push(doc.data())
                    }
                })
                setCompanies(newCompanies);
            })
        }
        fetchData(); 
    }, [update]);

    return (
        <Dialog onClose={() => onClose('', false)} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Join a company</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Select the company you want to join.
                </DialogContentText>
            </DialogContent>
            <List>
                {companies.map((company) => (
                    <ListItem button onClick={() => onClose(company.companyId, true)} key={company.companyId}>
                        <ListItemText primary={`${company.name} (${company.companyId})`} />
                    </ListItem>
                ))}
            </List>
            <DialogActions>
                <Button onClick={() => onClose('', false)} color="primary">
                    Cancel
                </Button>
            </DialogActions>
      </Dialog>
    );
}


// Pop-up form for adding a company
function AddCompany({onClose, open}) {

    // To keep track of the values the user entered.
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

    const [addOpen, setAddOpen] = useState(false);
    const [joinOpen, setJoinOpen] = useState(false);

    // Handler for the submitting the form.
    const handleAddClose = (company, mission, flag) => {
        console.log(company, mission, flag)
        setAddOpen(false);
        // If the flag is false then user just clicked cancel
        if (!flag) return;

        // Check if the data is given is valid
        if ((company.length === 0) || (mission.length === 0)) return;

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

    const handleJoinClose = (companyId, flag) => {
        setJoinOpen(false);
        // If the flag is false then user just clicked cancel
        if (!flag) return;

        const oldCompany = company[0].companyId;

        // Add user to new company
        db.collection('companies').doc(companyId).update({
            members: firebase.firestore.FieldValue.arrayUnion(userID)
        })
        // On success
        .then((val) => {
            console.log("Joined", companyId)
        })
        // On Error
        .catch((val) => {
            console.log("Could not join", company, ":", val)
        });
        console.log(company)

        // Remove user from old company
        db.collection('companies').doc(oldCompany).update({
            members: firebase.firestore.FieldValue.arrayRemove(userID)
        })
        // On success
        .then((val) => {
            console.log("Removed from old", oldCompany)
        })
        // On Error
        .catch((val) => {
            console.log("Could not remove", oldCompany, ":", val)
        });
    }

    // First determine if the user is in a company.
    if (loading) return (<h1>  Loading </h1>);

    return (
        <div className='companies_container'>  
            {/* If the user is a part of a company display the company info, otherwise display the option
            to create a new company */}
            { 
            company.length !== 0 ?
                <Company name={company[0].name} mission={company[0].mission}/> 
            :
                <>
                    <h3>You are not apart of any company!</h3>
                    <Button variant="contained" onClick={() => setAddOpen(true)}>Add a company</Button>
                </>
            }
            
            {/* Pop up form to create a new company. */}
            <AddCompany open={addOpen} onClose={handleAddClose}/>
            
            <br/>
            <Button variant="contained" onClick={() => setJoinOpen(true)}>Join another company</Button>

            {/* Pop up form to join another company. */}
            <JoinCompany open={joinOpen} onClose={handleJoinClose} userId={userID} update={company} db={db}/>

        </div>
    );
}

export default Companies
