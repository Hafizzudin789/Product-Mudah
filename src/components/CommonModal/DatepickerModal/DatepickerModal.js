import React from "react";
import "./DatepickerModal.scss";
import InputComponent from "../../InputComponent";
import { DateTimePicker } from "react-widgets";
import "react-widgets/dist/css/react-widgets.css";
import moment from "moment";
import momentLocalizer from "react-widgets-moment";
import util from "../../../util/commonUtil";

class DatepickerModal extends React.Component {
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

    render() {
        const { toggle, handleSubmit } = this.props;
        const { name, scheduleTime, scheduleTimeRaw, scheduleTimeForBackend } = this.state;
        const data = {
            meetingName: name,
            scheduleTime: scheduleTime,
            scheduleTimeRaw: scheduleTimeRaw,
            scheduleTimeForBackend: scheduleTimeForBackend,
        };

        return (
            <div className="datepicker-modal">
                <div className="datepicker-header">
                    <h3>
                        {"Schedule Meeting"}
                        <span>
                            <img src={require("assets/icons/close.svg")} onClick={toggle} />
                        </span>
                    </h3>
                </div>
                <div className="datepicker-content">
                    <div className="wrapper-meeting-agenda">
                        <span>Meeting Agenda</span>
                        <InputComponent name="meeting_title" value={name} handleChange={this.handleChangeName} />
                    </div>

                    <div className="wrapper-meeting-time">
                        <span>Date & Time</span>
                        <DateTimePicker
                            onChange={this.handleChangeSchedule}
                            value={this.state.scheduleTimeRaw ? moment(this.state.scheduleTimeRaw).toDate() : new Date()}
                        />
                    </div>
                </div>
                <div className="datepicker-footer">
                    <button onClick={toggle} className="btn-cancel">
                        Cancel
                    </button>
                    <button onClick={handleSubmit.bind(this, data)} disabled={name === "" ? true : false} className="btn-submit">
                        Create a schedule
                    </button>
                </div>
            </div>
        );
    }
}

export default DatepickerModal;
