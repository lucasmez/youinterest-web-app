import React from 'react';

import InterestItem from 'InterestItem';

function renderResults(props) {
    return props.interests.map( interest => {
        return (
            <div key={interest._id} className="col-sm-3 col-xs-6">
                <InterestItem type="short" interest={interest}/>
            </div>
        );
    });
}

function RecommendInterests(props) {
    
    return (
        <div>
            {renderResults(props)}
        </div>
    );
}

export default RecommendInterests;