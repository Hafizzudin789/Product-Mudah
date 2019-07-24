import React from "react";
import "./PDFViewer.scss";
import pdfjs from "pdfjs-dist";
import PrintShare from "../../../components/PrintShare";

let pageRendering = false;
let pageNumPending = null;

class PDFViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            pdfData: null,
        };
    }

    componentWillMount() {
        const { data } = this.props;
        const pdfData = atob(data.docImage);
        const _this = this;
        pdfjs.PDFJS.workerSrc = require("pdfjs-dist/build/pdf.worker.js");
        const loadingTask = pdfjs.PDFJS.getDocument({ data: pdfData });
        loadingTask.promise.then(
            function(pdf) {
                _this.setState({ pdfData: pdf }, () => {
                    _this.renderPage(1);
                });
            },
            function() {
                // PDF loading error
            },
        );
    }

    componentWillUnmount() {
        const { data, resetProductSubDocument } = this.props;
        if (data.docImage && resetProductSubDocument) {
            resetProductSubDocument();
        }
    }

    renderPage = (num) => {
        pageRendering = true;
        const { pdfData } = this.state;
        // Fetch the first page
        pdfData.getPage(num).then(function(page) {
            var scale = 1;
            var viewport = page.getViewport(scale);

            // Prepare canvas using PDF page dimensions
            var canvas = document.getElementById("the-canvas");
            var context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            var renderTask = page.render(renderContext);
            renderTask.then(function() {
                pageRendering = false;
                if (pageNumPending !== null) {
                    // New page rendering is pending
                    this.renderPage(pageNumPending);
                    pageNumPending = null;
                }
            });
        });
    };

    onPrevPage = () => {
        let { pageNum } = this.state;
        if (pageNum <= 1) {
            return;
        }
        this.setState({ pageNum: --pageNum });
        this.queueRenderPage(pageNum--);
    };

    onNextPage = () => {
        let { pageNum, pdfData } = this.state;
        if (pageNum >= pdfData.numPages) {
            return;
        }
        this.setState({ pageNum: ++pageNum });
        this.queueRenderPage(pageNum++);
    };

    queueRenderPage = (num) => {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            this.renderPage(num);
        }
    };

    handlePrint = () => {
        window.print();
    };

    render() {
        const { pageNum, pdfData } = this.state;
        const { handleCloseViewDoc, sendEmail, disablePrintAndShare } = this.props;
        return (
            <div>
                <div className="PDF-viewer-header">
                    <h3>
                        {"View & Print"}
                        <span>
                            <img src={require("assets/icons/close_white.svg")} onClick={handleCloseViewDoc} />
                        </span>
                    </h3>
                </div>
                <div className="PDF-viewer" tabIndex="0">
                    <div className="PDF-viewer--pagination">
                        <button id="prev" onClick={this.onPrevPage}>
                            Previous
                        </button>
                        <button id="next" onClick={this.onNextPage}>
                            Next
                        </button>
                        &nbsp; &nbsp;
                        <span>
                            Page: <span>{pageNum}</span> / <span>{pdfData ? pdfData.numPages : 1}</span>
                        </span>
                    </div>
                    <canvas id="the-canvas"></canvas>
                </div>
                {!disablePrintAndShare && (
                    <div className="PDF-viewer-footer">
                        <PrintShare notDoScreenShot sendData={sendEmail} />
                    </div>
                )}
            </div>
        );
    }
}

export default PDFViewer;
