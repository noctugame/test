const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const puppeteer = require("puppeteer");
const cors = require("cors");

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());

app.get("/scrape", async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      "https://legacy.pinksale.finance/launchpad/0xc5CD80734B1F5384aE52Fa9b316d40DCF06d2C25?chain=Matic"
    );

    //const data = await page.evaluate(() => {
    // Replace the following selector with the actual selector you need
    /*const presaleRateElement = document.querySelector(
        ".presale-rate-selector"
      );*/
    //const minMax = page.$$eval(".table-container table tbody", (rows) => {
    const minMax = await page.$$eval(".table-container table tbody", (rows) => {
      rows_num = rows;

      return Array.from(rows, (row) => {
        const columns = row.querySelectorAll("td");
        columns_num = columns;
        return Array.from(columns, (column) => column.innerText);
      });
    });
    console.log("minMax ------------------ ", minMax);
    const data = await page.$$eval(".table-container table tbody", (rows) => {
      return Array.from(rows, (row) => {
        const columns = row.querySelectorAll("td");
        return Array.from(columns, (column) => column.innerText);
      });
    });
    console.log("data ------------------ ", data);
    let h_d = 0;
    let currentRow = { header: "", theData: "" };
    var dataList = [];
    let header = "";
    let theData = "";
    data.forEach((row) => {
      console.log("row ------------------ ", row);
      currentRow = { header: "", theData: "" };
      //let h_d = 0;
      h_d = 0;
      row.forEach((element) => {
        console.log("element ===> ", element);
        if (h_d % 2 == 0) {
          currentRow = { header: "", theData: "" };
          header = element;
        } else {
          let indexof = element.indexOf("(Do not send USDT");
          if (indexof != -1) {
            const myArray = element.split("(Do not send USDT");
            element = myArray[0];
          }
          indexof = element.indexOf("\n");
          if (indexof != -1) {
            const myArray = element.split("\n");
            element = myArray[0];
          }

          theData = element;
          currentRow.header = header;
          currentRow.theData = theData;
          dataList.push(currentRow);
        }
        h_d = h_d + 1;

        //console.log("h_d ===> ", h_d);
      });
    });
    for (var i = 0; i < dataList.length; i++) {
      if (dataList[i].header == "Presale Rate") {
        let indexof = dataList[i].theData.indexOf("=");
        if (indexof != -1) {
          const myArray = dataList[i].theData.split("=");
          dataList[i].theData = myArray[1];
        }
        indexof = dataList[i].theData.indexOf("NXGT");
        if (indexof != -1) {
          const myArray = dataList[i].theData.split("NXGT");
          dataList[i].theData = myArray[0];
        }
        dataList[i].theData = dataList[i].theData.trim();
        dataList[i].theData = dataList[i].theData.replace(",", "");
        dataList[i].theData = dataList[i].theData;
      }
      if (dataList[i].header == "Presale End Time") {
        dataList[i].theData = dataList[i].theData.replace(" (UTC)", "");
      }
      if (dataList[i].header == "Presale Start Time") {
        dataList[i].theData = dataList[i].theData.replace(" (UTC)", "");
      }
    }
    //return   dataList;

    await browser.close();
    res.json(dataList);
    return dataList;
  } catch (error) {
    console.error(error);
    res.status(500).send("Error scraping data");
  }
});
app.use(express.static(path.join(__dirname, "../public")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public", "index.html"));
});
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public", "index.html"));
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
