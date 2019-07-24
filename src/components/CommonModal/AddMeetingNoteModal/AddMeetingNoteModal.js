import React from "react";
import "./AddMeetingNoteModal.scss";
import InputComponent from "../../../components/InputComponent";
import Dropdown from "../../../components/Dropdown";
import request from "superagent";

const API_KEY = "AIzaSyA_kfZ1Wf5u9A8If94Tu3DK0kn2rtWdKlk";
const geocodingApi = `https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}`;

const geoOptions = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 6000,
};

class AddMeetingNoteModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            leadTitle: "",
            config: {},
            purpose: {
                name: "",
            },
            status: {
                name: "",
            },
            description: "",
            maxLength: 3000,
            locationFullName: "",
            location: {},
            isFast: true,
        };
    }

    handleChangeInput = (e) => {
        let value = e.value;
        this.setState({
            [e.type]: value,
        });
    };
    componentDidMount() {
        const { data } = this.props;
        //data.level1Statuses = [...data.level1Statuses]
        this.setState({
            config: data,
        });
        this.getLocation();
    }

    handleChangeTextarea = (e) => {
        const counter = this.refs.counter;
        let value = e.target.value;
        this.setState({
            [e.target.name]: value,
        });
        counter.innerHTML = this.state.maxLength - e.target.value.length;
    };

    handleSelect = (e) => {
        this.setState({
            [e.type]: e,
        });
    };

    //  ===============
    //  LOCATION
    //  ===============
    getLocation = () => {
        let navGeo = navigator.geolocation;
        navGeo.getCurrentPosition(this.success, this.error, geoOptions);
    };

    success = (position) => {
        let crd = position.coords;
        this.setState({
            location: {
                lat: crd.latitude,
                lng: crd.longitude,
            },
            isFast: true,
        });
        this.getAddress(crd.latitude, crd.longitude);
        // this.getStaticMap(`${staticmapsApi}&center=${crd.latitude},${crd.longitude}&size=640x220&zoom=18&markers=color:red%7C${crd.latitude},${crd.longitude}`,
        //     (dataUrl) => {
        //         //this.props.handleSaveAddress({ base64String: dataUrl });
        //     });
    };

    getAddress = (lat, lng) => {
        request
            .get(`${geocodingApi}`)
            .query({ latlng: `${lat},${lng}` })
            .end((err, res) => {
                if (err) {
                    alert(`getAddress Error (${err.status}): ${res.body.message}`);
                }

                this.formatAddress(res.body);
            });
    };

    formatAddress = (json) => {
        const result = json.results[0]["address_components"];

        this.setState({
            location: {
                ...this.state.location,
                street: result[2].long_name,
                city: result[4].long_name,
                postalCode: result[7] ? result[7].long_name : "12345",
            },
            locationFullName: `${result[2].long_name}, ${result[4].long_name},  ${result[7] ? result[7].long_name : "12345"}`,
        });
    };

    error = () => {
        alert(`You have slow internet connection, please fill the Location manually`);
        this.setState({
            isFast: false,
        });
    };

    getStaticMap = (url, callback) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = () => {
            const reader = new FileReader();

            reader.onloadend = () => {
                callback(reader.result);
            };

            reader.readAsDataURL(xhr.response);
        };

        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    };

    //  ===============
    //  ------LOCATION
    //  ===============

    render() {
        const { handleShare, handlePrint, toggle, handleSave, companyName } = this.props;
        return (
            <div className="create-mn">
                <div className="create-mn__header">
                    <div className="row">
                        <div className="col-9">
                            <h3>Meeting Note Detail</h3>
                        </div>
                        <div className="col-3 wrapper-toolbar">
                            <img src={require("assets/icons/sharenew.svg")} onClick={handleShare} />
                            <img src={require("assets/icons/printnew.svg")} onClick={handlePrint} />
                            <img src={require("assets/icons/closed-modal-black.svg")} onClick={toggle} />
                        </div>
                    </div>
                </div>

                <div className="create-mn__content">
                    <div className="wrapper-content">
                        <div className="row form-row align-center">
                            <div className="col-1">
                                <div className="form-label">Lead:</div>
                            </div>
                            <div className="col-11 value">{companyName}</div>
                        </div>
                        <div className="form-row header-2">
                            <div className="col-flex-key">Purpose:</div>
                            <div className="col-flex-value">
                                <Dropdown
                                    data={this.state.config.meetingNoteCategories}
                                    handleSelect={this.handleSelect}
                                    name="purpose"
                                    defaultValue="Purposes..."
                                    value={this.state.purpose.name}
                                />
                            </div>
                            <div className="col-flex-key">Status:</div>
                            <div className="col-flex-value">
                                <Dropdown
                                    data={this.state.config.level1Statuses}
                                    handleSelect={this.handleSelect}
                                    name="status"
                                    defaultValue="Status..."
                                    value={this.state.status.name}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="wrapper-content">
                        <div className="row form-row">
                            <div className="col-12">
                                <textarea
                                    maxLength={3000}
                                    value={this.state.description}
                                    onChange={this.handleChangeTextarea}
                                    className="mn-textarea"
                                    name="description"
                                    placeholder="Note..."></textarea>
                            </div>
                            <div className="counter-wrapper col-12">
                                <p className="text-counter">
                                    <span className="counter" ref="counter">
                                        3000
                                    </span>
                                    &nbsp; Words left
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="wrapper-content no-border">
                        <div className="row form-row">
                            <div className="col-12 location-key flex">
                                <span>Check-In:</span>
                                <InputComponent
                                    value={this.state.locationFullName}
                                    name="locationFullName"
                                    handleChange={this.handleChangeInput}
                                    classesName="location-input"
                                    //disabled={this.state.isFast}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="create-mn__footer">
                    <div className="row">
                        <div className="col-5" />
                        <div className="col-7">
                            <span className="cancel-btn" onClick={toggle}>
                                Cancel
                            </span>
                            <button onClick={handleSave.bind(this, this.state)} className="next-btn">
                                Create Note
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddMeetingNoteModal;
