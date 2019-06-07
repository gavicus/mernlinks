import React from 'react';

/*
props:
    link: Link
    next: function(int)
*/

export default class ImageView extends React.Component {
    state = {
        fitScreen: true,
    };

    handleClick = () => {
        this.setState({fitScreen: !this.state.fitScreen});
    };

    render(){
        return(
            <div className={"image-view"} onClick={this.handleClick}>
                <img
                    className={this.state.fitScreen?"fit-screen":""}
                    alt="fullview"
                    src={this.props.link.url}
                />
                <div className="image-nav prev">
                    <div onClick={()=>this.props.next(-1)}>prev</div>
                </div>
                <div className="image-nav next">
                    <div onClick={()=>this.props.next(1)}>next</div>
                </div>
            </div>
        );
    }
}
