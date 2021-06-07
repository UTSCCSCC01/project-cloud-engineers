import { Link } from 'react-router-dom'
import { useHistory } from "react-router-dom";
import '../Styles/App.css';

import { useAuth } from './Utils/Auth';
import { Component, useState } from "react";

function UserPreferences() {
  let auth = useAuth();
  let history = useHistory();
  
  return (
    <div className="App">
        <header className="App-header">
            <Link class="App-link" to={'/home'}>Back to Home</Link>
            <h2>Update Fields here</h2>
            <UserField fieldName={"First Name"} value={"Anis"}/>
            <UserField fieldName={"Last Name"} value={"Saha"}/>
            <UserField fieldName={"Username"} value={"anissaha86"}/>
        </header>
    </div>
  );
}

export default UserPreferences;

/**
 *         <div>
            <profileField fieldname="Username" getField={() => 'Anis Saha'}/> 
            <profileField fieldname="Bio" getField={() => 'Likes Space'}/> 
        </div>
 */

class UserField extends Component {
    state = {
        editMode: false,
        value: this.props.value,
        input: ''
    };

    handleEdit = () => {
        console.log('entering edit mode');
        this.setState({ editMode: true,
                        input: this.state.value});
        this.render();
    };

    handleSaveChanges = () => {
        this.setState({ value: this.state.input, 
                        editMode: false,
                        input: '' });
        this.render();
    };

    handleCancel = () => {
        this.setState({ editMode: false, 
                        input: '' });
        this.render();
    };

    handleInputChange = (event) =>
        this.state.input = event.target.value

    renderViewMode() {
        return (
            <div>
                <div>
                    <h4>{this.props.fieldName}</h4>
                    <h3>{this.state.value}</h3>
                </div>
                <button onClick={this.handleEdit}>Edit</button>
            </div>
        );
    };

    renderEditMode() { 
        return (
            <div>
                <div>
                    <h4>{this.props.fieldName}</h4>
                    <input defaultValue={ this.state.input } onChange={(event) => this.handleInputChange(event)} />
                </div>
                <button onClick={this.handleSaveChanges}>Save Changes</button>
                <button onClick={this.handleCancel}>Cancel</button>
            </div>
            
        );
    }

    render() {
        if (this.state.editMode) {
            return this.renderEditMode();
        }
        
        return this.renderViewMode();
    };
}