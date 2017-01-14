import React from 'react';

import UserProfile from 'UserProfile';

function Matches(props) {
    return (
        <div>
            <div className="page-header">
                <h3>Matches</h3>
            </div>
            <UserProfile />
            <UserProfile />
            <UserProfile />
            <UserProfile />
            <UserProfile />
        </div>
    );
};
            
            
export default Matches;