import React, {Component} from 'react';
import {getInterestsRecommendations} from '../../api/server_api';

// Components
import InterestItem from 'InterestItem';
import RecommendInterests from 'RecommendInterests';
import Matches from 'Matches';

class MainPageDigest extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            recommendations: []
        };
        
        this.getRecommendations.call(this);
    }
    
    getRecommendations() {
        getInterestsRecommendations(this.props.account)
            .then( results => this.setState({recommendations: results}));
    }
    
    render() {
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
                        <RecommendInterests interests={this.state.recommendations}/>
                    </div>
                    <div className="row">
                        <div className="page-header">
                            <h3>Recent Posts</h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
}

export default MainPageDigest;