import React, {Component} from 'react';
import {search_delay} from 'config';

class Search extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            count: 0
        };
    }
    
    handleSearch(e) {
        const term = e.target.value;
        this.state.count++;
        
        setTimeout( () => {
            if(--this.state.count === 0)
                this.props.onSearch(term);
        }, search_delay);
        
    }
    
    handleClickSearch(e) {
        if(this.refs.inputTerm.value.length === 0)
            this.props.onSearch(" ");
    }
    
    render() {
        return (
            <div className="container">
                <div className="row search">
                    <div className="col-sm-10 col-sm-offset-1">
                        <div id="imaginary_container"> 
                            <div className="input-group stylish-input-group">
                                <input 
                                    type="text" 
                                    className="form-control"  
                                    placeholder="What are you interested in ?"
                                    ref="inputTerm"
                                    onChange={this.handleSearch.bind(this)} />
                                <span className="input-group-addon">
                                    <button type="submit" onClick={this.handleClickSearch.bind(this)}>
                                        <span className="glyphicon glyphicon-search"></span>
                                    </button>  
                                </span>
                            </div>
                        </div>
                    </div>
               </div>
            </div>
        );
    }
    
}
            
            
export default Search;