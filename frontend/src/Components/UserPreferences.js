import { Link } from 'react-router-dom'
import '../Styles/App.css';

import { useAuth } from './Utils/Auth'
import { useFirebase } from './Utils/Firebase';
import React, { useState } from "react";

import { Card } from './HomePage/Card'

import { useCollectionData } from "react-firebase-hooks/firestore"

const PLACEHOLDER_PROFILE_PIC = "https://www.ssu.ca/wp-content/uploads/2020/08/default-profile.png";
const USER_PIC_FIELDNAME = "profilePicture";

const DB_USER_LOCATION = 'users';

// Specifying which fields are text editable
const editableFields = ['username', 'firstname', 'lastname', 'bio'];
const fieldLabels = ["Username", "First Name", "Last Name", "Bio"];

function UserPreferences() {

  const auth = useAuth();
  const firebase = useFirebase();

  const db = firebase.firestore();
  

  // Fetching user data from database
  const uid = JSON.parse(localStorage.getItem('user')).userID;
  const [user, loading] = useCollectionData(db.collection(DB_USER_LOCATION).where('uid', '==', uid));
  console.log(uid);
  

  // Allows for toggling between rendering profile view mode and profile edit mode
  const [isRenderViewState, setIsRenderViewState] = useState(true);

  // Array state for saving text within form inputs
  const [inputs, setInputs] = useState(editableFields.map(() => ""));

  // Updates the ith input state 
  const setInputHelper = (event, i) => {
      const inputsCopy = inputs;
      inputsCopy[i] = event.target.value;
      setInputs(inputsCopy);
  };

  // Save Changes upon completing form
  const handleSaveChanges = (event) => {

    // Prevents page refresh upon form submission
    event.preventDefault();

    // Creates JSON of updated data
    const updatedUserData = Array.from(editableFields.keys()).reduce((obj, i) => 
        ({...obj, [editableFields[i]]: inputs[i] }), {});
    console.log(updatedUserData);

    // Updating Firebase
    db.collection(DB_USER_LOCATION).doc(uid).update(updatedUserData)
    .then(
        (val) => {
            console.log('Profile Backend Updated!', val);
        },
        (err) => {
            console.log('Could not update profile :(', err);
        }
    );

    setIsRenderViewState(true);
  };

  // Switches render to allow editing profile information
  const handleEdit = () => {
      setIsRenderViewState(false);
      const newInputs = editableFields.map((f) => user[0][f] ? user[0][f] : "");
      setInputs(newInputs);
  };
  
  // Handles cancelling profile edits
  const handleCancel = () => {
    console.log(inputs);
    setIsRenderViewState(true);
  };

  // Helper render function for edit state of page
  const renderEditMode = () => {
      return ( 
        <div>
            <ProfilePicture user={user}/>
            <form onSubmit={handleSaveChanges}>

                {Array.from(fieldLabels.keys()).map((i) => <p><b>{fieldLabels[i]}: </b> 
                <input defaultValue={

                    user[0][editableFields[i]] ? user[0][editableFields[i]] : ""
                    
                }
                
                onChange={(e) => setInputHelper(e, i)}/></p>)}

                <button type='submit' onClick={handleSaveChanges}>Save Changes</button>
                <button onClick={handleCancel}>Cancel</button>
            </form>
        </div>
        );
  };


  //Helper render funciton for view state of page
  const renderViewMode = () => {
      
    if (loading) {
        return <p>loading...</p>
    }

    console.log(user)
    
    return (

        
        <div>
            <ProfilePicture user={user}/>

            {
                Array.from(editableFields.keys()).map((i) => 
                    <p><b>{fieldLabels[i]}: </b> 
                    {
    
                        user[0][editableFields[i]] ? user[0][editableFields[i]] : "No Data"
                        
                    }</p>)
            }

            <button onClick={handleEdit}>Edit</button>

        </div>
      )
  }

  //Render component 
  return (
    <div>
        <Link className="App-link" to={'/home'}>Back to Home</Link>

        <h1>Update Profile</h1>
        <h2>Current Data</h2>

        {isRenderViewState ? renderViewMode() : renderEditMode()}

       
    </div>
  );
}

// Component for viewing and updating user profile picture
function ProfilePicture({user}) {

    const firebase = useFirebase();
    const db = firebase.firestore();


    const profileImageSrc = user[0][USER_PIC_FIELDNAME] ? URL.createObjectURL(user[0][USER_PIC_FIELDNAME]) : PLACEHOLDER_PROFILE_PIC;

    const [file, setFile] = useState(null); 
    const [isRenderViewState, setIsRenderViewState] = useState(true);
    const [isLoading, setIsLoading] = useState(false);


    const handleUploadChange = async ({target: {files} }) => {
        setIsLoading(true);

        const file = files[0];
        await new Promise(response => {
            setTimeout(() => {
                response(setFile(file))
            })
        }, 2000);
    }

    const handleClickUpdate = () => {
        setIsRenderViewState(false);
    }

    const handleClickCancel = () => {
        setFile(null);
        setIsRenderViewState(true);
    }

    const handleClickUpload = () => {

        if (file) {
        db.collection(DB_USER_LOCATION).doc(user[0].uid).update({[USER_PIC_FIELDNAME]: file})
        .then(
            (val) => {
                console.log('Profile Backend Updated!', val);
            },
            (err) => {
                console.log('Could not update profile :(', err);
            }
        );
        
        setFile(null);
        setIsRenderViewState(true);
        }
        

    }

    const renderViewMode = () => {
        return (
        <div>
            <button onClick={handleClickUpdate}>Update</button>
        </div>
        )
    }

    const renderUploadMode = () => {
        return (
        <div>
            <input
            type="file"
            onChange={handleUploadChange}/>
            <div>
                <button onclick={handleClickUpload}>Upload</button>
                <button onclick={handleClickCancel}>Cancel</button>
            </div>
        </div>
        )
    }

   //"https://www.ssu.ca/wp-content/uploads/2020/08/default-profile.png"
    return (
        <div>
            <div>
                <img 
                src = {file ? URL.createObjectURL(file) : profileImageSrc} 
                width = "200"
                height = "200"/> 
            </div>
            {isRenderViewState  ? renderViewMode() : renderUploadMode()}
        </div>

    );
}

export default UserPreferences;


