import React from 'react';

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
        return (
            <div className="list-view padded-content">
                <div className={"list-view-content"}>
                    <ul className="form-list">
                    {
                        this.props.links
                        ? this.props.links.map(link => (
                            <li className={"link-listing"} key={link.id}>
                                <button onClick={() => this.props.handleClickEdit(link)}>
                                    edit
                                </button>
                                {this.linkDisplay(link)}
                            </li>
                        ))
                        : ""
                    }
                    </ul>
                </div>
            </div>
        );
    }
}

