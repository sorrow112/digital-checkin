const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { google } = require("googleapis");
const { authenticate } = require("@google-cloud/local-auth");

const app = express();

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json", //the key file
    //url to spreadsheets API
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const authClientObject = await auth.getClient();

  const googleSheetsInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });

  const spreadsheetId = "1slBSDtPeMbaml8kw5vzS_zQJTA6B6L6SSOsJzg5wEc8";

  const range = "Sheet1!A:A";
  const vals = await googleSheetsInstance.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  for (var i = 0; i < vals.data.values.length; i++) {
    if (vals.data.values[i][0] == id) {
      const now = new Date();
      const strdate =
        now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
      await googleSheetsInstance.spreadsheets.values.update({
        auth, //auth object
        spreadsheetId, //spreadsheet id
        range: `sheet1!C${i + 1}:C${i + 1}`, //sheet name and range of cells
        valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
        resource: {
          values: [[strdate]],
        },
      });
    }
  }

  res.send(vals.data);
});

app.listen(1337, (req, res) => {
  console.log("listening on 1337");
});
