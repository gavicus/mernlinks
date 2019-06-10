import React from 'react';
import TypeMenu from './typemenu';
import SubjectMenu from './subjectMenu';
import CreateForm from './createform';

export default class EditForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            link: this.props.link,
            subjectToAdd: this.props.subjects.length > 0
		? this.props.subjects[0].id
		: null,
        };
    }

    handleUrlChange = event => {
        var link = this.state.link;
        link.url = event.target.value;
        this.setState({link: link});
    };

    handleTypeChange = event => {
        this.props.link.type = event.target.value;
    };

    handleSubjectChange = event => {
        this.setState({subjectToAdd: event.target.value});
    };

    handleSubjectMenuChange = event => {
        this.setState({subjectToAdd: event});
    };

    handleClickAddSubject = event => {
        if(this.state.subjectToAdd){
            this.props.addSubject(this.state.subjectToAdd);
            this.forceUpdate();
        }
    }

    handleAddThumb = event => {
        this.props.link.thumburl = event.url;
    }

    handleSubmit = event => {
        this.props.submit(this.state.link)
    }

    removeSubject = subjectId => {
        this.props.removeSubject(subjectId);
        this.forceUpdate();
    }

    renderSubjectsMenu(){
        if(!this.props.link.subjects){ this.props.link.subjects = []; }
        var filtered = this.props.subjects.filter(
            subject => !this.props.link.subjects.find(s => s.name === subject.name)
        );
        var options = filtered.map(
            subject => (<option key={subject.id} value={subject.id}>{subject.name}</option>)
        );
        return(
            <select value={this.state.subjectToAdd} onChange={this.handleSubjectChange}>{options}</select>
        );
    }

    render(){
        return (
            <div className="padded-content">
                <section>
                    <ul className="form-list">
                        <li>id: {this.props.link.id}</li>
                        <li>
                            <label>url
                                <input
                                    style={{width:'100%'}}
                                    onChange={this.handleUrlChange}
                                    value={this.state.link.url}
                                />
                            </label>
                        </li>
                        <li><TypeMenu onChange={this.handleTypeChange} value={this.props.link.type} /></li>
                        <li>
                            {
                                this.props.link.thumburl
                                ?
                                <img alt="link thumbnail" className="thumbnail" src={this.props.link.thumburl} />
                                : null
                            }
                            <CreateForm
                                title="thumbnail image"
                                placeholder="thumb url"
                                defaultType="image"
                                hideType={true}
                                submit={this.handleAddThumb}
                            />
                        </li>
                        <li><button onClick={this.handleSubmit}>submit</button></li>
                        <li><button onClick={()=>this.props.remove()}>remove</button></li>
                    </ul>
                </section>
                <section>
                    <div>
                        <SubjectMenu
                            subjects={this.props.subjects}
                            exclude={this.props.link.subjects}
                            onChange={this.handleSubjectMenuChange}
                        />
                        <button onClick={this.handleClickAddSubject}>add subject</button>
                    </div>
                {
                    this.props.link.subjects && this.props.link.subjects.length > 0
                    ? <div>
                        <p>subjects:</p>
                        <ul className="form-list">
                        {this.props.link.subjects.map(s=>(
                            <li key={s.id}>
                                <div className="subject-entry">
                                    <span
                                        className={"remove-subject-button"}
                                        onClick={()=>this.removeSubject(s.id)}
                                    >X&nbsp;</span>
                                    <span className="subject-name">{s.name}</span>
                                </div>
                            </li>
                        ))}
                        </ul>
                    </div>
                    : null
                }
                </section>
                {
                    this.props.link.type === "image"
                    ? <div><img className="small-view" alt="small view" src={this.props.link.url} /></div>
                    : null
                }
            </div>
        )
    }
}
