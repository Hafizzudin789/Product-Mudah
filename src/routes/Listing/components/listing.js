import "./listing.scss";
import React from "react";
import {get} from 'lodash'
import Header from "../../../components/Header/Header";

class Listing extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {getData} = this.props
        getData()
    }

    render() {
        const {theData} = this.props || []
        return (
            <div>
            <Header />
            <div className="listing-container">
                <h5>Listing</h5>
                <div className="wrapper-product">
                    {
                        theData.map((e,i) => 
                            <div key={i} 
                                onClick={() => {
                                    // console.log({e})
                                    this.props.router.push({
                                        pathname: `/detail/${e.id}`,
                                        state: {
                                            fromList: true
                                        }
                                    })
                                }}
                            className="product">
                                <img src={require('./../../../assets/img/img1.png')} />
                                <p className="title">{e.attributes.title}</p>
                                <p className="price">{e.attributes.price}</p>
                            </div>
                        )
                    }
                </div>
            </div>
            </div>

        );
    }
}

export default Listing;
