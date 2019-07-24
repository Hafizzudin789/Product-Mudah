import { injectReducer } from "../../store/reducers";

export default (store) => ({
    path: "detail/:id",
    /*  Async getComponent is only invoked when route matches   */
    getComponent(nextState, cb) {
        /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
        require.ensure(
            [],
            (require) => {
                /*  Webpack - use require callback to define
          dependencies for bundling   */
                const Detail = require("./containers/detail").default;
                const reducer = require("./modules/detail").default;

                /*  Add the reducer to the store on key 'counter'  */
                injectReducer(store, { key: "detail", reducer });

                /*  Return getComponent   */
                cb(null, Detail);

                /* Webpack named bundle   */
            },
            "detail",
        );
    },
});
