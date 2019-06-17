import React, {Component} from 'react';
import gql from "graphql-tag";
import {graphql, compose} from 'react-apollo';
import EditForm from './editForm';
import ListView from './listView';
import GalleryView from './galleryView';
import ImageView from './imageView';
import SubjectsView from './subjectsView';
import SubjectView from './subjectView';
import FilterForm from './filterForm';
import CreateForm from './createform';
import CreateSubjectForm from './createSubject';

const ViewState = {list:0, edit:1, gallery:2, image:3, subjects:4, subject:5};

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
            thumburl
        }
    }
`;

const SubjectsQuery = gql`
    {
        subjects {
            id
            name
            thumburl
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
    mutation($id: ID!, $url: String!, $type: String!, $subjects: [SubjectInput], $thumburl: String){
        changeLink(id: $id, url: $url, type: $type, subjects: $subjects, thumburl: $thumburl)
    }
`;

const UpdateSubjectMutation = gql`
    mutation($id: ID!, $name: String!, $thumburl: String){
        changeSubject(id: $id, name: $name, thumburl: $thumburl)
    }
`;

const RemoveLinkMutation = gql`
    mutation($id: ID!) {
        removeLink(id: $id)
    }
`;

const RemoveSubjectMutation = gql`
    mutation($id: ID!) {
        removeSubject(id: $id)
    }
`;


class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            view: ViewState.subjects,
            selected: null,
            criteria: null,
            filtered: null,
            activeModal: null,
            subjectLinks: null,
        };
    }

    createLink = async formData => {
        const url = formData.url;
        const type = formData.type;
        await this.props.createLink({
            variables: {
                url,
                type,
            },
            update: (store, { data: {createLink}})=>{
                const data = store.readQuery({query: LinksQuery});
                data.links.unshift(createLink);
                store.writeQuery({query: LinksQuery, data});

                if(this.state.view === ViewState.subject){
                    var subject = this.state.selected;
                    createLink.subjects = [subject];
                    this.changeLink(createLink);
                }
                else{
                    this.handleClickEdit(createLink);
                }

                this.setState({activeModal: null});
            },
            refetchQueries: [{
                query: LinksQuery,
                variables: ['url','type','subjects']
            }],
        });
    };

    changeLink = async link => {
	var subjects = link.subjects || [];
        await this.props.changeLink({
            variables: {
                id: link.id,
                url: link.url,
                type: link.type,
                subjects: subjects.map(s=>({id:s.id, name:s.name})),
                thumburl: link.thumburl,
            },
            update: store => {
                const data = store.readQuery({query: LinksQuery});
                data.links = data.links.map(
                    x => x.id === link.id
                        ? {
                            ...link,
                            url: link.url,
                            type: link.type,
                            subjects: link.subjects,
                            thumburl: link.thumburl,
                        }
                        : x
                );
                store.writeQuery({query: LinksQuery, data});
            },
            refetchQueries: [{
                query: LinksQuery,
                variables: ['url','type','subjects']
            }],
        });
    };

    changeSubject = async subject => {
        await this.props.changeSubject({
            variables: {
                id: subject.id,
                name: subject.name,
                thumburl: subject.thumburl,
            },
            update: store => {
                const data = store.readQuery({query: SubjectsQuery});
                data.subjects = data.subjects.map(
                    x => x.id === subject.id
                        ? {
                            ...subject,
                            name: subject.name,
                            thumburl: subject.thumburl,
                        }
                        : x
                );
                store.writeQuery({query: SubjectsQuery, data});
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
                this.props.linksQuery.links = data.links.filter(
                    x => x.id !== link.id
                );
                store.writeQuery({query: LinksQuery, data});
            },
        });
    };

    removeSubject = async subject => {
        // first remove this subject from all links
        var links = this.props.linksQuery.links;
        for(var link of links){
            while(true){
                var index = link.subjects.find(x=>x.name===subject.name);
                if(index===undefined){ break; }
                link.subjects.splice(index,1);
            }
            this.changeLink(link);
        }
        // remove the subject from the database
        await this.props.removeSubject({
            variables: {
                id: subject.id,
            },
            update: store => {
                const data = store.readQuery({query: SubjectsQuery});
                this.props.subjectsQuery.subjects = data.subjects.filter(
                    x => x.id !== subject.id
                );
                store.writeQuery({query: SubjectsQuery, data});
                this.applyCriteria();
            },
            refetchQueries: () => [{
                query: SubjectsQuery,
                variables: [{id: true}]
            }],
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
                this.setState({activeModal: null});
                this.handleClickSubject(createSubject.id);
            },
            refetchQueries: [{
                query: SubjectsQuery,
                variables: {name}
            }],
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

    handleDeleteSubject = event => {
        const subject = this.state.selected;
        this.removeSubject(subject);
        this.setState({ criteria:{} }, this.applyCriteria);
        this.setState({view: ViewState.subjects});
    };

    handleEditSubmit = updatedLink => {
        this.changeLink(updatedLink);
        this.handleClickList();
    };

    handleNav = btnText => {
        var index;
        var links = this.state.filtered || this.props.linksQuery.links;
        if(btnText === "filter"){ return this.toggleModal(btnText); }
        if(btnText === "new link"){ return this.toggleModal(btnText); }
        if(btnText === "new subject"){ return this.toggleModal(btnText); }
        if(btnText === "edit"){
            return this.handleClickEdit(this.state.selected);
        }
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
            this.handleClickSubject(subjectObj.id);
            return;
        }
        this.setState({ criteria:{} }, this.applyCriteria);
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
            case ViewState.subject: return this.renderSubject();
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
            if(criteria.subject === 0){
                links = links.filter(k=>(!k.subjects || k.subjects.length === 0));
            }
            else {
                var subjectObj = this.props.subjectsQuery.subjects
                    .find(s => s.id === criteria.subject);
                var subjectName = subjectObj.name;
                links = links.filter(k=>(!!k.subjects.find(s => s.name === subjectName)));
            }
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
        var navs = [
            //"gallery",
            "subjects",
            "list",
        ];
        if(this.state.view === ViewState.image){
            navs.push("edit");
            var subjects = this.state.selected.subjects;
            for(var s of subjects){
                navs.push("subject: " + s.name);
            }
            navClass = "image-view";
        }
        if(this.state.view !== ViewState.subjects
            && this.state.view !== ViewState.image
        ){ navs.push("filter"); }
        if(this.state.view === ViewState.list
            || this.state.view === ViewState.gallery
            || this.state.view === ViewState.subjects
            || this.state.view === ViewState.subject
        ){ navs.push("new link"); }
        if(this.state.view === ViewState.subjects){
            navs.push("new subject");
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
                </div>
                <main>
                    {this.getPageMarkup()}
                </main>

                {
                this.state.activeModal
                ?
                <div id="full-page-blur">
                    <div id="modal-form">
                        {this.renderModalForm()}
                    </div>
                </div>
                : null
                }

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

    toggleModal(formName){
        if(this.state.activeModal){
            this.setState({activeModal: null});
        }
        else {
            this.setState({activeModal: formName});
        }
    }

    renderModalForm(){
        var args;
        switch(this.state.activeModal){
            case "filter":
                args = {
                    subjects: this.props.subjectsQuery.subjects,
                    onChange: this.handleFilter,
                    criteria: this.state.criteria,
                }
                return ( <FilterForm {...args} /> );
            case "new link":
                args = {
                    submit: this.createLink,
                    defaultType: "image",
                };
                return ( <CreateForm {...args} /> );
            case "new subject":
                args = {
                    submit: this.handleNewSubject
                };
                return ( <CreateSubjectForm {...args} /> );
            default: return null;
        }
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
                clickEdit={this.handleClickEdit}

            />
        );
    }

    renderImage(){
        return (
            <ImageView
                link={this.state.selected}
                next={this.handleNextImage}
            />
        );
    }

    renderSubjects(){
        return (
            <SubjectsView
                links={this.props.linksQuery.links}
                subjects={this.props.subjectsQuery.subjects}
                createSubject={this.createSubject}
                onClick={this.handleClickSubject}
            />
        );
    }

    renderSubject(){
        return (
            <SubjectView
                links={this.state.subjectLinks}
                subject={this.state.selected}
                submit={this.handleSubjectEditSubmit}
                click={this.handleGalleryClick}
                handleClickEdit={this.handleClickEdit}
                handleDelete={this.handleDeleteSubject}
            />
        );
    }

    handleNewSubject = name => {
        this.createSubject({name: name});
    };

    handleSubjectEditSubmit = subject => {
        this.changeSubject(subject);
        this.handleClickList();
    };

    updateSubjectLinks = () => {
        var links = this.props.linksQuery.links;
        var subject = this.state.selected;
        if(subject){
            links = links.filter(
                k => !!k.subjects.find(s => s.name === subject.name)
            );
        }
        else{
            links = links.filter(
                k => !k.subjects || k.subjects.length === 0
            );
        }
        this.setState({subjectLinks: links});
    };

    handleClickSubject = subjectId => {
        var subject;
        var criteria;
        if(subjectId === 0){
            subject = null;
            criteria = { subject: 0 };
        }
        else {
            subject = this.props.subjectsQuery.subjects
                .find(s => s.id === subjectId);
            criteria = {
                subject: subject.id,
            };
        }
        this.setState({
            criteria: criteria,
            selected: subject,
            view: ViewState.subject,
        }, this.updateSubjectLinks);
    };

    handleNextImage = (direction) => {
        var links = this.state.filtered || this.props.linksQuery.links;
        var index = links.indexOf(this.state.selected);
        index += direction;
        if(index >= links.length){ index = 0; }
        if(index < 0){ index = links.length - 1; }
        this.setState({
            selected: links[index]
        });
    };

}

export default compose(
    graphql(CreateLinkMutation, {name: "createLink"}),
    graphql(UpdateLinkMutation, {name: "changeLink"}),
    graphql(RemoveLinkMutation, {name: "removeLink"}),
    graphql(RemoveSubjectMutation, {name: "removeSubject"}),
    graphql(CreateSubjectMutation, {name: "createSubject"}),
    graphql(SubjectsQuery, {name: "subjectsQuery"}),
    graphql(UpdateSubjectMutation, {name: "changeSubject"}),
    graphql(LinksQuery, {name: "linksQuery"}),
)(App);

