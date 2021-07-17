import React, { useState, useEffect } from "react";
import {useFirebase} from '../../Utils/Firebase';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { Sidenav, Nav, Icon, Dropdown } from 'rsuite';

function Incubation(props) {
    let firebase = useFirebase();
    let db = firebase.firestore();
    let user = JSON.parse(localStorage.getItem("user"));
    const [visModules, setModules] = useState([]);

    const [values, loading, error] = useCollectionDataOnce(db.collection("stages"));
    useEffect(() => {
        if (values) {
            setModules(values[0]['Incubation']);
        }
      }, [values]);
  
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
    
    return (
        <div>
            <h2>In the Incubation Page</h2>
            <div style={{ width: 250 }}>
                <Sidenav defaultOpenKeys={['3', '4']} activeKey="1">
                <Sidenav.Body>
                    <Nav>
                        {
                            visModules.map((module) =>{
                                return(
                                    <Nav.Item eventKey="1" icon={<Icon icon="dashboard" />}>
                                        {module}
                                    </Nav.Item>
                                )
                            })
                        }
                    </Nav>
                </Sidenav.Body>
                </Sidenav>
            </div>
        </div>
    )
}

export default Incubation
