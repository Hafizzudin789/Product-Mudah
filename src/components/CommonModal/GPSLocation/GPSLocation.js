import React from "react";
import "./GPSLocation.scss";
import InputComponent from "../../InputComponent";

class GPSLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = { address: { meetingNotesStreet: "", meetingNotesPostalCode: "", meetingNoteCity: "" } };
    }

    handleToggle = () => {
        this.props.toggle();
    };

    inputChange = (data) => {
        let address = this.state.address;
        address[data.type] = data.value;
        return this.setState({ address: address });
    };

    render() {
        const { handleSave, showError } = this.props;
        const { meetingNotesStreet, meetingNotesPostalCode, meetingNoteCity } = this.state.address;
        return (
            <div className="gps-location">
                <div className="gps-location__header">
                    <h3>
                        {"GPS Location"}
                        <span>
                            <img src={require("assets/icons/close_white.svg")} onClick={this.handleToggle} />
                        </span>
                    </h3>
                </div>
                <div className="gps-location__content">
                    <div className="gps-location__content__container">
                        <InputComponent
                            errorMsg={showError}
                            value={meetingNotesStreet}
                            name="meetingNotesStreet"
                            placeholder="Street *"
                            handleChange={this.inputChange}
                        />
                        <InputComponent
                            errorMsg={showError}
                            value={meetingNotesPostalCode}
                            name="meetingNotesPostalCode"
                            placeholder="Postal code *"
                            handleChange={this.inputChange}
                        />
                        <InputComponent
                            errorMsg={showError}
                            value={meetingNoteCity}
                            name="meetingNoteCity"
                            placeholder="City *"
                            handleChange={this.inputChange}
                        />
                    </div>
                </div>
                <div className="gps-location__footer" onClick={handleSave.bind(this, this.state.address)}>
                    Save location
                </div>
            </div>
        );
    }
}

export default GPSLocation;
