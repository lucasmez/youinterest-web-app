import React from 'react';

function Search(props) {
    return (
        <div className="container">
            <div className="row search">
                <div className="col-sm-10 col-sm-offset-1">
                    <div id="imaginary_container"> 
                        <div className="input-group stylish-input-group">
                            <input type="text" className="form-control"  placeholder="What are you interested in ?" />
                            <span className="input-group-addon">
                                <button type="submit">
                                    <span className="glyphicon glyphicon-search"></span>
                                </button>  
                            </span>
                        </div>
                    </div>
                </div>
	       </div>
        </div>
    );
};
            
            
export default Search;