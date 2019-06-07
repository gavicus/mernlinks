import React from 'react';
import { NavLink } from "react-router-dom";
import FilterForm from './filterForm';

/*
props:
    view
    selected
    subjects
    criteria
    states
*/

export default class Navigation extends React.Component {
    render(){
        console.log('this.props',this.props);

        //var pageName = this.props.match.url.split("/")[1];

        //console.log('pageName',pageName);

        var navs = ["list","gallery","subjects"];
        if(this.props.view === this.props.states.image){
            navs.push("prev");
            navs.push("next");
            navs.push("edit");
            //var subjects = this.props.selected.subjects;
            //for(var s of subjects){
            //    navs.push("subject: " + s.name);
            //}
            //navClass = "image-view";
        }

        console.log('imageview',this.props.isImageView);

        return (
            <div id="wrapper">
                <div className="nav-wrapper">

                    <NavLink className="nav-link" to="/">List</NavLink>
                    <NavLink className="nav-link" to="/gallery">Gallery</NavLink>
                    <NavLink className="nav-link" to="/subjects">Subjects</NavLink>

                    {
                    this.props.isImageView
                    ?
                    <span>
                        <button onClick={()=>this.props.callback({command:"prev"})}>{"<"}</button>
                        <button onClick={()=>this.props.callback({command:"next"})}>{">"}</button>
                        <button onClick={()=>this.props.callback({command:"edit"})}>edit</button>
                    </span>
                    :
                    <FilterForm
                        subjects={this.props.subjects}
                        onChange={this.handleFilter}
                        criteria={this.props.criteria}
                    />
                    }
                </div>
            </div>
        );
    }
}
