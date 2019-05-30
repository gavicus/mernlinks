import React from 'react';
import TypeMenu from './typemenu';

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
        return(
            <div id="create-form" className="spaced-row">
                <button onClick={this.handlePaste}>paste</button>
                <input placeholder="new url" value={url} onChange={this.handleUrlChange} />
                <TypeMenu onChange={this.handleTypeChange} value={type} />
                <button onClick={this.handleSubmit}>submit</button>
            </div>
        );
    }
}

