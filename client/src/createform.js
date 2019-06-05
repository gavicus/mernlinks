import React from 'react';
import TypeMenu from './typemenu';

/*
props:
    title: string
    submit: function
    defaultType: string
    placeholder: string
    hideType: boolean
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
                this.setState({url: text});
                this.props.submit(this.state);
            })
    };

    render(){
        const {type,url} = this.state;
        const placeholder = this.props.placeholder || "new url";
        return(
            <div className="little-form">
                <div className="form-title">
                    {this.props.title || "create new link"}
                </div>
                <div className="spaced-row">
                    <button onClick={this.handlePaste}>paste</button>
                    <input placeholder={placeholder} value={url} onChange={this.handleUrlChange} />
                    {
                        this.props.hideType
                        ? null
                        : <TypeMenu onChange={this.handleTypeChange} value={type} />
                    }
                    <button onClick={this.handleSubmit}>submit</button>
                </div>
            </div>
        );
    }
}

