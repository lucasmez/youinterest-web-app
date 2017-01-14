import React, {Component} from 'react';

// Components
import Search from 'Search';
import SiteBar from 'SiteBar';

// API request helpers
import {getAccount} from '../api/server_api';

class Main extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            account: null
        };
        
        getAccount( (response) => {
           if(!response.message)
               this.setState({account: response});
        });
    }
    
    
    render() {
        return (
            <div>
                <SiteBar account={this.state.account} />
                <Search />
                {React.Children.map(this.props.children, 
                                    child => React.cloneElement(child, {
                                        account: this.state.account
                                    })
                )}
            </div>
        );
    }
    
}

export default Main;