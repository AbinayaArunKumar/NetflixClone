const mysql = require('mysql2/promise'); // Use promise-based API for better async/await support

// Create a pool of connections
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: 'pes1ug22am007', // replace with your MySQL password
    database: 'netflixclone', // replace with your database name
});

// Export the pool for use in other modules
module.exports = pool;
