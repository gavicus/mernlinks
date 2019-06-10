import React from 'react';

export default class SubjectsView extends React.Component{
    constructor(props){
        super(props);
        var subjects = this.props.subjects;
        this.state = {
            newSubjectName: '',
            subjects: subjects,
        };
    }

    componentDidMount(){
        var subjects = this.state.subjects;
        if(subjects){
            subjects.sort((a,b)=>{
                return ('' + a.name).localeCompare(b.name);
            });
        }
        this.setState({subjects: subjects});
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
        return(
            <div id="subjects-view" className="padded-content">
                <div>
                    {
                    this.state.subjects
                    ?
                    this.state.subjects.map(
                        subject => this.renderSubject(subject)
                    )
                    : null
                    }
                    {this.renderSubject({id:0, name:"no subject"})}
                </div>
            </div>
        );
    }
}

