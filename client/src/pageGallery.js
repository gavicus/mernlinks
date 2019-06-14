import React from 'react';

export default class PageGallery extends React.Component {
    state={
        visible: true,
    };

    toggleContent = () => {
        this.setState({visible:!this.state.visible});
    };

    clickEdit = link => {
        this.props.clickEdit(link);
    };

    renderLink(link){
        return(
            <div className="wide-thumb" key={link.id}>
                <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {
                    link.thumburl
                    ? <img src={link.thumburl} alt="page thumbnail" />
                    : <span>{link.url}</span>
                    }
                </a>
                <button
                    className="vid-edit-btn"
                    onClick={()=>this.clickEdit(link)}
                >
                    edit
                </button>
            </div>
        );
    }

    render(){
        const links = this.props.links
            ? this.props.links.filter(link => link.type === "page")
            : [];
        return(
            links.length === 0
            ? ''
            :
            <div className="gallery-column">
                <div className="gallery-title" onClick={this.toggleContent}>pages</div><br/>
                <div
                    className="gallery-content"
                    style={{
                        display: this.state.visible
                        ? "inline-block"
                        : "none"
                    }}
                >
                { links.map(link => this.renderLink(link)) }
                </div>
            </div>
        );
    }
}

