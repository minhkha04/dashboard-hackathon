import 'dotenv/config';

const env = {
    PORT: process.env.PORT,
    CORS_ORIGIN: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
        : ['*'],
    
    PREFIX_API: process.env.PREFIX_API,
}

export default env;