import React, { Link } from 'react'
import DescriptionIcon from '@material-ui/icons/Description';
import DeleteIcon from '@material-ui/icons/Delete';

import '../../../Styles/Document.css'

function Document({name, url, uploaderId, creatorId}) {
    
    const userID = JSON.parse(localStorage.user).userID;
    console.log(userID)
    console.log(uploaderId)
    console.log(creatorId)
    
    return (
        <div className="document ">
            <div className="document_info">

                <DescriptionIcon> </DescriptionIcon>

                <h3> <a href={url}> {name} </a> </h3>

            </div>

            {/* Only show the delete option if the current user is the creator of the company
            or the uploader!*/}
            { ((userID === uploaderId) || (userID === creatorId)) ?
                <div className='document_delete_btn'>
                    <DeleteIcon> </DeleteIcon>            
                </div>
            :
                <></>
            }

        </div>
    )
}

export default Document
