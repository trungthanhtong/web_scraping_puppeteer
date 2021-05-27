const puppeteer = require("puppeteer");

// const url = 'https://www.sec.gov/edgar/browse/?CIK=1018724&owner=exclude';
// const url = 'https://www.sec.gov/edgar/browse/?CIK='
const url = "https://www.sec.gov/edgar/searchedgar/companysearch.html";
// const url = "https://www.sec.gov/edgar/browse/?CIK=1018724";

const CIK = "DDD"; //CIK or ticker

// const link = 'https://www.sec.gov/ix?doc=/Archives/edgar/data/910638/000091063821000008/ddd-20201231.htm';
// const link = 'https://www.sec.gov/ix?doc=/Archives/edgar/data/1018724/000101872421000004/amzn-20201231.htm'

const scrapeProduct = async (url, CIK) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // await page.goto(`${url}${CIK}`);
        await page.goto(url);

        await page.type("#company", CIK);
        await page.waitForTimeout(1000);
        await page.keyboard.press("Enter");

        await page.waitForSelector(".card-header", {
            visible: true,
        });

        // Test if it works
        await page.screenshot({ path: "1.png" });

        const [el] = await page.$x(
            '//*[@id="selected-filings-annualOrQuarterly"]/ul/li[2]/a[1]'
        );


        const txt = await el.getProperty('textContent');
        const reportName = await txt.jsonValue();
        if (reportName.includes("10-K")) {
            const href = await el.getProperty('href');
            const link = await href.jsonValue();

            console.log(link);
            
            const k10Page = await browser.newPage();
            await k10Page.goto(link);

            // Test if it goes to the 10-k
            await k10Page.screenshot({path: "2.png"});
        }


        browser.close();
    } catch (err) {
        console.log(err);
    }
};

// Get info from 10k
// Still in progress
const getK10Page = async (url) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        await page.screenshot({path: "2.png"});


        const [el] = await page.$x('//*[@id="fact-identifier-47"]');
        const txt = await el.getProperty('textContent');
        const netIncome = await txt.jsonValue();

        console.log(netIncome)

        browser.close();
    }catch (err) {
        console.log(err)
    }
}

scrapeProduct(url, CIK);
// getK10Page(link)
