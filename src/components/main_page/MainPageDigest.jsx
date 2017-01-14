import React from 'react';

// Components
import InterestItem from 'InterestItem';
import Matches from 'Matches';

function MainPageDigest(props) {
    return (
        <div>
            <div className="col-xs-12 col-md-3">
                <Matches />
            </div>
            <div className="col-xs-12 col-md-9">
                <div className="row">
                    <div className="page-header">
                        <h3>Recommended</h3>
                    </div>
                    <div className="col-sm-3 col-xs-6">
                        <InterestItem type="short"/>
                    </div>
                    <div className="col-sm-3 col-xs-6">
                        <InterestItem type="short"/>
                    </div>
                    <div className="col-sm-3 col-xs-6">
                        <InterestItem type="short"/>
                    </div>
                    <div className="col-sm-3 col-xs-6">
                        <InterestItem type="short"/>
                    </div>
                </div>
                <div className="row">
                    <div className="page-header">
                        <h3>Recent Posts</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPageDigest;