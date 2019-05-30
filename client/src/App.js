import React, {Component} from 'react';
import gql from "graphql-tag";
import {graphql, compose} from 'react-apollo';
import EditForm from './editForm';
import ListView from './listView';
import GalleryView from './galleryView';
import ImageView from './imageView';
import SubjectsView from './subjectsView';

const ViewState = {list:0, edit:1, gallery:2, image:3, subjects:4};

const LinksQuery = gql`
    {
        links {
            id
            url
            type
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
    mutation($id: ID!, $url: String!, $type: String!){
        changeLink(id: $id, url: $url, type: $type)
    }
`;

const RemoveLinkMutation = gql`
    mutation($id: ID!) {
        removeLink(id: $id)
    }
`;


class App extends Component {
    state = {
        view: ViewState.list,
        imageSet: [],
        selected: null,
    };

    createLink = async formData => {
        const url = formData.url;
        const type = formData.type;
        await this.props.createLink({
            variables: {
                url,
                type
            },
            update: (store, { data: {createLink}})=>{
                const data = store.readQuery({query: LinksQuery});
                data.links.unshift(createLink);
                store.writeQuery({query: LinksQuery, data});
            },
        });
    };

    changeLink = async link => {
        await this.props.changeLink({
            variables: {
                id: link.id,
                url: link.url,
                type: link.type,
            },
            update: store => {
                const data = store.readQuery({query: LinksQuery});
                data.links = data.links.map(
                    x => x.id === link.id
                        ? {
                            ...link,
                            url: link.url,
                            type: link.type
                        }
                        : x
                );
                store.writeQuery({query: LinksQuery, data});
                this.updateImageSet();
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
                this.props.data.links = data.links.filter(x => x.id !== link.id);
                store.writeQuery({query: LinksQuery, data});
                this.updateImageSet();
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
        });
    };

    handleClickList = event => {
        this.setState({view: ViewState.list});
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

    handleNav = viewName => {
        if(viewName === "next" || viewName === "prev"){
            var index = this.state.imageSet.indexOf(this.state.selected);
            if(viewName === "next"){
                index++;
                if(index === this.state.imageSet.length){ index = 0; }
            }
            else{
                index--;
                if(index < 0){ index = this.state.imageSet.length - 1; }
            }
            this.setState({selected: this.state.imageSet[index]});
            return;
        }
        this.setState({view: ViewState[viewName]});
        if(viewName==="gallery"){ this.updateImageSet() }
    };

    handleGalleryClick = link => {
        this.setState({
            selected: link,
            view: ViewState.image,
        });
    };

    updateImageSet(){
        this.setState({
            imageSet: this.props.data.links.filter(x => x.type === "image")
        });
    }

    render(){
        const loading = this.props.linksQuery.loading 
            || this.props.subjectsQuery.loading;

        if(loading){ return null; }
        var markup;
        switch(this.state.view){
            case ViewState.edit: markup = this.renderEdit(); break;
            case ViewState.gallery: markup = this.renderGallery(); break;
            case ViewState.image: markup = this.renderImage(); break;
            case ViewState.subjects: markup = this.renderSubjects(); break;
            default: markup = this.renderList();
        }
        var navs = ["list","gallery","subjects"];
        if(this.state.view === ViewState.image){
            navs.push("prev");
            navs.push("next");
        }
        return (
            <div id="wrapper">
                <div className="nav-wrapper">
                    <nav>
                        {
                            navs.map(v => (
                                <button onClick={()=>this.handleNav(v)} key={v}>
                                    {v}
                                </button>
                            ))
                        }
                    </nav>
                </div>
                <main>
                    {markup}
                </main>
            </div>
        );
    }

    renderList(){
        const links = this.props.linksQuery.links;
        return (
            <ListView
                links={links}
                createLink={this.createLink}
                handleClickEdit={this.handleClickEdit}
            />
        );
    }

    renderEdit(){
        return (
            <EditForm
                submit={this.handleEditSubmit}
                link={this.state.selected}
                remove={this.handleClickRemove}
            />
        );
    }

    renderGallery(){
        return (
            <GalleryView
                links={this.state.imageSet}
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

