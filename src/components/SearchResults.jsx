import React, {Component} from 'react';
import {searchInterests} from '../api/server_api';

// Components
import InterestItem from 'InterestItem';

class SearchResults extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            searchResults: null
        };
        
        this.getInterests();
    }
    
    renderResults() {
        if(!this.state.searchResults) {
            return (
                <div>
                    Loading...
                </div>
            );
        }
        
        else {
          
            return this.state.searchResults.map( interest => {
                return (
                    <div key={interest._id} className="col-xs-6 col-md-3">
                        <InterestItem type="short" interest={interest} />
                    </div>
                );
            });
        }
        
    }
    
    getInterests() {
        searchInterests(this.props.searchTerm)
        .then( interests => {
            this.setState({searchResults: interests.length ? interests : null });

        }, err => {
            this.setState({searchResults: null});
        });
    }
    
    render() {
        return (
            <div>
                <div className="page-header">
                    <h3>Results</h3>
                </div>
                {this.renderResults.call(this)}
            </div>
        );
    }
}
            
            
export default SearchResults;