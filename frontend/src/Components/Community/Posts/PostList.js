import React, {useState, useEffect} from 'react'
import { FormControl,Input,InputLabel } from '@material-ui/core'
import Post from './Post';
import '../../../Styles/PostList.css'
import { useFirebase } from "../../Utils/Firebase";
import { nanoid } from 'nanoid'
import Avatar from '@material-ui/core/Avatar';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";

// Pop-up form for editing a company
function EditCompany({onClose, open, initialCompany, initialMission}) {

    // To keep track of the values the user entered.
    const [company, setCompany] = useState(initialCompany);
    const [mission, setMission] = useState(initialMission);

    return (
        <Dialog open={open} onClose={() => onClose(company, mission, false)} aria-labelledby="form-dialog-title">

            <DialogTitle id="form-dialog-title">Edit Company Info</DialogTitle>

            <DialogContent>

                <DialogContentText>
                    Fill out the information below to edit company company.
                </DialogContentText>

                <TextField
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Company Name"
                    fullWidth
                />

                <TextField
                    value={mission}
                    onChange={ (e) => setMission(e.target.value) }
                    autoFocus
                    margin="dense"
                    id="mission"
                    label="Mission Statement"
                    fullWidth
                />

            </DialogContent>

            <DialogActions>
                <Button onClick={() => onClose(company, mission, false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={ () => onClose(company, mission, true)} color="primary">
                    Apply
                </Button>
            </DialogActions>

        </Dialog>

    )
}




function PostList() {
    
    const firebase = useFirebase();
    const db = firebase.firestore();

    let user = JSON.parse(localStorage.user);
    const [caption, setcaption] = useState('');
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);
    
    // Need to call setPosts whenever someone deletes a post
    const [posts, setposts] = useState([]);
    const [comments, setcomments] = useState([]);
    const [newID, setnewID] = useState(nanoid())
    
    //Handles changes made to the media input textbox for posts.
    const handleChange = e => {
        if (e.target.files[0]) {
          setImage(e.target.files[0]);
        }
    };

    //Handles changes made to the media input textbox for posts.
    const handleCaptionChange = e => {
        setcaption(e.target.value);
        setnewID(nanoid());
    }
    
    //Uploads media(images for now) to the firebase storage platform.
    //Assigns url for image to the corresponding post document.
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

    //Gets all post information whenever user enters the posts page.
    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => (
            setposts(snapshot.docs.map((doc) => doc.data()))
        ))
    }, [])

    //Adds posts and it's corresponding information to the firestore database.
    function addPost(event){

        event.preventDefault();
        
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

    function deletePost(postId) {
        function deleteCallBack() {
            console.log("Deleting", postId);
            // Call fire base to delete the post
            db.collection('posts').doc(postId).delete()
            .then(
                // on successful change
                (val) => {
                    console.log('Delete Succesful!', val);
                    setposts( posts.filter( (value) => {
                        return value.postId !== postId;
                    }));
                },
                // on non-sucessful change
                (err) => {
                    console.log('Error, could not delete!', err);
                }
            );
        }
        return deleteCallBack;
    }

    return (
        <div className="postList">
            
            {/*Post Creation mechanism*/}
            <div className= "postList__creation">
                
                <div className="post__creation__avatar">
                    <Avatar className="avatar">{user.username.charAt(0).toUpperCase()}</Avatar>
                </div>
                
                <form>
                    <div className="postList__form">                    
                            <FormControl>
                                <InputLabel>Add a caption!</InputLabel>
                                <Input className="inputbox" value={caption} onChange={handleCaptionChange}></Input>
                            </FormControl>
                    </div>
                    
                    <div className="postList__media">
                        <input className="filebtn" type="file" onChange={handleChange} />
                        <Button 
                                disabled={!caption || !image} 
                                color="primary" className="mediabtn" 
                                onClick={handleUpload}
                        > 
                            <AddPhotoAlternateIcon/> 
                            UPLOAD MEDIA
                        </Button>
                    </div>

                    <div className="postList__btn">
                        <Button 
                            onClick={addPost} 
                            disabled={!caption} 
                            type='submit' 
                            variant="contained" 
                            color="primary"
                        >
                            Create Post
                        </Button>
                    </div>
                </form>

            </div>
            
            {/* List of all posts */}
            <div className="postList__posts">
                {posts.map(post => (
                    <Post
                        key={post.postId}
                        content={post.content}
                        username={post.authorName}
                        role={user.role}
                        timestamp={post.timestamp}
                        media={post.media}
                        postId={post.postId} 
                        deleteCallBack={deletePost(post.postId)}
                    />
                ))}                
            </div>

        </div>
    )
}

export default PostList
