import { Link } from 'react-router-dom'
import '../Styles/App.css';

import { useAuth } from './Utils/Auth';
import { useFirebase } from './Utils/Firebase';
import { useState } from "react";

import { useCollectionData } from "react-firebase-hooks/firestore"

function UserPreferences() {

  const firebase = useFirebase();
  const db = firebase.firestore();
  const DB_USER_LOCATION = 'users';

  // Fetching user data from database
  const uid = JSON.parse(localStorage.getItem('user')).userID;
  const [user, loading] = useCollectionData(db.collection(DB_USER_LOCATION).where('uid', '==', uid));
  console.log(uid);

  // Specifying which fields are editable
  const editableFields = ['username', 'firstname', 'lastname', 'bio'];
  const fieldLabels = ["Username", "First Name", "Last Name", "Bio"];
  

  // Allows for toggling between rendering profile view mode and profile edit mode
  const [renderViewState, setRenderViewState] = useState(true);

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

    setRenderViewState(true);
  };

  // Switches render to allow editing profile information
  const handleEdit = () => {
      setRenderViewState(false);
      const newInputs = editableFields.map((f) => user[0][f] ? user[0][f] : "");
      setInputs(newInputs);
  };
  
  // Handles cancelling profile edits
  const handleCancel = () => {
    console.log(inputs);
    setRenderViewState(true);
  };

  // Helper render function for edit state of page
  const renderEditMode = () => {
      return ( 
        <form onSubmit={handleSaveChanges}>

            {Array.from(fieldLabels.keys()).map((i) => <p><b>{fieldLabels[i]}: </b> 
            <input defaultValue={

                user[0][editableFields[i]] ? user[0][editableFields[i]] : ""
                
            }
            
            onChange={(e) => setInputHelper(e, i)}/></p>)}

            <button type='submit' onClick={handleSaveChanges}>Save Changes</button>
            <button onClick={handleCancel}>Cancel</button>
        </form>);
  };


  //Helper render funciton for view state of page
  const renderViewMode = () => {
      
    if (loading) {
        return <p>loading...</p>
    }

    console.log(user)
    
    return (
        <div>
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

  //Render for component 
  return (
    <div>
        <Link className="App-link" to={'/home'}>Back to Home</Link>

        <h1>Update Profile</h1>
        <h2>Current Data</h2>

        {renderViewState ? renderViewMode() : renderEditMode()}

       
    </div>
  );
}

export default UserPreferences;
