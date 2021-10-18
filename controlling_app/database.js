const { Connection, Request } = require("tedious");

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "CITS5506",
      password: "SmartLightIoT2021#"
    },
    type: "default"
  },
  server: "smartlightserver.database.windows.net",
  options: {
    database: "smartlight",
    encrypt: true
  }
};

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  }
});

connection.connect();

function query(queryString) {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  const request = new Request(
    queryString,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  request.on("row", columns => {
    columns.forEach(column => {
      console.log("%s\t%s", column.metadata.colName, column.value);
    });
  });

  connection.execSql(request);
}

module.exports = {
    "query": query
 }