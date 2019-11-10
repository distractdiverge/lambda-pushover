const R = require('ramda');

if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    dotenv.config();
}

const getEnvVar = name => R.path(['env', name], process);

const getEnvVarOrDefault = (name, defaultValue) => R.pipe(
    getEnvVar,
    R.defaultTo(defaultValue)
)(name);

const getEnvVarOrError = (name) => {
    const value = getEnvVar(name);
    if (value === undefined) {
        throw new Error(`Environment Variable: '${name}' is undefined.`);
    }
    return value;
};

module.exports = {
    getEnv: getEnvVarOrDefault('NODE_ENV', 'development'),
    getPushoverConfig: () => ({
        appToken: getEnvVarOrError('PUSHOVER_TOKEN'),
        userToken: getEnvVarOrError('PUSHOVER_USER'),
    }),
};