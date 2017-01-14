import React from 'react';

function InterestItem(props) {
    if(props.type === "short") {
        let shortStyle = {
            'marginBottom': "20px"
        };
        
        return (
            <div className="media" style={shortStyle}>
                <div className="media-left">
                   <img className="media-object" src="http://placehold.it/200x120" />
                </div><br/>
                <div className="media-body">
                    <h4 className="media-heading">Interest title <span className="badge"> 30 users</span></h4>
                    <p className="text-left">iterest description goes here</p>
                </div>
            </div>
        );
    }
    
    else
        return (
            <div className="media">
                <div className="media-left">
                    <a href="#/interest"><img className="media-object" src="http://placehold.it/200x120" /></a>
                </div>
                <div className="media-body">
                    <h4 className="media-heading">Interest title <span className="badge"> 30 users</span></h4>
                    <p className="text-left">iterest description goes here</p>
                </div>
            </div>
        );
};

export default InterestItem;

