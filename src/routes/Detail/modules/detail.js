import Action from "./ActionConstants";
import INITIAL_STATE from "./InitialState";
import ACTION_HANDLERS from "./ActionHandlers";

export default function detailReducer(state = INITIAL_STATE, action) {
    const handler = ACTION_HANDLERS[action.type];
    state = action.type === Action.RESET_STATE_DETAIL ? INITIAL_STATE : state;
    return handler ? handler(state, action) : state;
}
