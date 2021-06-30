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
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);
    const [posts, setposts] = useState([]);
    const [comments, setcomments] = useState([]);
    const [newID, setnewID] = useState(nanoid())
    
    const handleChange = e => {
        if (e.target.files[0]) {
          setImage(e.target.files[0]);
        }
    };

    const handleCaptionChange = e => {
        setcaption(e.target.value);
        setnewID(nanoid());
    }
    
    const handleUpload = () => {
        const uploadTask = firebase.storage().ref('media/posts/'+newID+'/' + image.name).put(image);
        uploadTask.on(
            "state_changed",
            snapshot => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setProgress(progress);
            },
            error => {
              console.log(error);
            },
            () => {
              firebase.storage()
                .ref('media/posts/'+newID+'/')
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                  setUrl(url);
                  console.log("URL:", url);
                });
            }
          );
    }

    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => (
            setposts(snapshot.docs.map((doc) => doc.data()))
        ))
    }, [])

    function addPost(event){

        event.preventDefault();
        
        const post = {
            content: caption,
            authorId: user.userID,
            authorName: user.username,
            likes: 0,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            privacy: 'public',
            attachments:[],
            postId: newID,
            media: url,
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
            media: url,
        })
        .then((docRef) => {
            console.log("added post to firestore!")
        })
        .catch((error) => {
            console.log("Error:",error)
        });

        setcaption('');
        setImage(null);
        setUrl('');
    }

    return (
        <div className="postList">
            
            <div className= "postList__creation">
                <form>
                    <div className="postList__form">                    
                            <FormControl>
                                <InputLabel>Add a caption!</InputLabel>
                                <Input className="inputbox" value={caption} onChange={handleCaptionChange}></Input>
                            </FormControl>
                    </div>
                    
                    <div className="postList__media">
                        <input className="filebtn" type="file" onChange={handleChange} />
                        <Button disabled={!caption} color="primary" className="mediabtn" onClick={handleUpload}> <AddPhotoAlternateIcon/> Add Media</Button>
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
                        media={post.media}
                    />
                ))}                
            </div>

        </div>
    )
}

export default PostList
