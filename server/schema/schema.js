const Project = require("../models/Project");
const Client = require("../models/Client");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");

//project type
const ProjectType = new GraphQLObjectType({
  name: "project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId);
      },
    },
  }),
});

//client type
const ClientType = new GraphQLObjectType({
  name: "client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        // return projects;
        return Project.find();
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id);
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        // return clients;
        return Client.find();
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return clients.find((client) => client.id === args.id);
        return Client.findById(args.id);
      },
    },
  },
});

//mutation
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    //add Client
     addClient: {
      type:ClientType,
      args:{
        name : {type : GraphQLNonNull(GraphQLString)},
        email : {type : GraphQLNonNull(GraphQLString)},
        phone : {type : GraphQLNonNull(GraphQLString)}
      },
      resolve(parent,args){
        const client= new Client({
          name : args.name,
          email:args.email,
          phone:args.phone
        })
        return client.save()
      }
     } ,
     //delete client
     deleteClient:{
      type:ClientType,
      args:{
        id:{
          type:GraphQLNonNull(GraphQLID)
        }
      },
      resolve(parent,args){
        return Client.findByIdAndRemove(args.id)
      }
     },
     //update a client
     updateClient:{
      type:ClientType,
      args:{
        id:{type:GraphQLNonNull(GraphQLID)},
        name:{type:GraphQLString},
        email:{type:GraphQLString},
        phone:{type:GraphQLString}
      },
      resolve(parent,args){
        return Client.findByIdAndUpdate(
          args.id,{
            $set:{
              name: args.name,
              email:args.email,
              phone:args.phone
            }
          },
          {new:true}
        )
      }
     },
     //add a project
     addProject:{
      type:ProjectType,
      args:{
        name:{type:GraphQLNonNull(GraphQLString)},
        description:{type:GraphQLNonNull(GraphQLString)},
        status:{type:new GraphQLEnumType({
          name :'ProjectStatus',
          values:{
            'new':{value:'Not Started'},
            'progress':{value:'In Progress'},
            'completed':{value:'Completed'}
          }
        }),
        defaultValue:'Not Started'
      },
      clientId:{type:GraphQLNonNull(GraphQLID)}
      },
      resolve(parent,args){
        const project = new Project({
          name:args.name,
          description:args.description,
          status:args.status,
          clientId:args.clientId
        })
        return project.save()
      }
     },
     //Delete a Project
     deleteProject:{
      type : ProjectType,
      args:{
        id:{type:GraphQLNonNull(GraphQLID)}
      },
      resolve(parent,args){
        return Project.findOneAndRemove(args.id)
      }
     },
     //Update a Project
     updateProject:{
      type:ProjectType,
      args:{
        id:{type:GraphQLNonNull(GraphQLID)},
        name:{type:GraphQLString},
        description:{type:GraphQLString},
        status:{
          type:new GraphQLEnumType({
            name:"ProjectStatusUpdate",
            values:{
              'new':{value:"Not Started"},
              'progress':{value:"In Progress"},
              'completed':{value:"Completed"}
            }
          })
        }
      },
      resolve(parent,args){
        return Project.findByIdAndUpdate(
          args.id , {
            $set:{
              name:args.name,
              description:args.description,
              status:args.status
            }
          },
          {new:true}
        )
      }
     } 
    },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
