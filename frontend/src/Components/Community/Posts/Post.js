import React, {useState} from 'react'
import '../../../Styles/Post.css'
import Avatar from '@material-ui/core/Avatar';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import CommentList from './CommentList';

function Post({content, username, timestamp, media, postId}) {
    
    const [commentView, setcommentView] = useState(false);

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
                {media? <img width="500px" height="350px" src={media}/>:console.log('no images')}
            </div>

            <div className="post__actions">
                <ThumbUpAltIcon className="post__likebtn"/>
                <ChatBubbleIcon onClick={() => setcommentView(!commentView)} className="post__commentbtn"/>
            </div>

            <div className="post__comments">
              {commentView ? <CommentList postID={postId}/> : null}  
            </div>
        </div>
    )
}

export default Post
