const { GraphQLServer } = require('graphql-yoga')
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/test");

const Subject = mongoose.model("Subject", {
    name: String,
    thumburl: String,
    thumbstyle: String,
});

const Link = mongoose.model("Link", {
    url: String,
    type: String,
    subjects: [Subject.schema],
    thumburl: String,
    thumbstyle: String,
});

const typeDefs = `
  type Query {
    hello(name: String): String!
    links: [Link]
    subjects: [Subject]
  }
  type Subject {
    id: ID!
    name: String!
    thumburl: String
    thumbstyle: String
  }
  input SubjectInput {
    id: ID!
    name: String!
    thumburl: String
    thumbstyle: String
  }
  type Link {
    id: ID!
    url: String!
    type: String!
    subjects: [Subject]
    thumburl: String
    thumbstyle: String
  }
  input LinkInput {
    id: ID!
    url: String!
    type: String!
    subjects: [SubjectInput]
    thumburl: String
    thumbstyle: String
  }
  type Mutation {
    createLink(url: String!, type: String!): Link
    changeLink(id: ID!, url: String!, type: String!, subjects: [SubjectInput], thumburl: String, thumbstyle: String): Boolean
    removeLink(id: ID!): Boolean
    removeSubject(id: ID!): Boolean
    createSubject(name: String!): Subject
    changeSubject(id: ID!, name: String!, thumburl: String, thumbstyle: String): Boolean
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    links: () => Link.find(),
    subjects: () => Subject.find(),
  },
  Mutation: {
    createLink: async (_, {url, type}) => {
        const link = new Link({url,type});
        await link.save();
        return link;
    },
    changeLink: async (_, {id, url, type, subjects, thumburl, thumbstyle}) => {
        await Link.findByIdAndUpdate(id, {url, type, subjects, thumburl, thumbstyle});
        return true;
    },
    removeLink: async (_, {id}) => {
        await Link.findByIdAndRemove(id);
        return true;
    },
    removeSubject: async (_, {id}) => {
        await Subject.findByIdAndRemove(id);
        return true;
    },
    createSubject: async (_, {name}) => {
        const subject = new Subject({name});
        await subject.save();
        return subject;
    },
    changeSubject: async (_, {id, name, thumburl, thumbstyle}) => {
        await Subject.findByIdAndUpdate(id, {name, thumburl, thumbstyle});
        return true;
    },
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })
mongoose.connection.once("open", function(){
    server.start(() => console.log('Server is running on localhost:4000'))
});

