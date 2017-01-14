import React from 'react';

function MeetupItem(props) {

    let interestStyle = {
        'marginTop': "20px"
    };
    
    return (
        <div style={interestStyle}>
            <img className="img img-response" src="http://placehold.it/200x120" /><br/>
            <strong>Meet up Title</strong><br/>
            <p>Description</p>
        </div>
    );
};
            
            
export default MeetupItem;