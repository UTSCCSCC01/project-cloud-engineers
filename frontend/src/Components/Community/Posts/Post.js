import React, {useState} from 'react'
import '../../../Styles/Post.css'
import Avatar from '@material-ui/core/Avatar';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import CommentList from './CommentList';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

function Post({content, username, role, timestamp, media, postId,deleteCallBack, editCallBack}) {
    
    //Used to render comments when user clicks the commnent icon.
    const [commentView, setcommentView] = useState(false);
    const [edit, setEdit] = useState(false);
    const [newContent, setNewContent] = useState(content)

    const handleEdit = (e) => {
        e.preventDefault();
        console.log(newContent);
        editCallBack(newContent);
        setEdit(false);
    }

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
                    <div className="post__adminbtns">
                        
                        <div className="post__editbtn" onClick={() => setEdit(!edit)}>
                            <EditIcon/>
                        </div>
                        
                        <div className="post__deletebtn" onClick={deleteCallBack}>
                            <DeleteIcon/>
                        </div>
                    </div> 
                    : 
                    <></> 
                }
                
            </div>

            <div className="post__content">
                <h1>{content}</h1>
            </div>
            
            {/* Only show edit box when edit button is clicked */}
            {edit ?
                <form onSubmit={handleEdit}>
                    <textarea className="post__edit"  name="comment" form="usrform" value={newContent} onChange={(e) => setNewContent(e.target.value)}>
                        
                    </textarea>
                    <input type="submit" value="Submit" />
                </form>
            :
                <></>
            }

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
