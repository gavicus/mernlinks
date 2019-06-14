import React from 'react';

export default class VideoGallery extends React.Component{
    state={
        visible: true,
    };

    toggleContent = () => {
        this.setState({visible:!this.state.visible});
    };

    clickEdit = link => {
        console.log('videoGallery clickEdit');
        this.props.clickEdit(link);
    };

    render(){
        const links = this.props.links
            ? this.props.links.filter(link=>link.type==="video")
            : [];
        return(
            links.length === 0
            ? ''
            :
            <div className="gallery-column">
                <div className="gallery-title" onClick={this.toggleContent}>video</div><br/>
                <div
                    className="gallery-content"
                    style={{ display: this.state.visible ? "inline-block" : "none" }}
                >
                {
                links.map(link => 
                    <div className="wide-thumb" key={link.id}>
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {
                            link.thumburl
                            ? <img src={link.thumburl} alt="video thumbnail" />
                            : <span>{link.url}</span>
                            }
                        </a>
                        <button onClick={()=>this.clickEdit(link)} className="vid-edit-btn">edit</button>
                    </div>
                )
                }
                </div>
            </div>
        );
    }
}

