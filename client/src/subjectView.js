import React from 'react';
import './subjectView.css';
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

    renderNameRow(){
        return(
            <div className="row">
                <div className="form-box">
                    {
                    this.state.subject
                    ? <span>
                        subject:<br/>
                        {this.state.subject.name}
                    </span>
                    : <span>"no subject"</span>
                    }
                </div>
                    
                <div className="form-box">
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
                </div>
            </div>
        );
    }

    renderThumbRow(){
        if( this.props.subject ){
            return(
                <div className="row">
                    {this.renderSubjectThumb()}
                    {this.renderThumbForm()}
                    <br/>
                </div>
            );
        }
        return null;
    }

    renderSubjectThumb(){
        if( this.props.subject.thumburl ){
            return (
                <div className="form-box">
                    <img
                        alt="link thumbnail"
                        className="thumbnail"
                        src={this.state.subject.thumburl}
                    />
                </div>
            );
        }
        return null;
    }

    renderThumbForm(){
        return(
            <div className="form-box">
                <CreateForm
                    title="thumbnail image"
                    placeholder="thumb url"
                    defaultType="image"
                    hideType={true}
                    submit={this.handleAddThumb}
                />
            </div>
        );
    }

    render(){
        return (
            <div className="subject-view">
                {this.renderNameRow()}
                {this.renderThumbRow()}

                {
                this.state.subject
                ?
                <div>
                    <button
                        onClick={this.handleSubmit}
                        style={{marginRight:"5px"}}
                    >
                        submit
                    </button>
                    <button
                        onClick={this.handleDeleteSubject}
                    >
                        delete subject
                    </button>
                </div>
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
