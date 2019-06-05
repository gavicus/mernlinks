import React from 'react';
import ImageGallery from './imageGallery';
import PageGallery from './pageGallery';
import VideoGallery from './videoGallery';

export default class GalleryView extends React.Component {
    constructor(props){
        super(props);
        this.state = { criteria: null, };
    }

    render(){
        return(
            <div className="gallery-wrapper">
                <PageGallery
                    links={this.props.links}
                />
                <VideoGallery
                    links={this.props.links}
                />
                <ImageGallery
                    links={this.props.links}
                    click={this.props.click}
                />
            </div>
        );
    }
}

