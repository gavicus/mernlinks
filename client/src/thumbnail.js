import React from 'react';

// props: src onClick id thumbstyle size

export default class Thumbnail extends React.Component {
    getSize() {
        if(this.props.size){
            return this.props.size;
        }
        else return 60;
    }

    getClass() {
        var c = "thumbnail";
        if(this.props.thumbstyle){
            c += " " + this.props.thumbstyle;
        }
        return c;
    }

    handleClick = event => {
        if(this.props.onClick){
            this.props.onClick(this.props.id);
        }
    }

    render(){
        return(
            <div
                className={this.getClass()}
                style={{width: this.getSize(), height: this.getSize()}}
                onClick={this.handleClick}
            >
                <img src={this.props.src}/>
            </div>
        );
    }
}

