import React from "react";
import "./PasswordConfirmation.scss";
import InputComponent from "../../InputComponent";
// import { DateTimePicker } from 'react-widgets';
import "react-widgets/dist/css/react-widgets.css";
import moment from "moment";
import momentLocalizer from "react-widgets-moment";
import util from "../../../util/commonUtil";
import encryption from "./../../../util/encrypt";
import store from './../../../main'

class PasswordConfirmation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            scheduleTime: "",
            scheduleTimeRaw: "",
            title: "",
            scheduleTimeForBackend: "",
            meetingTitle: "",
        };

        moment.locale("en");
        momentLocalizer();
    }

    componentDidMount() {
        const { leadDateTime, meetingTitle } = this.props;
        this.setState({
            name: meetingTitle ? meetingTitle : "",
            scheduleTimeRaw: leadDateTime ? moment(leadDateTime).toDate() : new Date(),
            scheduleTime: leadDateTime
                ? util.parseMeetingScheduleDate(moment(leadDateTime).toDate())
                : util.parseMeetingScheduleDate(new Date()),
            scheduleTimeForBackend: leadDateTime
                ? util.parseMeetingScheduleDateForBackend(moment(leadDateTime).toDate())
                : util.parseMeetingScheduleDateForBackend(new Date()),
        });
    }

    handleChangeName = (data) => {
        this.setState({
            name: data.value,
        });
    };

    handleChangeSchedule = (e) => {
        const txt = util.parseMeetingScheduleDate(e);
        const dateForBackend = util.parseMeetingScheduleDateForBackend(e);
        this.setState({
            scheduleTime: txt,
            scheduleTimeRaw: e,
            scheduleTimeForBackend: dateForBackend,
        });
    };

    handleSubmit = () => {
        const {handleSubmitPassword} = this.props
        const {name} = this.state
        const {user, publicKey} = store && store.getState().login;
        const {lanId} = user
        const encryptedPassword = encryption(lanId, name, publicKey);
        handleSubmitPassword(encryptedPassword)
    }

    render() {
        const { toggle } = this.props;
        const { name } = this.state;

        return (
            <div className="pwd-modal">
                <div className="pwd-header">
                    <h3>
                        {"Password Confirmation"}
                        <span>
                            <img src={require("assets/icons/closed-modal-black.svg")} onClick={toggle} />
                        </span>
                    </h3>
                </div>
                <div className="pwd-content">
                    <div className="row">
                        <div className="col-12 wrapper-meeting-agenda">
                            <span>Password</span>
                            <InputComponent
                                name="password"
                                type="password"
                                value={name}
                                className=""
                                handleChange={this.handleChangeName}
                            />
                        </div>
                    </div>
                </div>
                <div className="pwd-footer">
                    <button onClick={toggle} className="btn-cancel">
                        Cancel
                    </button>
                    <button onClick={this.handleSubmit} className="btn-submit">Submit</button>
                </div>
            </div>
        );
    }
}

export default PasswordConfirmation;
