import React from 'react';

export default class TypeMenu extends React.Component{
    constructor(props){
        super(props);
        this.types = ['page','image','video'];
    }

    render(){
        return(
            <select onChange={this.props.onChange} value={this.props.value} >
                {this.types.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        );
    }
}

