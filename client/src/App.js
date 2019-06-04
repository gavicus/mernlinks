import React, {Component} from 'react';
import gql from "graphql-tag";
import {graphql, compose} from 'react-apollo';
import EditForm from './editForm';
import ListView from './listView';
import GalleryView from './galleryView';
import ImageView from './imageView';
import SubjectsView from './subjectsView';
import FilterForm from './filterForm';

const ViewState = {list:0, edit:1, gallery:2, image:3, subjects:4};

const LinksQuery = gql`
    {
        links {
            id
            url
            type
            subjects {
                id
                name
            }
        }
    }
`;

const SubjectsQuery = gql`
    {
        subjects {
            id
            name
        }
    }
`;

const CreateLinkMutation = gql`
    mutation($url: String!, $type: String!){
        createLink(url: $url, type: $type) {
            id
            url
            type
        }
    }
`;

const CreateSubjectMutation = gql`
    mutation($name: String!){
        createSubject(name: $name){
            id
            name
        }
    }
`;

const UpdateLinkMutation = gql`
    mutation($id: ID!, $url: String!, $type: String!, $subjects: [SubjectInput]){
        changeLink(id: $id, url: $url, type: $type, subjects: $subjects)
    }
`;

const RemoveLinkMutation = gql`
    mutation($id: ID!) {
        removeLink(id: $id)
    }
`;


class App extends Component {
    constructor(props){
        super(props);

        console.log('props',this.props.params);

        this.state = {
            view: ViewState.list,
            selected: null,
            criteria: null,
            filtered: null,
        };
    }

    createLink = async formData => {
        const url = formData.url;
        const type = formData.type;
        const subjects = [];
        await this.props.createLink({
            variables: {
                url,
                type,
            },
            update: (store, { data: {createLink}})=>{
                const data = store.readQuery({query: LinksQuery});
                data.links.unshift(createLink);
                store.writeQuery({query: LinksQuery, data});
            },
            refetchQueries: [{
                query: LinksQuery,
                variables: {url,type,subjects}
            }],
        });
    };

    changeLink = async link => {
        await this.props.changeLink({
            variables: {
                id: link.id,
                url: link.url,
                type: link.type,
                subjects: link.subjects.map(s=>({id:s.id, name:s.name})),
            },
            update: store => {
                const data = store.readQuery({query: LinksQuery});
                data.links = data.links.map(
                    x => x.id === link.id
                        ? {
                            ...link,
                            url: link.url,
                            type: link.type,
                            subjects: link.subjects
                        }
                        : x
                );
                store.writeQuery({query: LinksQuery, data});
            }
        });
    };

    removeLink = async link => {
        await this.props.removeLink({
            variables: {
                id: link.id,
            },
            update: store => {
                const data = store.readQuery({query: LinksQuery});
                this.props.linksQuery.links = data.links.filter(x => x.id !== link.id);
                store.writeQuery({query: LinksQuery, data});
            },
        });
    };

    createSubject = async formData => {
        const name = formData.name;
        await this.props.createSubject({
            variables: {
                name
            },
            update: (store, { data: {createSubject}})=>{
                const data = store.readQuery({query: SubjectsQuery});
                data.subjects.unshift(createSubject);
                store.writeQuery({query: SubjectsQuery, data});
            },
        });
    };

    handleClickEdit = link => {
        this.setState({
            selected: link,
            view: ViewState.edit,
        },this.applyCriteria);
    };

    handleClickList = event => {
        this.setState({view: ViewState.list},this.applyCriteria);
    };

    handleClickRemove = event => {
        const link = this.state.selected;
        this.removeLink(link);
        this.handleClickList();
    };

    handleEditSubmit = updatedLink => {
        this.changeLink(updatedLink);
        this.handleClickList();
    };

    handleNav = btnText => {
        var index;
        var links = this.state.filtered || this.props.linksQuery.links;
        if(btnText === "next"){
            index = links.indexOf(this.state.selected) + 1;
            if(index === links.length){ index = 0; }
            this.setState({selected: links[index]});
            return;
        }
        if(btnText === "prev"){
            index = links.indexOf(this.state.selected) - 1;
            if(index < 0){ index = links.length - 1; }
            this.setState({selected: links[index]});
            return;
        }
        if(btnText.startsWith("subject:")){
            var subjectName = btnText.split(": ")[1];
            var subjectObj = this.props.subjectsQuery.subjects.find(
                s => s.name === subjectName
            );
            var criteria = {
                subject: subjectObj.id,
                type: "image",
            };
            this.setState({
                view: ViewState.gallery,
                criteria: criteria,
            }, this.applyCriteria);
            return;
        }
        this.setState({view: ViewState[btnText]}, this.applyCriteria);
    };

    handleGalleryClick = link => {
        this.setState({
            selected: link,
            view: ViewState.image,
        }, this.applyCriteria);
    };

    handleAddLinkSubject = (subjectId) => {
        var link = this.state.selected;
        if(!link.subjects){ link.subjects = []; }
        var subject = this.props.subjectsQuery.subjects.find(s=>s.id===subjectId);
        link.subjects.push(subject);
        this.changeLink(link);
    };

    handleRemoveLinkSubject = (subjectId) => {
        var link = this.state.selected;
        var subject = this.props.subjectsQuery.subjects.find(s=>s.id===subjectId);

        //link.subjects.push(subject);
        var index = link.subjects.indexOf(subject);
        link.subjects.splice(index,1);

        this.changeLink(link);
    }

    getPageMarkup(){
        switch(this.state.view){
            case ViewState.edit: return this.renderEdit();
            case ViewState.gallery: return this.renderGallery();
            case ViewState.image: return this.renderImage();
            case ViewState.subjects: return this.renderSubjects();
            default: return this.renderList();
        }
    }

    applyCriteria = () => {
        const criteria = this.state.criteria || {};
        if(this.state.view === ViewState.image){
            criteria.type = "image";
        }
        var links = this.props.linksQuery.links;
        if(criteria.type){
            links = links.filter(k=>k.type === criteria.type);
        }
        if(criteria.subject){
            var subjectObj = this.props.subjectsQuery.subjects
                .find(s => s.id === criteria.subject);
            var subjectName = subjectObj.name;
            links = links.filter(k=>(!!k.subjects.find(s => s.name === subjectName)));
        }
        this.setState({filtered: links});
    }

    handleFilter = criteria => {
        this.setState({criteria: criteria}, this.applyCriteria);
    }

    render(){
        const loading = this.props.linksQuery.loading 
            || this.props.subjectsQuery.loading;

        if(loading){ return null; }

        var navClass = "";
        var navs = ["list","gallery","subjects"];
        if(this.state.view === ViewState.image){
            navs.push("prev");
            navs.push("next");
            var subjects = this.state.selected.subjects;
            for(var s of subjects){
                navs.push("subject: " + s.name);
            }
            navClass = "image-view";
        }
        return (
            <div id="wrapper">
                <div className="nav-wrapper">
                    <nav className={navClass}>
                        {
                            navs.map(v => (
                                <button onClick={()=>this.handleNav(v)} key={v}>
                                    {v}
                                </button>
                            ))
                        }
                    </nav>
                    {
                        this.state.view === ViewState.image
                        ? null
                        :
                        <FilterForm
                            subjects={this.props.subjectsQuery.subjects}
                            onChange={this.handleFilter}
                            criteria={this.state.criteria}
                            forceType={
                                this.state.view === ViewState.gallery
                                ? "image"
                                : null
                            }
                        />
                    }
                </div>
                <main>
                    {this.getPageMarkup()}
                </main>
            </div>
        );
    }

    renderList(){
        var links = this.state.filtered || this.props.linksQuery.links;
        return (
            <ListView
                links={links}
                createLink={this.createLink}
                handleClickEdit={this.handleClickEdit}
                subjects={this.props.subjectsQuery.subjects}
            />
        );
    }

    renderEdit(){
        return (
            <EditForm
                submit={this.handleEditSubmit}
                link={this.state.selected}
                remove={this.handleClickRemove}
                subjects={this.props.subjectsQuery.subjects}
                addSubject={this.handleAddLinkSubject}
                removeSubject={this.handleRemoveLinkSubject}
            />
        );
    }

    renderGallery(){
        var links = this.state.filtered || this.props.linksQuery.links;
        return (
            <GalleryView
                links={links}
                click={this.handleGalleryClick}
            />
        );
    }

    renderImage(){
        return (
            <ImageView
                link={this.state.selected}
            />
        );
    }

    renderSubjects(){
        const subjects = this.props.subjectsQuery.subjects;
        return (
            <SubjectsView
                subjects={subjects}
                createSubject={this.createSubject}
            />
        );
    }

}

export default compose(
    graphql(CreateLinkMutation, {name: "createLink"}),
    graphql(UpdateLinkMutation, {name: "changeLink"}),
    graphql(RemoveLinkMutation, {name: "removeLink"}),
    graphql(CreateSubjectMutation, {name: "createSubject"}),
    graphql(SubjectsQuery, {name: "subjectsQuery"}),
    graphql(LinksQuery, {name: "linksQuery"}),
)(App);

