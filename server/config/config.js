const config = {
    production:{
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    },
    default:{
        SECRET: 'GRACEFAMILYPANTHERA',
        DATABASE: 'mongodb://localhost:27017/graceFamily'
    }
}

exports.get = function get(env){
    return config[env] || config.default
} 
