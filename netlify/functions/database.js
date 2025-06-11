const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  try {
    const connection = await mysql.createConnection({
      host: 'caboose.proxy.rlwy.net',
      port: 37900,
      user: 'root',
      password: process.env.MYSQL_PASSWORD,
      database: 'railway',
      ssl: { rejectUnauthorized: false }
    });

    const [rows] = await connection.execute('SELECT * FROM your_table');
    await connection.end();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rows)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};