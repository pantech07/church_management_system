const config = {
    production:{
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    },
    default:{
        //secret string used in generating token//
        SECRET: 'GRACEFAMILYPANTHERA',
        //database URL to connect to//
        DATABASE: 'mongodb://localhost:27017/graceFamily'
    }
}

exports.get = function get(env){
    return config[env] || config.default
} 
