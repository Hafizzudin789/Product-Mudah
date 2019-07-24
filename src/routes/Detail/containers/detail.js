import { connect } from "react-redux";
import Detail from "../components/detail";

import { 
    getDetail,
    getSimilar,
} from "../modules/ExportFunction";

const mapDispatchToProps = {
    getDetail,
    getSimilar,
};

const mapStateToProps = (state) => ({
    attributes: state.detail.attributes,
    links: state.detail.links,
    similar: state.detail.similar,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Detail);
