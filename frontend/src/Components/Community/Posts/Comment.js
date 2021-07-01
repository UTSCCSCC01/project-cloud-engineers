import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import '../../../Styles/Comment.css'

function Comment({content, username, timestamp}) {
    return (
        <div className="comment">
            <div className="comment__top">
                <Avatar className="avatar">{username.charAt(0).toUpperCase()}</Avatar>  
                <h3>{content}</h3>
            </div>
            <span className="comment__timestamp">2h</span>
        </div>
    )
}

export default Comment
