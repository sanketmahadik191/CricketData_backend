const express = require("express");
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 4003;
const fs =require("fs");

app.get('/',(req,res)=>{
   res.send('Server is Ready');
});

app.get('/api/cricket', async (req,res)=>{ // Added async here
  const year = req.query
  try {
    const browser = await puppeteer.launch({ timeout: 60000 });
    const page = await browser.newPage();
    try {
      await page.goto(`https://www.iplt20.com/stats/${year.year}`, { timeout: 60000 }); // Navigate with increased timeout
    } catch (error) {
      console.error('Navigation failed:', error);
    }

    const combinedData = await page.evaluate(() => {
      const nameElements = document.querySelectorAll("div.st-ply-name.ng-binding");
      const runsElements = document.querySelectorAll("td.ng-binding.np-tableruns");
      const fiftyElements = document.querySelectorAll("#battingTAB > table > tbody > tr > td:nth-child(12)");
       const centuryElements = document.querySelectorAll("#battingTAB > table > tbody > tr > td:nth-child(11)");
       const foursElements = document.querySelectorAll("#battingTAB > table > tbody > tr > td:nth-child(13)");
       const sixesElements = document.querySelectorAll("#battingTAB > table > tbody > tr > td:nth-child(14)");

      const nameArray = Array.from(nameElements).map(pre => pre.textContent);
      const runsArray = Array.from(runsElements).map(pre => pre.textContent);
      const fifty = Array.from(fiftyElements).map(pre => pre.textContent);
       const century = Array.from(centuryElements).map(pre => pre.textContent);
        const fours = Array.from(foursElements).map(pre => pre.textContent);
         const sixes = Array.from(sixesElements).map(pre => pre.textContent);
      

      return {nameArray,runsArray,fifty,century,fours ,sixes};
    });
    await browser.close(); // Close the browser after scraping

    res.send(combinedData);
  } catch (error) {
    console.error('Error generating data:', error);
    res.status(500).send('Error generating data');
  }
})
app.listen(PORT,()=>{
    console.log("Server Started");
});



