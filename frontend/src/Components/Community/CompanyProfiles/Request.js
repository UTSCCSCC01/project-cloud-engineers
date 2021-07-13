import React, {useState, useEffect} from 'react'
import { useFirebase } from "../../Utils/Firebase";
import { Avatar, Button} from "@material-ui/core";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import '../../../Styles/Request.css'


function Request({reqInfo, handleDecision}) {
    
    const firebase = useFirebase();
    const db = firebase.firestore();
    let user = JSON.parse(localStorage.user);

    const deleteReq = () => {
        db.collection("requests").doc(reqInfo.reqId).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    const handleAccept = () => {
        alert('Accepted Request');
        handleDecision(reqInfo.reqId);
        
        db.collection('companies').doc(reqInfo.newcompanyId).update({
            members: firebase.firestore.FieldValue.arrayUnion(reqInfo.senderId)
        })
        // On success
        .then((val) => {
            console.log("Joined", reqInfo.newcompanyId);
        })
        // On Error
        .catch((val) => {
            console.log("Could not join", reqInfo.newcompanyName);
        });

        if(reqInfo.currentCompanyId != ''){
            db.collection('companies').doc(reqInfo.currentCompanyId).update({
                members: firebase.firestore.FieldValue.arrayRemove(reqInfo.senderId)
            })
            // On success
            .then((val) => {
                console.log("Removed from old", reqInfo.currentCompanyId)
            })
            // On Error
            .catch((val) => {
                console.log("Could not remove", reqInfo.currentCompanyId)
            });
        }

        deleteReq();
    }

    const handleReject = () => {
        alert('Rejected Request');
        handleDecision(reqInfo.reqId);
        deleteReq();
    }

    return (
        <div className="request">
            <div className="req_info">
                <div className="req__avatar">
                    <Avatar className="avatar">{reqInfo.senderName.charAt(0).toUpperCase()}</Avatar>
                </div>
                <h3>{reqInfo.senderName} requested to join {reqInfo.newcompanyName}</h3>
            </div>
            <div className="btns">
                <div className="req_accept">
                    <CheckCircleIcon onClick={handleAccept}/>
                </div>
                <div className="req_reject">
                    <CancelIcon onClick={handleReject}/>
                </div>
            </div>
        </div>
    )
}

export default Request
