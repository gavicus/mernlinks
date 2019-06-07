import React from 'react';

export default class SubjectsView extends React.Component{
    constructor(props){
        super(props);
        var subjects = this.props.subjects;
        subjects.sort((a,b)=>{ return ('' + a.name).localeCompare(b.name); });
        this.state = {
            newSubjectName: '',
            subjects: subjects,
        };
    }

    handleInput = event => {
        this.setState({newSubjectName: event.target.value});
    }

    handleKeyDown = event => {
        if(event.key === 'Enter'){
            this.props.createSubject({name:this.state.newSubjectName});
        }
    }

    renderSubject(subject){
        return(
            <div
                key={subject.id}
                onClick={()=>this.props.onClick(subject.id)}
                className="subject-thumbnail"
            >
                <div className="subject-thumb">
                    {
                    subject.thumburl
                    ? <img
                        src={subject.thumburl}
                        alt="subject thumbnail"
                      />
                    : null
                    }
                </div>
                <div className="subject-name">{subject.name}</div>
            </div>
        );
    }

    render(){
        var subjects = this.state.subjects;
        return(
            <div id="subjects-view" className="padded-content">
                <input
                    type="text"
                    placeholder="new"
                    onKeyDown={this.handleKeyDown}
                    onChange={this.handleInput}
                />
                <div>
                    {subjects.map(subject => this.renderSubject(subject))}
                    {this.renderSubject({id:0, name:"no subject"})}
                </div>
            </div>
        );
    }
}

