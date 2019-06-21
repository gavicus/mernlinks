import React from 'react';

/*
props:
    title: string
    submit: function
    defaultType: string
    placeholder: string
*/

export default class CreateForm extends React.Component{
    constructor(props){
        super(props);
        this.types = ['page','image','video'];
        this.state = {
            type: this.props.defaultType,
            url: ''
        };
    }

    show = typeName => {
        if(!this.props.show){ return true; }
        if(this.props.show.indexOf(typeName) > -1){ return true; }
        return false;
    };

    handleTypeChange = event => {
        this.setState({type: event.target.value});
    };

    handleUrlChange = event => {
        this.setState({url: event.target.value});
    };

    handleSubmit = event => {
        this.props.submit(this.state);
    };

    handlePaste = event => {
        navigator.clipboard.readText()
            .then(text=>{
                this.setState({url: text},
                    ()=>this.props.submit(this.state)
                );
            })
    };

	handlePasteVideo = event => {
	navigator.clipboard.readText()
	    .then(text=>{
		this.setState(
		    {
			url: text,
			type: "video",
		    },
		    ()=>this.props.submit(this.state)
		);
	    });
	};

    handlePastePage = event => {
        navigator.clipboard.readText()
            .then(text=>{
                this.setState(
                    {
                        url: text,
                        type: "page",
                    },
                    ()=>this.props.submit(this.state)
                );
            });
    };

    render(){
        return(
            <div className="little-form">
                <div className="form-title">
                    {this.props.title || "create new link"}
                </div>
                <div className="spaced-row">
                    {this.show("image")
                    ? <button onClick={this.handlePaste}>paste image</button>
                    : null
                    }
                    {this.show("video")
                    ? <button onClick={this.handlePasteVideo}>paste video</button>
                    : null
                    }
                    {this.show("page")
                    ? <button onClick={this.handlePastePage}>paste page</button>
                    : null
                    }
                </div>
            </div>
        );
    }
}

