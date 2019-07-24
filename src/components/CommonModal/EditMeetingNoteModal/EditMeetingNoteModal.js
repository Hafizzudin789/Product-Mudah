import React from "react";
import "./EditMeetingNoteModal.scss";
import _ from "lodash";
import store from "./../../../main";
const user = store.getState().login.user;
const roleLevel = user.role.roleLevel;
class EditMeetingNoteModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            maxLength: 3000,
            leadData: {},
        };
    }

    componentDidMount() {
        const { data, leadData } = this.props;
        this.setState({
            data: data,
            leadData: leadData,
        });
        const counter = this.refs.counter;
        counter.innerHTML = this.state.maxLength - data.noteDescription.length;
    }

    handleTextareaChange = (e) => {
        const counter = this.refs.counter;
        let text = e.target.value;
        let length = text.length;
        counter.innerHTML = this.state.maxLength - length;
    };

    onChange = (e) => {
        let value = e.target.value;
        let arr = this.state.data;
        arr.noteDescription = value;
        this.setState({
            data: arr,
        });
    };

    handleShares = () => {
        // const {handleShare} = this.props
        // const konten = document.getElementById('meetingDetailsEdit')
        // handleShare(konten)
    };

    render() {
        const { handlePrint, toggle, data, handleSave, companyName } = this.props;

        const smeProducts =
            !_.isEmpty(this.state.leadData) &&
            this.state.leadData.leadProducts
                .filter((e) => {
                    return e.product.productType.name == "SME";
                })
                .map((e, index) => {
                    return <p key={index}>{e.product.productName}</p>;
                });

        const products =
            !_.isEmpty(this.state.leadData) &&
            this.state.leadData.leadProducts
                .filter((e) => {
                    return e.product.productType.name != "SME";
                })
                .map((e, index) => {
                    return <p key={index}>{e.product.productName}</p>;
                });

        return (
            <div id="meetingDetailsEdit" className="edit-mn">
                <div className="print-header">
                    <div className="row">
                        <div className="col-3 logo-container">
                            <div className="logo">
                                <img src={require("assets/icons/logo.svg")} />
                            </div>
                            <div className="header-addressText">
                                247, Jalan Tun Razak, Imbi 55100,
                                <br /> Kuala Lumpur, Kuala Lumpur, Malaysia
                            </div>
                        </div>
                        <div className="col-9 header-right text-right">
                            <div>LEAD ID: 1223445</div>
                            <div>Printed Date - December 25,2017</div>
                        </div>
                    </div>
                </div>
                <div className="note-header">
                    <h2>MEETING NOTE DETAILS</h2>
                    <div className="row">
                        <div className="col-6 details-title">{data.notePurpose}</div>
                        <div className="col-6 details-time text-right">{data.modifiedDate}</div>
                    </div>
                    <div className="row note-detail">
                        <p>{data.noteDescription}</p>
                    </div>
                </div>
                <div className="note-location">
                    <h3>LOCATION</h3>
                    <div className="location-detail ">{data.addressLine1}</div>
                    <div className="note-boarder"></div>
                </div>
                <div className="note-header">
                    <h2>PRODUCT DETAILS</h2>
                </div>
                <div className="note-location">
                    {smeProducts.length ? (
                        <div>
                            <h3>SME PRODUCTS</h3>
                            <div className="mn-detail">{smeProducts}</div>
                        </div>
                    ) : (
                        []
                    )}

                    {products.length ? (
                        <div>
                            <h3>CROSS-SELL PRODUCTS</h3>
                            <div className="mn-detail">{products}</div>
                        </div>
                    ) : (
                        []
                    )}
                </div>
                <div className="edit-mn__header">
                    <div className="row">
                        <div className="col-9">
                            <h3>Meeting Note Detail</h3>
                        </div>
                        <div className="col-3 wrapper-toolbar">
                            <img src={require("assets/icons/sharenew.svg")} onClick={this.props.handleShare} />
                            <img src={require("assets/icons/printnew.svg")} onClick={handlePrint} />
                            <img src={require("assets/icons/closed-modal-black.svg")} onClick={toggle} />
                        </div>
                    </div>
                </div>

                <div className="edit-mn__content">
                    <div id="printSection" className="wrapper-content">
                        <div className="row form-row align-center">
                            <div className="col-1">
                                <div className="form-label">Lead:</div>
                            </div>
                            <div className="col-11 value">{companyName}</div>
                        </div>
                        <div className="form-row header-2">
                            <div className="col-flex-key">Purpose:</div>
                            <div className="col-flex-value">{data.notePurpose}</div>
                            <div className="col-flex-key">Status:</div>
                            <div className="col-flex-value">{data.status}</div>
                        </div>
                    </div>

                    <div className="wrapper-content">
                        <div className="row form-row">
                            <div className="col-12">
                                <textarea
                                    onChange={this.onChange}
                                    maxLength={3000}
                                    value={this.state.data.noteDescription}
                                    onKeyUp={this.handleTextareaChange}
                                    className="mn-textarea"
                                    disabled={roleLevel > 1}
                                    placeholder="Note..."></textarea>
                            </div>
                            <div className="counter-wrapper col-12">
                                <p className="text-counter">
                                    <span className="counter" ref="counter">
                                        3000
                                    </span>
                                    &nbsp; Characters Left
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="wrapper-content no-border">
                        <div className="row form-row">
                            <div className="col-12 location-key">
                                Check-In:
                                <span className="location">{data.addressLine1}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="edit-mn__footer">
                    <div className="row">
                        <div className="col-5" />
                        <div className="col-7">
                            <span className="cancel-btn" onClick={toggle}>
                                Cancel
                            </span>
                            <button disabled={roleLevel > 1} onClick={handleSave.bind(this, this.state)} className="next-btn">
                                Update Note
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditMeetingNoteModal;
