import React, {useState, useEffect} from 'react'
import { FormControl,Input,InputLabel } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import Post from './Post';
import '../../../Styles/PostList.css'
import { useFirebase } from "../../Utils/Firebase";
import { nanoid } from 'nanoid'
import Avatar from '@material-ui/core/Avatar';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { useCollectionData } from "react-firebase-hooks/firestore";


function PostList() {
    
    const firebase = useFirebase();
    const db = firebase.firestore();

    let user = JSON.parse(localStorage.user);
    const [caption, setcaption] = useState('');
    const [img, setimg] = useState('');
    const [posts, setposts] = useState([]);
    const [comments, setcomments] = useState([]);

    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => (
            setposts(snapshot.docs.map((doc) => doc.data()))
        ))
    }, [])

    function addPost(event){

        event.preventDefault();
        const newID = nanoid();
        
        const post = {
            content: caption,
            authorId: user.userID,
            authorName: user.username,
            likes: 0,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            privacy: 'public',
            attachments:[],
            postId: newID,
        }
        
        db.collection('posts').doc(newID).set({
            content: caption,
            authorId: user.userID,
            authorName: user.username,
            likes: 0,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            privacy: 'public',
            attachments:[],
            postId: newID,
        })
        .then((docRef) => {
            console.log("added post to firestore!")
        })
        .catch((error) => {
            console.log("Error:",error)
        });

        setcaption('');
    }

    return (
        <div className="postList">
            
            <div className= "postList__creation">
                <form>
                    <div className="postList__form">                    
                            <FormControl>
                                <InputLabel>Add a caption!</InputLabel>
                                <Input className="inputbox" value={caption} onChange={event => setcaption(event.target.value)}></Input>
                            </FormControl>
                    </div>
                    
                    <div className="postList__media">
                        <span>file.png successfully!</span>
                        <Button color="primary" className="mediabtn"> <AddPhotoAlternateIcon/> Add Media</Button>
                    </div>

                    <div className="postList__btn">
                        <Button onClick={addPost} disabled={!caption} type='submit' variant="contained" color="primary">Create Post</Button>
                    </div>
                </form>
            </div>
            
            <div className="postList__posts">
                {posts.map(post => (
                    <Post 
                        content={post.content}
                        username={post.authorName}
                        timestamp={post.timestamp}
                    />
                ))}                
            </div>
        </div>
    )
}

export default PostList
