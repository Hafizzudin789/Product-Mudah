import { connect } from "react-redux";
import Listing from "../components/listing";

import { 
    getData
} from "../modules/ExportFunction";

const mapDispatchToProps = {
    getData
};

const mapStateToProps = (state) => ({
    theData: state.listing.theData,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Listing);
