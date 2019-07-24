/*
 ** Dynamic load service api files basing on config
 ** for default load from aleph server dev backend
 */
let strApiEndpoint = __API_ENDPOINT__ || "development";
let loadedModule = require(`../ServicesConfig/${strApiEndpoint}.js`);
export default loadedModule.default;
