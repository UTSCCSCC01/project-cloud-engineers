import React, { useState, useEffect } from "react";
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useParams } from 'react-router-dom';
import {List,ListItemText, ListItem, ListSubheader} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { useFirebase } from '../../Utils/Firebase';
import {Link}  from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';



function Modules(props) {
    let { courseId } = useParams();

    let firebase = useFirebase();
    let db = firebase.firestore();
    const [values, loading, error] = useCollectionDataOnce(db.collection("modules").where('courseId', '==', courseId));
    const [curDisplay, setDisplay] = useState([]);

    const useStyles = makeStyles({
        root: {
          maxWidth: 345,
        },
        media: {
          height: 140,
        },
      });
      const classes = useStyles();


    async function handleDownloads(files){
        if(files){
            files.forEach( async (file) =>{
                let userResult = await db.collection('files').where('fileId', '==', file).get();
                userResult.forEach((doc) => {
                    window.open(doc.data().url, "_blank");
                })
            })
        }
    }

    function MediaCard(curDisplay) {
        let newCard = JSON.parse(curDisplay);
        const t = firebase.firestore.Timestamp.fromDate(new Date());

        if(newCard.type == "assignment"){
            let date = new Date(newCard.duedate.seconds * 1000);

            let dueDate = ("Date: "+date.getDate()+
              "/"+(date.getMonth()+1)+
              "/"+date.getFullYear());
    
            return (
              <Card className={classes.root}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {newCard.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {newCard.description}
                    </Typography>
                    <br></br>
                    <Typography className={classes.pos} color="textSecondary">
                    Due: {dueDate}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size="small" color="primary" value={newCard.files} onClick={() => { handleDownloads(newCard.files)}} >
                    Download
                  </Button>
                </CardActions>
              </Card>
            );
        }
        else{
            return (
                <Card className={classes.root}>
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {newCard.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                          {newCard.content}
                      </Typography>
                      <br></br>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                  </CardActions>
                </Card>
              );
        }
      }
    
    async function handleCard(cardId,isAss){
        let userDoc;
        let userResult;
        if(isAss){
            userResult = await db.collection('assignments').where('assignmentId', '==', cardId).get();
        }else{
            userResult = await db.collection('lessons').where('lessonId', '==', cardId).get();
        }
        userResult.forEach((doc) => {
            userDoc = doc.data();
            if(isAss){
                userDoc.type = "assignment";
            }else{
                userDoc.type = "lesson";
            }
        })

        setDisplay(JSON.stringify(userDoc));
    }
    function generateItemsMarkup(items){
        if(items){
            return (
                <div>{
                items.map((item)=>{
                    if(item.type == "assignment"){
                        return(
                            <Button variant="contained" color="primary" value={item.id} onClick={() => { handleCard(item.id,1)}}>Assignment: {item.title}</Button>
                        )
                    }
                    else if(item.type == "lesson"){
                        return(
                            <Button variant="contained" color="secondary" value={item.id} onClick={() => { handleCard(item.id,0)}}>Lesson: {item.title}</Button>
                        )
                    }
                    return(
                        <br></br>
                    )
                })
            }
                </div>
            )
            }

    }
    function generateMarkup(modules){
        values.sort((a, b) => (a.order > b.order) ? 1 : -1)
        return(
            modules.map((module)=>{
                return (
                    <div style={{border: "2px solid black"}} >
                        <ListItem button>
                            <ListItemText primary={module.title} />
                        </ListItem>
                        {
                            generateItemsMarkup(module.items)
                        }
                        <Divider />
                    </div>
                  );
            })
        )
      }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div>
            <List component="nav" aria-label="mailbox folders">
                {
                    generateMarkup(values)
                }
                <br></br>
            </List>

            <br></br>
            <br></br>
            <br></br>
            {
                curDisplay.length!=0 && MediaCard(curDisplay)
            }


            <Link className="App-link" to={'/home/e-learning/'+courseId}>Back to Course Homepage</Link>


        </div>
    )
}

export default Modules;
