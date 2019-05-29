import React, {Component} from 'react';
import gql from "graphql-tag";
import {graphql, compose} from 'react-apollo';
import CreateForm from './createform';
import EditForm from './editForm';

const LinksQuery = gql`
    {
        links {
            id
            url
            type
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

class App extends Component {
    state = {
        view: "list",
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
                data.links.push(createLink);
                store.writeQuery({query: LinksQuery, data});
            },
        });
    };

    handleClickEdit(link){
        this.setState({
            selected: link,
            view: "edit",
        });
    }

    handleClickList = event => {
        this.setState({view: "list"});
    };

    render(){
        const {data: {loading}} = this.props;
        if(loading){
            return null;
        }
        var markup;
        switch(this.state.view){
            case "edit": markup = this.renderEdit(); break;
            default: markup = this.renderList();
        }
        return <div id="wrapper">{markup}</div>;
    }

    renderList(){
        const {data: {links}} = this.props;
        return (
            <div>
                <div>
                    <CreateForm submit={this.createLink} />
                </div>
                <ul className="form-list">
                {links.map(link => (
                    <li key={link.id}>
                        <button onClick={() => this.handleClickEdit(link)}>
                            edit
                        </button>
                        {link.url}
                    </li>
                ))}
                </ul>
            </div>
        );
    }

    renderEdit(){
        return <EditForm link={this.state.selected} back={this.handleClickList} />
    }
}

export default compose(
    graphql(LinksQuery),
    graphql(CreateLinkMutation, {name: "createLink"}),
)(App);

