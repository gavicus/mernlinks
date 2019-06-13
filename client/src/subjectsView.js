import React from 'react';
import './subjectsView.css';

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

    countLinksOfSubject(subject){
        var count = 0;
        for(var link of this.props.links){
            for(var s of link.subjects){
                if( subject.name === s.name ){
                    ++count;
                    break;
                }
            }
        }
        return count;
    }

    renderSubject(subject){
        return(
            <div
                key={subject.id}
                onClick={()=>this.props.onClick(subject.id)}
                className="subject-thumbnail"
            >
                <div className="subject-thumb">
                    <div className="links-count">
                        {this.countLinksOfSubject(subject)}
                    </div>
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

