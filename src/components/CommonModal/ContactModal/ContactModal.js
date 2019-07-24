import React from "react";
import "./ContactModal.scss";

function ContactModal({ contact, toggle }) {
    const { name, jobTitle, email, phone } = contact;
    return (
        <div className="contactModal">
            <img onClick={toggle} className="contactModal__closeIcon" src={require("../../../assets/icons/close.svg")} />
            <div className="contactModal__content">
                {!name ? (
                    <div className="row">
                        <div className="col-12 contactModal__content__label-text">Contact information is not available</div>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-12 contactModal__content__title">{name}</div>
                        <div className="col-12 contactModal__content__subtitle">{jobTitle}</div>
                        <div className="col-12 contactModal__content__label-text">
                            <img className="contactModal__content__icon" src={require("../../../assets/icons/home-phone.svg")} />
                            <span>{phone}</span>
                        </div>
                        <div className="col-12 contactModal__content__label-text">
                            <img className="contactModal__content__icon" src={require("../../../assets/icons/telegram.svg")} />
                            <span>{email}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ContactModal;
