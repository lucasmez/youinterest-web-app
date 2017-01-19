import React, {Component} from 'react';

// Components
import MainPageDigest from 'MainPageDigest';
import MainPagePopular from 'MainPagePopular';

class MainPage extends Component {
    
    getMainPage() {
        if(this.props.account)     // User is logged in
            return <MainPageDigest account={this.props.account}/>;
        else 
           return <MainPagePopular />; 
        
    }
    
    render() {
        return (
            <div className="container">
                {this.getMainPage()}
            </div>
        );
    }
}

export default MainPage;