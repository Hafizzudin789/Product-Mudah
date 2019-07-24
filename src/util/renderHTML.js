import { Parser } from "html-to-react";
const htmlToReactParser = new Parser();

export default (htmlString) => {
    return htmlToReactParser.parse(htmlString);
};
