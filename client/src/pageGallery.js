import React from 'react';

export default class PageGallery extends React.Component {
    render(){
        const links = this.props.links.filter(link=>link.type==="page");
        return(
            links.length === 0
            ? ''
            :
            <div className="gallery-column">
                <div>pages</div>
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
        );
    }
}

