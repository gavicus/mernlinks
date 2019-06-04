import React from 'react';
import TypeMenu from './typemenu';
import SubjectMenu from './subjectMenu';

export default class EditForm extends React.Component{
    constructor(props){
        super(props);
        this.state = { subjectToAdd: this.props.subjects[0].id };
    }

    handleUrlChange = event => {
        this.props.link.url = event.target.value;
    }

    handleTypeChange = event => {
        this.props.link.type = event.target.value;
    }

    handleAddSubjectChange = event => {
    }

    handleAddSubjectKeyDown = event => {
    }

    handleSubjectChange = event => {
        this.setState({subjectToAdd: event.target.value});
    }

    handleSubjectMenuChange = event => {
        this.setState({subjectToAdd: event});
    }

    handleClickAddSubject = event => {
        if(this.state.subjectToAdd){
            this.props.addSubject(this.state.subjectToAdd);
            this.forceUpdate();
        }
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
        const link = this.props.link;

        return (
            <div className="padded-content">
                <section>
                    <ul className="form-list">
                        <li>id: {link.id}</li>
                        <li>
                            <label>url
                                <input
                                    onChange={this.handleUrlChange}
                                    value={link.url}
                                />
                            </label>
                        </li>
                        <li><TypeMenu onChange={this.handleTypeChange} value={link.type} /></li>
                        <li><button onClick={()=>this.props.submit(link)}>submit</button></li>
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
                    link.subjects && link.subjects.length > 0
                    ? <div>
                        <p>subjects:</p>
                        <ul className="form-list">
                        {link.subjects.map(s=>(
                            <li key={s.id}>
                                <span
                                    className={"remove-subject-button"}
                                    onClick={()=>this.removeSubject(s.id)}
                                >X&nbsp;</span>
                                {s.name}
                            </li>
                        ))}
                        </ul>
                    </div>
                    : null
                }
                </section>
                {
                    link.type === "image"
                    ? <div><img alt="fullview" src={link.url} /></div>
                    : null
                }
            </div>
        )
    }
}
