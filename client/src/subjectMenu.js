import React from 'react';

export default class SubjectMenu extends React.Component {
    constructor(props){
        super(props);
        var subjects = this.getFiltered();
        var selected = subjects[0].id;
        this.state = {
            subjects: subjects,
            selected: selected
        };
    }

    getFiltered(){
        const exclude = this.props.exclude || [];
        const subjects = this.props.subjects || [];
        var result = subjects.filter(
            subject => !exclude.find(s => s.name === subject.name)
        );
        result.sort((a,b)=>{ return ('' + a.name).localeCompare(b.name); });
        return result;
    }

    handleChange = event => {
        this.setState({selected: event.target.value});
        this.props.onChange(event.target.value);
    }

    render(){
        var subjects = this.state.subjects;
        var options = subjects.map(
            subject => (<option key={subject.id} value={subject.id}>{subject.name}</option>)
        );
        return(
            <select
                value={this.state.selected}
                onChange={this.handleChange}
            >
                {options}
            </select>
        );
    }
}

