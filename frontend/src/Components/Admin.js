import React, { useState } from "react";
import { useFirebase } from "./Utils/Firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";


function Admin() {

    // This hook will re-render the componenet everytime the "user" collection changes on firebase.
    const firebase = useFirebase();
    const db = firebase.firestore();
    const [users, loading] = useCollectionData(db.collection('users').where('role', '!=', 'admin'));

    // To keep track of the user and role selected in the drop down menu.
    const [selectedUser, setSelectedUser] = useState(0);
    const [selectedRole, setSelectedRole] = useState("inaccessible");

    // When form is submitted update firebase.
    const handleSubmit = (e) => {
        e.preventDefault();
        if (users[selectedUser].role === selectedRole) {
            console.log('New role for', users[selectedUser].email , 'is the same! No updates required');
        }
        else {
            console.log('Changing role of', users[selectedUser].email, 'from', users[selectedUser].role, 'to', selectedRole);
            db.collection('users').doc(users[selectedUser].uid).update( {
                role: selectedRole 
            })
            .then(
                (val) => {
                    console.log('Done update!', val);
                    setSelectedUser(0);
                },
                (err) => {
                    console.log('Could not update!', err);
                }
            );
            
        }
    }

    return (
        <div>
            <h1>Admin Settings</h1>
            <h2>Assign Roles</h2>

            <form onSubmit={handleSubmit}>
                <label for="users">Select a user: </label>
                <select onChange={(e) => setSelectedUser(e.target.value)} id="users-options" name="user-options">
                    {
                        // Conditional Rendering
                        !loading ? 
                        users.map((user,index) => <option key={user.uid} value={index}> {user.email} : {user.role} </option>)
                        : 
                        <option>Loading ...</option>
                    }
                </select>  
                <br></br>
                
                <label for="user-roles">Select a Role: </label>
                <select onChange={(e) => setSelectedRole(e.target.value)} id="user-roles" name="user-roles">
                    <option selected="selected" value="inaccessible">Inaccessible</option>
                    <option value="mod">Moderator</option>
                </select>
                
                <br></br>

                <button>Submit</button>
            </form> 

        </div>
    );

}


export default Admin;
