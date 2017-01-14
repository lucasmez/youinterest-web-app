import React from 'react';

module.exports = (props) => {
    function getAccount() {
        if(props && props.account){
            let accountLink = `/user/${props.account.name}`;
            
            return (
                <a className="navbar-link login" href={accountLink}>
                    <span className="glyphicon glyphicon-user"></span> Welcome, {props.account.name}
                </a>
            );
        }
        
        else {
            return (
                <span>
                    <a className="navbar-link login" href="/login">Log In</a>
                    <a className="btn btn-default action-button" href="/login">Sign Up</a>
                </span>
            );
        }
    }
    
    let navLinkStyle = "56C6C6";
    
    return (
        <div>
            <nav className="navbar navbar-default navigation-clean-button">
                <div className="container">
                    <div className="navbar-header">
                        <a className="navbar-brand navbar-link" href="#"><span style={{color: navLinkStyle}}>You</span>Interest</a>
                        <button className="navbar-toggle collapsed" data-target="#navcol-1" data-toggle="collapse">
                            <span className="sr-only"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div id="navcol-1" className="collapse navbar-collapse">
                        <ul className="nav navbar-nav"></ul>
                        <p className="navbar-text navbar-right actions">
                            {getAccount()}
                        </p>
                    </div>
                </div>
            </nav>
    </div>
    
    );
};