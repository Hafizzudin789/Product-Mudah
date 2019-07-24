import React from "react";
import "./UpdateSuccess.scss";
// import { DateTimePicker } from 'react-widgets';
import "react-widgets/dist/css/react-widgets.css";
import moment from "moment";
import momentLocalizer from "react-widgets-moment";
// import util from '../../../util/commonUtil';

class UpdateSuccess extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        moment.locale("en");
        momentLocalizer();
    }

    componentDidMount() {}

    render() {
        const { toggle } = this.props;

        return (
            <div className="updatesuccess-modal">
                <div className="updatesuccess-header">
                    <h3>
                        {"Update Success!"}
                        <span>
                            <img src={require("assets/icons/closed-modal-black.svg")} onClick={toggle} />
                        </span>
                    </h3>
                </div>
                <div className="updatesuccess-content">
                    <div className="row justify-content-center">
                        <div className="col-1">
                            <img src={require("assets/img/success-tickround.jpg")} />
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-6 wrapper-meeting-agenda">
                            <div className="msg">Schedule has been updated!</div>
                        </div>
                    </div>
                </div>
                <div className="updatesuccess-footer">
                    <button onClick={toggle} className="btn-submit">
                        Ok
                    </button>
                </div>
            </div>
        );
    }
}

export default UpdateSuccess;
