import React from 'react';

export default class CreateSubjectForm extends React.Component {
    state = {
        name: "",
    };

    componentDidMount(){
        this.nameInput.focus();
    }

    handleNameChange = event => {
        var newName = event.target.value;
        this.setState({name:newName});
    };

    handleKeyDown = event => {
        if(event.key === 'Enter'){
            this.handleSubmit();
        }
    };

    handleSubmit = event => {
        this.props.submit(this.state.name);
    };

    render() {
        return (
            <div className="little-form">
                <div className="form-title">
                    {"create new subject"}
                </div>
                <div className="spaced-row">
                    <input
                        ref={(input)=>{this.nameInput=input;}}
                        type="text"
                        value={this.state.name}
                        onChange={this.handleNameChange}
                        onKeyDown={this.handleKeyDown}
                    />
                    <button onClick={this.handleSubmit}>submit</button>
                </div>
            </div>
        );
    }
}

