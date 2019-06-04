import React from 'react';

export default class SubjectsView extends React.Component{
    state = {
        newSubjectName: '',
    };

    subjectLine(subject){
        return(
            <div className="subject-entry">
                <span className="subject-name">{subject.name}</span>
            </div>
        );
    }

    handleInput = event => {
        this.setState({newSubjectName: event.target.value});
    }

    handleKeyDown = event => {
        if(event.key === 'Enter'){
            this.props.createSubject({name:this.state.newSubjectName});
        }
    }

    render(){
        var subjects = this.props.subjects;
        subjects.sort((a,b)=>{ return ('' + a.name).localeCompare(b.name); });
        return(
            <div id="subjects-view" className="padded-content">
                <input
                    type="text"
                    placeholder="new"
                    onKeyDown={this.handleKeyDown}
                    onChange={this.handleInput}
                />
                <ul className="form-list">
                    {subjects.map(subject => (
                        <li key={subject.id}> {this.subjectLine(subject)} </li>
                    ))}
                </ul>
            </div>
        );
    }
}
