import React from 'react'
import '../../../Styles/Post.css'
import Avatar from '@material-ui/core/Avatar';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';

function Post({content, username, timestamp, media}) {
 
    return (
        <div className="post">
            <div className="post__top">
                <Avatar className="avatar">{username.charAt(0).toUpperCase()}</Avatar>
                <h3>
                    {username}
                    <span className="post__timestamp">  timestamp</span>
                </h3>
            </div>
            {console.log("Got this media:", media)}
            <div className="post__content">
                <h1>{content}</h1>
            </div>

            <div className="post__img">
                {media? <img width="500px" height="250px" src={media}/>:console.log('no images')}
            </div>

            <div className="post__actions">
                <ThumbUpAltIcon className="post__likebtn"/>
                <ChatBubbleIcon className="post__commentbtn"/>
            </div>
            
        </div>
    )
}

export default Post
