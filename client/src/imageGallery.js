import React from 'react';

export default class ImageGallery extends React.Component {
    render(){
        const links = this.props.links.filter(link=>link.type==="image");
        return(
            links.length === 0
            ? ''
            :
            <div className="gallery-column">
            <div>images</div>
            {links.map(link => 
                <div
                    key={link.id}
                    onClick={()=>this.props.click(link)}
                    className={"thumbnail"}
                >
                    <img src={link.url} alt="thumb"/>
                </div>
            )}
            </div>
        );
    }
}

