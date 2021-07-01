import React from 'react'
import Company from './Company';
import '../../../Styles/Companies.css'
import { useFirebase } from "../../Utils/Firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";



function Companies() {
    // This hook will re-render the componenet everytime the "user" collection changes on firebase.
    const firebase = useFirebase();
    const db = firebase.firestore();
    const userID = JSON.parse(localStorage.user).userID;
    const [company, loading] = useCollectionData(db.collection('companies').where('members', 'array-contains-any', [userID]));

    // First determine if the user is in a company.
    console.log(company);
    if (loading) return (<h1>  Loading </h1>)

    return (
        <div className='companies_container'>  
            {/* If the user is a part of a company display the company info, otherwise display the option
            to create a new company */}
            { 
            company.length != 0 ?
                <Company name='UTSC AFRICA COMPANY' mission='SAVE AFRICA' members={[]}/> 
            :
                <h3>Create a company</h3>
            }
            <h3>Join another company</h3>
        </div>
    );
}

export default Companies
