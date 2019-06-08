import React from 'react';
import TypeMenu from './typemenu';
import SubjectMenu from './subjectMenu';

export default class FilterForm extends React.Component {
    constructor(props){
        super(props);
        var subject = this.props.subjects.length > 0
	    ? this.props.subjects[0].id
	    : null;
        var type = "image";
        var do_subject = false;
        var do_type = (!!this.props.forceType);
        if(this.props.criteria){
            subject = this.props.criteria.subject || subject;
            type = this.props.criteria.type || type;
            do_subject = (!!this.props.criteria.subject);
        }
        this.state = {
            subject: subject, type: type, do_subject: do_subject, do_type: do_type,
        };
    }

    getCriteria(){
        var c = {};
        if(this.state.do_subject){ c.subject = this.state.subject; }
        if(this.state.do_type){ c.type = this.state.type; }
        return c;
    }

    handleSubjectMenuChange = event => {
        this.setState({subject: event}, this.handleStateChange);
    }

    renderTypeMenu(){
        return(
            <div>
                <input type="checkbox" name="type" onClick={this.handleCheck}/>
                <span>type </span>
                <TypeMenu onChange={this.handleTypeChange} value={this.state.type} />
            </div>
        );
    }

    render(){
        return(
            <div className="little-form">
                <div className="spaced-row">
                    {
                        this.props.forceType
                        ? null
                        : this.renderTypeMenu()
                    }
                    <div>
                        <input type="checkbox" name="subject" onClick={this.handleCheck}/>
                        <span>subject </span>
                        <SubjectMenu
                            subjects={this.props.subjects}
                            exclude={[]}
                            onChange={this.handleSubjectMenuChange}
                        />
                    </div>
                </div>
            </div>
        );
    }

    handleTypeChange = event => {
        this.setState({type: event.target.value}, this.handleStateChange);
    }

    handleCheck = event => {
        switch(event.target.name){
            case "subject":
                this.setState({do_subject: event.target.checked}, this.handleStateChange);
                break;
            case "type":
                this.setState({do_type: event.target.checked}, this.handleStateChange);
                break;
            default: break;
        }
    }

    handleStateChange(){
        this.props.onChange(this.getCriteria());
    }
}

