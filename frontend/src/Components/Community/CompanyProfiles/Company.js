import React from 'react'
import '../../../Styles/Company.css'
import EditIcon from '@material-ui/icons/Edit';

function Company({name, mission, members}) {

    return (
        <div className="company">

            <div className="company__content">
                <h1>{name}</h1>
            </div>

            <div className="company__content">
                <h2>Mission</h2>
                <h3>{mission}</h3>
            </div>

            <div className="company__content">
                <h2>Members</h2>
                <ul>
                    {/* Mapping function to display members  */}
                </ul>
            </div>

        

            <div className="company__actions">
                <EditIcon className="company__editbtn"/>
            </div>
            
            
        </div>
    )
}

export default Company
