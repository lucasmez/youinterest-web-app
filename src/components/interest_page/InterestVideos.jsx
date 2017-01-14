import React, {Component} from 'react';

// Components
import VideoPlayer from 'VideoPlayer';
import VideoList from 'VideoList';

import {search} from '../../api/youtube_api';


class InterestVideos extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            videos: [],
            curVideo: null
        };
        
        this.getVideos(this.props.title);
    }
    
    getVideos(searchTerm) {
        search(searchTerm, (results) => {
            this.setState({videos: results, curVideo: results[0]});
        });
    }
    
    handleVideoSelect(video) {
        this.setState({curVideo: video});
    }
    
    render() {
        return (
            <div className="interestVideos">
                <div className="row">
                    <div className="col-xs-12 col-md-8 col-md-offset-2">
                        <VideoPlayer video={this.state.curVideo}/>
                    </div>
                </div>
                <div className="page-header">
                    <h3>More Videos</h3>
                </div>
                <div className="row">
                    <VideoList videos={this.state.videos} onVideoSelect={this.handleVideoSelect.bind(this)}/>
                </div>
            </div>
        );
    }

}
            
export default InterestVideos;