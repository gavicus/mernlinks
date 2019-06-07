import React from 'react';

export default class PageGallery extends React.Component {
    state={
        visible: true,
    };

    toggleContent = () => {
        this.setState({visible:!this.state.visible});
    };

    render(){
        const links = this.props.links.filter(link=>link.type==="page");
        return(
            links.length === 0
            ? ''
            :
            <div className="gallery-column">
                <div className="gallery-title" onClick={this.toggleContent}>pages</div><br/>
                <div
                    className="gallery-content"
                    style={{ display: this.state.visible ? "inline-block" : "none" }}
                >
                {
                links.map(link => 
                    <div className="wide-thumb" key={link.id}>
                        <a href={link.url}>
                            {
                            link.thumburl
                            ? <img src={link.thumburl} alt="page thumbnail" />
                            : <span>{link.url}</span>
                            }
                        </a>
                    </div>
                )
                }
                </div>
            </div>
        );
    }
}

