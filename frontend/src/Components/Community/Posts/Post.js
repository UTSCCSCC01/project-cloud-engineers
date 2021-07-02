import React, {useState} from 'react'
import '../../../Styles/Post.css'
import Avatar from '@material-ui/core/Avatar';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import CommentList from './CommentList';
import DeleteIcon from '@material-ui/icons/Delete';

function Post({content, username, role, timestamp, media, postId,deleteCallBack}) {
    
    //Used to render comments when user clicks the commnent icon.
    const [commentView, setcommentView] = useState(false);

    return (
        <div className="post">
            
            {/* Part of post that contains caption and media */}
            <div className="post__top">
                <Avatar className="avatar">{username.charAt(0).toUpperCase()}</Avatar>
                <h3>
                    {username}
                    <span className="post__timestamp">  timestamp</span>
                </h3>
                
                {/* Only show the delete option to moderators and admins */}
                {
                    role != "inaccessible" ? 
                    <div className="post__deletebtn" onClick={deleteCallBack}>
                        <DeleteIcon/>
                    </div> 
                    : 
                    <></> 
                }
                
            </div>

            <div className="post__content">
                <h1>{content}</h1>
            </div>

            <div className="post__img">
                {media ? <img width="500px" height="350px" src={media}/>:<></>}
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
