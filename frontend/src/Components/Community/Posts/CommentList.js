import React, {useState, useEffect} from 'react'
import { FormControl,Input,InputLabel } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import { nanoid } from 'nanoid'
import Avatar from '@material-ui/core/Avatar';
import { useFirebase } from "../../Utils/Firebase";
import '../../../Styles/CommentList.css'
import Comment from './Comment';


function CommentList({postID}) {
    
    const firebase = useFirebase();
    const db = firebase.firestore();
    let user = JSON.parse(localStorage.user);

    const [comments, setcomments] = useState([]);
    const [content, setcontent] = useState('');
    const [newID, setnewID] = useState(nanoid())

    const handleContentChange = e => {
        setcontent(e.target.value);
        setnewID(nanoid());
    }

    useEffect(() => {
        const tempArray = [];
        db.collection("comments").where("postId", "==", postID)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                tempArray.push(doc.data())
            });
            setcomments(tempArray);
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }, [])

    function addComment(event){
        event.preventDefault();
        
        const temp = {
            content: content,
            authorId: user.userID,
            authorName: user.username,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            postId: postID,
            commentId: newID,
        }

        db.collection('comments').doc(newID).set({
            content: content,
            authorId: user.userID,
            authorName: user.username,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            postId: postID,
            commentId: newID,
        })
        .then((docRef) => {
            console.log("added comment to firestore!")
            setcomments([...comments,temp])
        })
        .catch((error) => {
            console.log("Error:",error)
        });

        setcontent('');
    }
    
    return (
        <div className="commentList">
            <div className="comment__creation">
                <form>
                    <div className="commentList__form"> 
                            <Avatar className="avatar">{user.username.charAt(0).toUpperCase()}</Avatar>                   
                            <FormControl>
                                <InputLabel>Add a comment!</InputLabel>
                                <Input className="comment__inputbox" value={content} onChange={handleContentChange}></Input>
                            </FormControl>
                    </div>
                    
                    <div className="commentList__btn">
                        <Button onClick={addComment} style={{visibility:"hidden"}} type='submit' variant="contained" color="primary">Create Post</Button>
                    </div>
                </form>
            </div>

            <div className="comments">
                {comments.map(comment => (
                        <Comment
                            content={comment.content}
                            username={comment.authorName}
                            timestamp={comment.timestamp}
                        />
                    ))}   
            </div>

        </div>
    )
}

export default CommentList
