import React from 'react';
import CreateForm from './createform';

export default class ListView extends React.Component{
    linkDisplay(link){
        return (
            <label>{link.type}:&nbsp;
                {
                    link.type === "image"
                    ? <div className={"thumbnail"}> <img src={link.url} alt="thumb"/> </div>
                    : <a href={link.url}>{link.url}</a>
                }
            </label>
        );
    }

    render(){
        const links = this.props.links;
        return (
            <div id="list-view" className="padded-content">
                <div>
                    <CreateForm submit={this.props.createLink} defaultType={"image"} />
                </div>
                <ul className="form-list">
                {links.map(link => (
                    <li className={"link-listing"} key={link.id}>
                        <button onClick={() => this.props.handleClickEdit(link)}>
                            edit
                        </button>
                        {this.linkDisplay(link)}
                    </li>
                ))}
                </ul>
            </div>
        );
    }
}

