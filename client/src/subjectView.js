import React from 'react';
import CreateForm from './createform';
import GalleryView from './galleryView';

export default class SubjectView extends React.Component {
    constructor(props){
        super(props);
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

    handleClickEdit = link => {
        this.props.handleClickEdit(link);
    };

    handleDeleteSubject = event => {
        this.props.handleDelete();
    };

    render(){
        return (
            <div className="subject-view">
                <div>
                    {
                        this.state.subject
                        ? this.state.subject.name
                        : "no subject"
                    }
                </div>
                    
                {
                this.props.subject
                ?
                <input
                    type="text"
                    value={this.state.subject.name}
                    onChange={this.handleNameChange}
                />
                : null
                }

                {
                    this.props.subject
                    ?
                    <div>
                        {
                        this.props.subject.thumburl
                        ?
                        <img
                            alt="link thumbnail"
                            className="thumbnail"
                            src={this.state.subject.thumburl}
                        />
                        :null
                        }
                        <CreateForm
                            title="thumbnail image"
                            placeholder="thumb url"
                            defaultType="image"
                            hideType={true}
                            submit={this.handleAddThumb}
                        />
                        <button onClick={this.handleSubmit}>submit</button>
                    </div>
                    : null
                }

                {
                this.state.subject
                ?
                <button
                    onClick={this.handleDeleteSubject}
                >
                    delete subject
                </button>
                : null
                }

                <GalleryView
                    links={this.props.links}
                    click={this.handleImageClick}
                    clickEdit={this.handleClickEdit}
                />
            </div>
        );
    }
}
