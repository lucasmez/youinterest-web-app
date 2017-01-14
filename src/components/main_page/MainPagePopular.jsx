import React from 'react';

// Components
import InterestItem from 'InterestItem';

function MainPagePopular(props) {
    return (
        <div>
            <div className="page-header">
                <h3>Popular</h3>
            </div>
            <div className="col-sm-6 col-xs-12">
                <InterestItem />
            </div>
            <div className="col-sm-6 col-xs-12">
                <InterestItem />
            </div>
        </div>
    );
};

export default MainPagePopular;