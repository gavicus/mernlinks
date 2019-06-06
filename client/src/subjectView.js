import React from 'react';
import CreateForm from './createform';
import GalleryView from './galleryView';

export default class SubjectView extends React.Component {
    constructor(props){
        super(props);
        //var subjectName = this.props.subject.name;
        //var links = this.props.links.filter(k=>(!!k.subjects.find(s => s.name === subjectName)));
        this.state = {
            subject: this.props.subject,
        };
    }

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

    handleImageClick = event => {
        this.props.click(event);
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
                <GalleryView
                    links={this.props.links}
                    click={this.handleImageClick}
                />
            </div>
        );
    }
}
