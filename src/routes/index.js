// We only need to import the modules necessary for initial render
import CoreLayout from "../layouts/CoreLayout";
import Listing from "./Listing";
import Detail from "./Detail";


/*  Note: Instead of using JSX, we recommend using react-router
 PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
    path: "/",
    component: CoreLayout,
    indexRoute: { onEnter: (nextState, replace) => replace("/listing") },
    childRoutes: [
        Listing(store),
        Detail(store),
    ],
});

export default createRoutes;
