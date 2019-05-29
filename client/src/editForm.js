import React from 'react';

export default class EditForm extends React.Component{
    constructor(props){
        super(props);

        console.log('EditForm props',props);

        this.state = {
            link: props.link,
        };
    }
    
    handleClickList = event => {
        this.props.back();
    }

    render(){
        const link = this.state.link;
        return (
            <ul className="form-list">
                <li>id: {link.id}</li>
                <li>url: {link.url}</li>
                <li>type: {link.type}</li>
                <li><button onClick={()=>this.handleClickList()}>list</button></li>
            </ul>
        )
    }
}
