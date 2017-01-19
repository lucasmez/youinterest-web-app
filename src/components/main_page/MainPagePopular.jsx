import React, {Component} from 'react';
import {getInterestsRecommendations} from '../../api/server_api';
import RecommendInterests from 'RecommendInterests';

// Components
import InterestItem from 'InterestItem';


class MainPagePopular extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            popular: []
        };
        
        this.getPopular.call(this);
    }
    
    getPopular() {
        getInterestsRecommendations()
            .then( results => this.setState({popular: results}));
    }
    
    render() {
        return (
            <div>
                <div className="page-header">
                    <h3>Popular</h3>
                </div>
                <RecommendInterests interests={this.state.popular}/>
            </div>
        );
    }

}
export default MainPagePopular;