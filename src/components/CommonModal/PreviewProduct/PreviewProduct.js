import React from "react";
import "./PreviewProduct.scss";
import renderHTML from "react-render-html";

const PreviewContent = ({ data }) => {
    return (
        <div className="preview__content__section">
            <h3 className="preview__content__section__title">{data.title}</h3>
            <div className="preview__content__section__content">
                {data.isRenderHTML ? data.content : renderHTML(data.content ? data.content : "")}
            </div>
            <div className="preview__content__section__content">{data.value}</div>
        </div>
    );
};

class PreviewProduct extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { toggle, previewTitle, previewProdData, previewFile } = this.props;
        const previewContent = (previewProdData || []).map((item, index) => <PreviewContent index={index} key={index} data={item} />);
        return (
            <div className="preview">
                <div className="preview__header">
                    <div className="row">
                        <div className="col-8">
                            <h3>{previewTitle ? previewTitle : "Preview Supporting Document"}</h3>
                        </div>
                        <div className="col-4">
                            <button className="btn preview__header__default-btn" onClick={toggle}>
                                Exit Preview
                            </button>
                        </div>
                    </div>
                </div>
                <div className="preview__content">
                    {previewProdData && (
                        <div className="row">
                            <div className="col-12">{previewContent}</div>
                        </div>
                    )}
                    {!previewProdData && (
                        <div className="row">
                            <div className="col-12">
                                <img src={"data:image/jpg;base64," + previewFile} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default PreviewProduct;
