import React from 'react';

export default class ImageView extends React.Component {
    render(){
        return(
            <div className={"image-view"}>
                <img alt="fullview" src={this.props.link.url}/>
            </div>
        );
    }
}
