import React from 'react';


function UserProfile(props) {
    return (
        <div>
             <div className="col-md-12">
                <div className="media">
                    <div className="media-left">
                        <a><img className="media-object img-thumbnail" src="http://placehold.it/60x60" /></a>
                    </div>
                    <div className="media-body">
                        <a className="media-heading">Username</a><br/>
                        <small className="text-left">23 interests in common</small>
                    </div>
                </div>
            </div>
        </div>
    );
};
            
            
export default UserProfile;