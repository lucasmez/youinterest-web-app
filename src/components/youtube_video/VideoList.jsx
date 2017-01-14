import React from 'react';

function renderVideos(props) {
    let results = [];
    let videoStyle = {
        'marginTop': "20px"
    };
    
    if(props.videos.length === 0) 
        return;
    
    props.videos.map( video => {
        let imageUrl = video.snippet.thumbnails.medium.url;
        let videoTitle = video.snippet.title;
        let videoDescription = video.snippet.description.slice(0, 45) + "...";

        results.push(
            <div key={video.id.videoId} className="col-xs-6 col-md-3">
                <div onClick={ () => props.onVideoSelect(video) }>
                    <div style={videoStyle}>
                        <img className="img img-response" src={imageUrl} height="140" width="250" /><br/>
                        <strong>{videoTitle}</strong><br/>
                        <small>{videoDescription}</small>
                    </div>
                </div> 
            </div>
        );
    });
    
    return results;
}

function VideoList(props) {

    return (
        <div>
            {renderVideos(props)}
        </div>
    );
};
            
            
export default VideoList;