import React from "react";
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { Switch, Route, useRouteMatch, Link } from 'react-router-dom';

import { useFirebase } from '../Utils/Firebase';
import Course from './Course';
import Card from '../Utils/Card';

function Elearning() {
  let user = JSON.parse(localStorage.getItem("user"));
  let { path } = useRouteMatch();

  let firebase = useFirebase();
  let db = firebase.firestore();

  const [data, loading, error] = useCollectionDataOnce(db.collection("courses").where('students', 'array-contains', `${user.userID}`));

  return (
    <Switch>
      <Route exact path={path}>

        <div className="home__page">
          <Link to={`${path}/testurlid`}>Its a me</Link>

          {loading ? <p>Loading...</p> : (
            error ? <p>{console.log(error)}Error...</p> :
              <div className="selectionPage">
                {
                  data.map(course => {
                    return (
                      <Card
                        imgSrc="https://www.elegantthemes.com/blog/wp-content/uploads/2020/06/Divi-Community-Update-May-2020-scaled.jpg"
                        key={course.id}
                        title={course.title}
                        description={course.description}
                        linkPath={`${path}/${course.id}`}
                        buttonText="Go to course"
                      />
                    )
                  })
                }

              </div>
          )}
        </div>

      </Route>

      <Route path={`${path}/:courseId`}>
        <Course title="test course cameing from learning" />
      </Route>

    </Switch>
  )
}

export default Elearning
