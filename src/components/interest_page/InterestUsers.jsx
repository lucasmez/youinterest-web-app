import React from 'react';

import UserProfile from 'UserProfile';

function InterestUsers(props) {
    
    let users = props.users.map( user => {
        return <UserProfile key={user.name} />
    });
    
    return (
        <div>
            <br/> <br/>
            <div className="row">
                {users}
            </div>
        </div>
    );
};
            
            
export default InterestUsers;