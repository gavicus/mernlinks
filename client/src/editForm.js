import React from 'react';
import TypeMenu from './typemenu';

export default class EditForm extends React.Component{
    constructor(props){
        super(props);
        this.state = { link: props.link, };
    }

    handleUrlChange = event => {
        console.log('handleUrlChange', event.target.value);
        this.setState({link: {...this.state.link, url: event.target.value}});
    }

    handleTypeChange = event => {
        console.log('handleTypeChange', event.target.value);
        this.setState({link: {...this.state.link, type: event.target.value}});
    }

    render(){
        const link = this.state.link;
        return (
            <div className="padded-content">
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
                <li><button onClick={()=>this.props.submit(this.state.link)}>submit</button></li>
                <li><button onClick={()=>this.props.remove()}>remove</button></li>
            </ul>
            </div>
        )
    }
}
