import React from 'react';
import CreateForm from './createform';

export default class SubjectView extends React.Component {
    state = {
        subject: this.props.subject,
    };

    handleSubmit = event => {
        this.props.submit(this.state.subject);
    };

    handleAddThumb = event => {
        var subject = this.state.subject;
        subject.thumburl = event.url;
        this.setState({subject: subject});
    };

    handleNameChange = event => {
        var subject = this.state.subject;
        subject.name = event.target.value;
        this.setState({subject: subject});
    };

    render(){
        return (
            <div className="subject-view">
                <div>{this.state.subject.name}</div>
                <input
                    type="text"
                    value={this.state.subject.name}
                    onChange={this.handleNameChange}
                />
                <div>
                    {
                        this.state.subject.thumburl
                        ?
                        <img
                            alt="link thumbnail"
                            className="thumbnail"
                            src={this.state.subject.thumburl}
                        />
                        : null
                    }
                    <CreateForm
                        title="thumbnail image"
                        placeholder="thumb url"
                        defaultType="image"
                        hideType={true}
                        submit={this.handleAddThumb}
                    />
                </div>
                <button onClick={this.handleSubmit}>submit</button>
            </div>
        );
    }
}
