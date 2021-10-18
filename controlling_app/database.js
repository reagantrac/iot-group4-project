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
connection.connect()

const query = (queryString) => new Promise((resolve, reject) => {
    // Read all rows from table
    result = []
    const request = new Request(
        queryString,
        (err) => {
            if (err) reject(err)
            else resolve(result)
        },
    );

    request.on("row", columns => {
        newRow = {}
        columns.forEach(column => newRow[column.metadata.colName] = column.value);
        result.push(newRow)
    });

    connection.on("connect", err => {
        if (err) console.error(err.message);
    });
    connection.on("error", err => {
        console.log(err)
        if (err) connection.connect()
    })

    connection.execSql(request);
})

module.exports.query = query