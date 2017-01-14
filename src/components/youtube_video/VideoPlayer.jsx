import React from 'react';

function VideoPlayer(props) {
    let videoStyle = {
        marginTop: "10px"
    };
    
    if(!props.video) {
        return (
            <h2>Loading...</h2>
        );
    }

    let videoUrl = `http://www.youtube.com/embed/${props.video.id.videoId}`,
        videoTitle = props.video.snippet.title,
        videoDescription = props.video.snippet.description;
    
    return (
        <div style={videoStyle}>
            <div className="embed-responsive embed-responsive-16by9">
                <iframe className="embed-responsive-item" src={videoUrl}></iframe>
            </div>
        
            <div className="details">
                <div>{videoTitle}</div>
                <div>{videoDescription}</div>
            </div>
        </div>
    );
};
            
            
export default VideoPlayer;