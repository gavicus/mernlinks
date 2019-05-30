import React from 'react';

export default class GalleryView extends React.Component {
    constructor(props){
        super(props);
        this.state = { criteria: null, };
    }

    render(){
        return(
            <div className="padded-content">
            {this.props.links
                .filter(link=>link.type==="image")
                .map(link => 
                    <div key={link.id} onClick={()=>this.props.click(link)} className={"thumbnail"}>
                        <img src={link.url} alt="thumb"/>
                    </div>
                )}
            </div>
        );
    }
}

