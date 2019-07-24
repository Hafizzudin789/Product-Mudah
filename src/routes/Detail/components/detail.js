import "./detail.scss";
import React from "react";
import {get} from 'lodash'
import Header from "../../../components/Header/Header";

class Detail extends React.Component {
    componentDidMount() {
        const {getDetail, getSimilar, params, location} = this.props
        const isFromListing = get(location, 'state.fromList', false) // this get from redux
        // console.log({isFromListing})
        const id = get(params, 'id', null)
        getDetail(id);
        getSimilar(id);
    }

    render() {
        const {attributes, similar} = this.props
        return (
            <div>
                <Header />
                <div className="row detail-container">
                    <div className="leftcolumn">
                        <div className="card container">
                           <div>
                            <h5 className="prodTitle">{attributes.title}</h5>
                            <div className="fakeimg">
                                <img className="bigImg" src={require('./../../../assets/img/az.jpg')} />
                            </div>
                            <div className="container-description">
                                <div className="descLeft">
                                    <p className="descTitleLeft">Description</p>
                                </div>
                                <div className="descRight">
                                    <button className="reportButton">
                                    <img className="iconReport" src={require("assets/img/flag.svg")} />  Report Ad
                                    </button>
                                </div>
                            </div>
                                <p className="descDetail">{attributes.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rightcolumn">
                        <div className="card">
                            <div className="row pad">
                                <div className="left">
                                    <button className="likeButton">
                                    <img className="iconImgL" src={require("assets/img/like.png")} />
                                    Wishlist
                                    </button>
                                </div>
                                <div className="right">
                                    <button className="shareButton">
                                    <img className="iconImgR" src={require("assets/img/share.png")} />
                                    Share
                                    </button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="contact_spl">
                                        <div className="row no-gutters wrapper-main-product-specialist">
                                            <div className="wrapper-column-detail">
                                                <div>
                                                    Price 
                                                </div>
                                                <div className="detail-price bold">{attributes.price}</div>
                                            </div>
                                            <div className="wrapper-column-detail">
                                                <div>
                                                Item condition 
                                                </div>
                                                <div className="detail-space">{attributes.condition}</div>
                                            </div>
                                            <div className="wrapper-column-detail">
                                                <div>
                                                Item location 
                                                </div>
                                                <div className="detail-space">{attributes.location}</div>
                                            </div>
                                            <div className="wrapper-column-detail">
                                                <div>
                                                Seller info
                                                </div>
                                                <div>
                                                    <div className="imgLeft"> 
                                                        <img className="personalImg" src={require('./../../../assets/img/img_avatar.png')} />
                                                    </div>
                                                
                                                    <div className="detailRight">
                                                        <div>
                                                        {attributes.seller_name}
                                                        </div>
                                                        <div>
                                                        {attributes.seller_type}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div className="card">
                            <div className="row">
                                <div className="contact_spl">
                                        <div className="row no-gutters wrapper-main-product-specialist">
                                            <div className="wrapper-column-detail">
                                                <div>
                                                Interested with the ad? Contact the seller
                                                </div>
                                            </div>
                                            <div className="wrapper-column-detail">
                                                <button className="cont-spl">
                                                <img className="iconPersonal" src={require("assets/img/phone.png")} />  017-774 xxxx
                                                </button>
                                            </div>
                                            <div className="wrapper-column-detail">
                                                <button className="cont-spl">
                                                <img className="iconPersonal" src={require("assets/img/email.png")} />  Email
                                                </button>
                                            </div>
                                            <div className="wrapper-column-detail">
                                                <button className="chat">
                                                <img className="iconPersonal" src={require("assets/img/chat.png")} />  Chat
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                    <div className="similar-container">
                        <h5 className="simiTitle">SIMILAR ITEMS</h5>
                        <div className="wrapper-product">
                            {
                                 similar.map((item, index) => {
                                    //  console.log(item);
                                     return (
                                        <div key={index} className="product">
                                            <img src={require('./../../../assets/img/img1.png')} />
                                            <p className="title">{item.attributes.title}</p>
                                            <p className="price">{item.attributes.price}</p>
                                        </div>
                                     )
                                  }
                                )
                            }  
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Detail;
