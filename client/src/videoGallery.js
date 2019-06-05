import React from 'react';

export default class VideoGallery extends React.Component{
    render(){
        const links = this.props.links.filter(link=>link.type==="video");
        return(
            links.length === 0
            ? ''
            :
            <div className="gallery-column">
                <div>videos</div>
                {
                links.map(link => 
                    <div className="wide-thumb" key={link.id}>
                        <a href={link.url}>
                            {
                            link.thumburl
                            ? <img src={link.thumburl} alt="video thumbnail" />
                            : <span>{link.url}</span>
                            }
                        </a>
                    </div>
                )
                }
            </div>
        );
    }
}

