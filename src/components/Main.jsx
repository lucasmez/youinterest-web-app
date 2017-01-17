import React, {Component} from 'react';

// Components
import Search from 'Search';
import SiteBar from 'SiteBar';
import SearchResults from 'SearchResults';

// API request helpers
import {getAccount} from '../api/server_api';

class Main extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            account: null,
            searchTerm: ""
        };
        
        getAccount( (response) => {
           if(!response.message)
               this.setState({account: response});
        });
    }
    
    
    handleSearch(searchTerm) {
        this.setState({searchTerm});
    }
    
    renderMain() {
        if(!this.state.searchTerm.length) {
            return (
                <div>
                    {React.Children.map(this.props.children, child => React.cloneElement(child, {account: this.state.account}))}
                </div>
            );
        }
        
        else {
            return (
                <div className="container">
                    <SearchResults searchTerm={this.state.searchTerm} /> //TODO This is not updating!
                </div>
            ); 
        }

    }
    
    
    render() {
        return (
            <div>
                <SiteBar account={this.state.account} />
                <Search onSearch={this.handleSearch.bind(this)} />
                {this.renderMain()}
            </div>
        );
    }
    
}

export default Main;