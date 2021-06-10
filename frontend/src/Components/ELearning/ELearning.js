import React, { useState, useEffect } from "react";
import {useFirebase} from '../Utils/Firebase';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { Row, Col, Steps, Panel, Button, ButtonGroup } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import {Link} from 'react-router-dom'

function Elearning() {
  const Card = props => (
    <Panel {...props} bordered header={props.stage}>
      <Link to={{
    
        pathname:'/Stages/'+props.stage.split(" ").join(""),
        state:{
          test:"Mustafa"
        }
        }}>Modules</Link>
    </Panel>
  );

  const [step, setStep] = React.useState(0);
  const onChange = nextStep => {
    setStep(nextStep < 0 ? 0 : nextStep > 3 ? 3 : nextStep);
  };

  const onNext = () => onChange(step + 1);
  const onPrevious = () => onChange(step - 1);
  function generateMarkup(stages, steps){
    let desc = "";
      return (
        <div>
          <ButtonGroup>
            <Button onClick={onPrevious} disabled={step === 0}>
              Previous
            </Button>
            <Button onClick={onNext} disabled={step === 3}>
              Next
            </Button>
          </ButtonGroup>

          <Steps current={step}>               
            <Steps.Item title="Preincubation" description={desc} />
            <Steps.Item title="Incubation" description={desc} />
            <Steps.Item title="Implementation" description={desc} />
            <Steps.Item title="Impact Analysis" description={desc} />
          </Steps>

          <hr />
          <br></br>

          {
            <Row>
              {
            stages.map((stage) =>{
              return (
                <Col md={6} sm={12}>
                  <Card stage={stage}/>
                </Col>
                )
            })
          }
            </Row>
          }
        </div>
      );
  }

    let firebase = useFirebase();
    let db = firebase.firestore();
    let user = JSON.parse(localStorage.getItem("user"));
  
    const [values, loading, error] = useCollectionDataOnce(db.collection("stages"));
    const [visStages, setStages] = useState([]);
    const [visStageSteps, setStageSteps] = useState([]);

    useEffect(() => {
        if (values) {
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
            let stageArr = [];
            let stageValues = [];
            for (const [key, value] of Object.entries(values[0])) {
                stageArr.push(key);
                stageValues.push(value);
            }
            setStages(stageArr);
            setStageSteps(stageValues);
        }
      }, [values]);
  
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
    
    return (
        <div>
            <h2>E-learning</h2>
            {generateMarkup(visStages,visStageSteps)}                 
        </div>
    )
}

export default Elearning
