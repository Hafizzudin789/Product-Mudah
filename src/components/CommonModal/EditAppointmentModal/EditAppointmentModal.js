import React from "react";
import "./EditAppointmentModal.scss";
import InputComponent from "../../InputComponent";
import { DateTimePicker } from 'react-widgets';
import "react-widgets/dist/css/react-widgets.css";
import moment from "moment";
import momentLocalizer from "react-widgets-moment";

class EditAppointmentModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            input: {
                scheduledDate: null,
                scheduledTime: null,
                location: '',
                city: '',
                state: '',
                postcode: ''
            }
        };

        moment.locale("en");
        momentLocalizer();
    }

    componentDidMount() {
        const { data } = this.props;
        
        this.setState({
           input: data || this.state.input
        });
    }

    handleChangeInput = (data) => {
        const {
            value,
            type
        } = data
        this.setState({
            input: {
                ...this.state.input,
                [type]: value
            }
        })
    };

    handleChangeSchedule = (e) => {
        this.setState({
            input: {
                ...this.state.input,
                scheduledDate: e
            }
        });
    };

    handleChangeScheduleTime = (e) => {
        this.setState({
            input: {
                ...this.state.input,
                scheduledTime: e
            }
        });
    };

    render() {
        const { toggle, handleSubmit } = this.props;
        const { 
            input
        } = this.state;
        const {
            location,
            scheduledTime, 
            scheduledDate, 
            state,
            city,
            postcode
        } = input
        const isValid = location && state && postcode && city && state
        return (
            <div className="editappointment-modal">
                <div className="editappointment-header">
                    <h3>
                        {"Edit Appointment"}
                        <span>
                            <img src={require("assets/icons/closed-modal-black.svg")} onClick={toggle} />
                        </span>
                    </h3>
                </div>
                <div className="editappointment-content">
                    <div className="row">
                        <div className="col-6 wrapper-meeting-agenda">
                            <span>Location</span>
                            <InputComponent name="location" value={location} handleChange={this.handleChangeInput} />
                        </div>
                        <div className="col-6 wrapper-meeting-agenda">
                            <span>City</span>
                            <InputComponent name="city" value={city} handleChange={this.handleChangeInput} />
                        </div>
                        <div className="col-6 wrapper-meeting-agenda">
                            <span>State</span>
                            <InputComponent name="state" value={state} handleChange={this.handleChangeInput} />
                        </div>
                        <div className="col-6 wrapper-meeting-agenda">
                            <span>Postcode</span>
                            <InputComponent name="postcode" value={postcode} handleChange={this.handleChangeInput} />
                        </div>
                        <div className="col-6 wrapper-meeting-agenda">
                            <span>Date</span>
                            <DateTimePicker
                                name="scheduledDate"
                                onChange={this.handleChangeSchedule}
                                value={scheduledDate ? moment(scheduledDate).toDate() : new Date()}
                                time={false}
                            />
                        </div>
                        <div className="col-6 wrapper-meeting-agenda">
                            <span>Time</span>
                            <DateTimePicker
                                name="scheduleTime"
                                onChange={this.handleChangeScheduleTime}
                                value={scheduledTime}
                                date={false}
                            />
                        </div>
                    </div>
                </div>
                <div className="editappointment-footer">
                    <button onClick={toggle} className="btn-cancel">
                        Cancel
                    </button>
                    <button onClick={() => handleSubmit(input)} disabled={!isValid} className="btn-submit">
                        Update Changes
                    </button>
                </div>
            </div>
        );
    }
}

export default EditAppointmentModal;
