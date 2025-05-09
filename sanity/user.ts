export default {
    name:"role",
    title: "Role",
    type: "string",
    options:{
        list:[
            { title: "Service Seeker", value:"seeker"},
            { title: "Service Provider", value: "provider"},
        ],
    },
    fields: [
        { name: "name",type: "string" },
        { name: "surname", type: "string" },
        { name: "phoneNumber", type:  "string" },
        { name: "nationality", type:"string" },
        { name: "gender", type:"string"},
        { name:"profession", type:"string"},
        { name: "bio", type: "text"},
        { name: "image", type: "image"},
    ],

   
};