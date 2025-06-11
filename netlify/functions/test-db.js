const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      ssl: { rejectUnauthorized: false }
    });

    const [result] = await connection.execute('SHOW TABLES');
    await connection.end();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        message: 'Database connected successfully!',
        tables: result
      })
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Database connection failed',
        details: error.message 
      })
    };
  }
};
