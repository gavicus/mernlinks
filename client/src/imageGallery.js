import React from 'react';

export default class ImageGallery extends React.Component {
    state={
        visible: true,
	thumbSize: 120,
    };

    toggleContent = () => {
        this.setState({visible:!this.state.visible});
    };

    render(){
        const links = this.props.links
            ? this.props.links.filter(link=>link.type==="image")
            : [];
        return(
            links.length === 0
            ? ''
            :
            <div className="gallery-column">
            <div className="gallery-title" onClick={this.toggleContent}>image</div><br/>
            <div
                className="gallery-content"
                style={{ display: this.state.visible ? "inline-block" : "none" }}
            >
            {links.map(link => 
                <div
                    key={link.id}
                    onClick={()=>this.props.click(link)}
                    className={"thumbnail"}
		    style={{width:this.state.thumbSize, height: this.state.thumbSize}}
                >
                    <img src={link.url} alt="thumb"/>
                </div>
            )}
            </div>
            </div>
        );
    }
}

