const handleGetDetail = (state, action) => ({
    ...state,
    attributes: action.payload.data.attributes,
    links: action.payload.links,
})

const handleGetSimilar = (state, action) => ({
    ...state,
    similar: action.payload.data,
})

export default {
    GET_DETAIL: handleGetDetail,
    GET_SIMILAR: handleGetSimilar,
};
