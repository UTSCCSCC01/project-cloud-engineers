import { useHistory } from "react-router-dom";
import '../Styles/Home.css';
import Card from './HomePage/Card';
import { useAuth } from './Utils/Auth'

function Home() {
  let auth = useAuth();
  let history = useHistory();
  
  return (
    <div className="home__page">
        <div className="selectionPage">
            <Card
                imgSrc = "https://www.elegantthemes.com/blog/wp-content/uploads/2020/06/Divi-Community-Update-May-2020-scaled.jpg"
                title="Community"
                description="Interact with other rising entrepreneurs"
                linkPath="/community"
                buttonText="Go to Community"
            />
            <Card
                imgSrc = "https://themefisher.com/wp-content/uploads/2019/05/E-learning.jpg"
                title="E-Learning"
                description="Learn to expand your businesses"
                linkPath="/e-learning"
                buttonText="Go to E-Learning"
            />
        </div>
      <a onClick={() => auth.signOut(() => history.push("/"))}><strong>Log Out</strong></a>
    </div>
  );
}

export default Home;
