import _ from "lodash";

const listMainBusineesNeed = () => {
    let object = [];
    object.push({ name: "Help managing my working capital, including trade flows", index: 1 });
    object.push({ name: "Financing for property or land for my business", index: 3 });
    object.push({ name: "Financing for equipment or vehicles for my business", index: 2 });
    object.push({ name: "Help with importing or exporting", index: 4 });
    object.push({ name: "Financing to help fulfill a contract with a reputable customer", index: 6 });
    object.push({ name: "Help with managing finances of suppliers, distributors and end-purchasers", index: 5 });
    return object;
};

const listRevenue = () => {
    let object = [];
    object.push({ name: "Agriculture", index: 1 });
    object.push({ name: "Business services", index: 2 });
    object.push({ name: "Construction", index: 3 });
    object.push({ name: "Investment property holding", index: 4 });
    object.push({ name: "Manufacturing", index: 5 });
    object.push({ name: "Real estate", index: 6 });
    object.push({ name: "Retail", index: 7 });
    object.push({ name: "Transportation", index: 8 });
    object.push({ name: "Wholesale", index: 9 });
    object.push({ name: "Others", index: 10 });
    return object;
};

const recommendProduct = (listProduct, chosen) => {
    let object = [];
    listProduct.forEach((product) => {
        if (!product.productCategories) return;
        let flag = false;
        product.productCategories.forEach((proCate) => {
            const category = proCate.code.toString().toUpperCase();
            if (flag) return;
            //Others
            if (chosen.revenue.index === 10) {
                if (category === "OTHERS") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
            }
            //Wholesale
            if (chosen.revenue.index === 9) {
                if (category === "WHOLESALE") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
            }
            //Transportation
            if (chosen.revenue.index === 8) {
                if (category === "TRANSPORTATION") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
            }
            //Retail
            if (chosen.revenue.index === 7) {
                if (category === "RETAIL") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
            }
            //Real estate
            if (chosen.revenue.index === 6) {
                if (category === "REAL ESTATE") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
            }
            //Manufacturing
            if (chosen.revenue.index === 5) {
                if (category === "MANUFACTURING") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
            }
            //Investment property olding
            if (chosen.revenue.index === 4) {
                if (category === "INVESTMENT PROPERTY HOLDING") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
            }
            //Construction
            if (chosen.revenue.index === 3) {
                if (category === "CONSTRUCTION") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
            }
            //Business services
            if (chosen.revenue.index === 2) {
                if (category === "BUSINESS SERVICES") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
            }
            //Agriculture
            if (chosen.revenue.index === 1) {
                if (category === "AGRICULTURE") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
            }
            //turnOver
            if (!chosen.loan) {
                if (
                    product.productName === "GG Scheme: WCG4 (Pintas Plus)" &&
                    (chosen.revenue.index === 3 || chosen.revenue.index === 4 || chosen.revenue.index === 5 || chosen.revenue.index === 6)
                )
                    return;
                if (category === "REQUIRE CREDIT SUPPORT") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
            }
            //Contract Financing
            if (chosen.business.index === 6) {
                if (category === "CONTRACT FINANCING") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
            }
            //Supply Chain Financing
            if (chosen.business.index === 5) {
                if (category === "SUPPLY CHAIN FINANCING") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
                //Working Capital
                if (category === "WORKING CAPITAL") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
            }
            //Import and Export
            if (chosen.business.index === 4) {
                if (category === "IMPORT AND EXPORT") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
                //Working Capital
                if (category === "WORKING CAPITAL") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
            }
            //Property or Land Financing
            if (chosen.business.index === 3) {
                if (category === "PROPERTY OR LAND FINANCING") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
            }
            //Equipment or Vehicle Financing
            if (chosen.business.index === 2) {
                if (category === "EQUIPMENT OR VEHICLE FINANCING") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
            }
            //Working Capital
            if (chosen.business.index === 1) {
                if (category === "WORKING CAPITAL") {
                    product.productCategories = [proCate];
                    object.push(product);
                    flag = true;
                }
            }
            //Deposit and Cash Management
            if (category === "DEPOSIT AND CASH MANAGEMENT") {
                product.productCategories = [proCate];
                object.push(product);
                flag = true;
            }
        });
    });
    if (chosen.turnOver) {
        object = _.filter(object, (pro) => {
            return pro.productIndex === "BOTH" || pro.productIndex === "MM";
        });
    } else {
        object = _.filter(object, (pro) => {
            return pro.productIndex === "BOTH" || pro.productIndex === "LM";
        });
    }
    return object;
};

export default {
    listRevenue,
    recommendProduct,
    listMainBusineesNeed,
};
