import React from 'react';
import ImageGallery from './imageGallery';
import PageGallery from './pageGallery';
import VideoGallery from './videoGallery';

/*
links [Link]
click callback function
*/

export default class GalleryView extends React.Component {
    constructor(props){
        super(props);
        this.state = { criteria: null, };
    }

    clickEdit = link => {
        console.log('galleryView clickEdit');
        this.props.clickEdit(link);
    };

    render(){
        return(
            <div className="gallery-wrapper">
                <PageGallery
                    links={this.props.links}
                />
                <VideoGallery
                    links={this.props.links}
                    clickEdit={this.clickEdit}
                />
                <ImageGallery
                    links={this.props.links}
                    click={this.props.click}
                />
            </div>
        );
    }
}

