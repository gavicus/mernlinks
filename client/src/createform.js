import React from 'react';

export default class CreateForm extends React.Component{
    constructor(props){
        super(props);
        this.types = ['page','image','video'];
        this.state = {
            type: this.types[0],
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
            <div>
                <button onClick={this.handlePaste}>paste</button>
                <input
                    placeholder="new url"
                    value={url}
                    onChange={this.handleUrlChange}
                />
                <select
                    onChange={this.handleTypeChange}
                    value={type}
                >
                    {this.types.map(option => (
                        <option
                            key={option}
                            value={option}
                        >
                            {option}
                        </option>
                    ))}
                </select>
                <button onClick={this.handleSubmit}>
                    submit
                </button>
            </div>
        );
    }
}
