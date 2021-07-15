import React from 'react'
import Document from './Document';
import '../../../Styles/DocumentList.css'

function DocumentList({companyId, creatorId,}) {
    const userID = JSON.parse(localStorage.user).userID;
    return (
        <div>
            <h2>Company Documents</h2>

            <div className="documentlist">
                <Document name='Document 1' url='google.ca' uploaderId={userID} creatorId={creatorId} />
                <Document name='Document 2' url='google.ca' uploaderId='213' creatorId={creatorId} />
                <Document name='Document 3' url='google.ca' uploaderId={userID} creatorId={creatorId} />
            </div>

        </div>
    )
}

export default DocumentList
