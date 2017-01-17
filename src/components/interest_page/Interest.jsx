import React, {Component} from 'react';

class Interest extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            active: "About",
            title: "Interest Name",
            description: "Interest Description",
            users: [{name: "Lucas"}, {name: "Andre"}]
        };
    }
    
    
    changePage(page) {
        this.setState({active: page});
    }
    
    renderNavTabs() {
        let addInterest;
        if(this.props.account) {
           addInterest =  (
                <button className="btn btn-success btn-sm pull-right" onClick={this.addInterest.bind(this)}>
                    Add as interest <span className="glyphicon glyphicon-plus"></span>
                </button> 
            );
        }
        
        else {
            addInterest = (
                <p className="pull-right">Login to add interest.</p>
            );
        }

        let hrefBase = `#/interest/${this.props.params.interestName}`
        
        return (
            <ul className="nav nav-tabs">
                <li role="presentation" className={this.state.active == "About" ? "active" : ""}> 
                    <a href={`${hrefBase}`} onClick={this.changePage.bind(this, 'About')}>About</a>
                </li>
                <li role="presentation" className={this.state.active == "Users" ? "active" : ""}>
                    <a href={`${hrefBase}/users`} onClick={this.changePage.bind(this, 'Users')}>Users</a>
                </li>
                <li role="presentation" className={this.state.active == "MeetUp" ? "active" : ""}>
                    <a href={`${hrefBase}/meetups`} onClick={this.changePage.bind(this, 'MeetUp')}>Meet Ups</a>
                </li>
                <li role="presentation" className={this.state.active == "Videos" ? "active" : ""}>
                    <a href={`${hrefBase}/videos`} onClick={this.changePage.bind(this, 'Videos')}>Videos</a>
                </li>
                <li role="presentation" className={this.state.active == "Discussion" ? "active" : ""}>
                    <a href={`${hrefBase}/discussion`} onClick={this.changePage.bind(this, 'Discussion')}>Discussion</a>
                </li>
                
                {addInterest}
            </ul>
        );
    }
    
    addInterest() {
        
    }
    
    render() {
        let jumbotronStyle = {
            marginBottom: "0px"
        };
        
        let navtabStyle = {
            width: "100%"
        }
        
        return (
            <div className="container">
                <div className="jumbotron" style={jumbotronStyle}>
                    <h2 className="text-center">{this.state.title}</h2>
                </div>
                {this.renderNavTabs()}
                {React.Children.map(this.props.children, 
                                    child => React.cloneElement(child, this.state)
                )}
            </div>
        );
    }
}

export default Interest;