import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import '../../../Styles/Comment.css'
import DeleteIcon from '@material-ui/icons/Delete';

function Comment({content, username, timestamp, role, deleteCallback}) {
    return (
        <div className="comment">
            <div className="comment__top">
                <Avatar className="avatar">{username.charAt(0).toUpperCase()}</Avatar>  
                <h3>{content}</h3>
            </div>
           
           {
                role !== "inaccessible" ? 
                <div className="comment__deletebtn" onClick={deleteCallback}>
                    <DeleteIcon/>
                </div>            
                :
                <></>
            }

        </div>
    )
}

export default Comment
