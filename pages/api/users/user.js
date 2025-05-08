import db from '../../lib/db';

export default async function handler(req, res) {
  try {
    // You should have user authentication in place, e.g., using JWT or session
    const userId = 1; // Example: assume the user is logged in with ID = 1
    const query = 'SELECT name FROM users WHERE id = ?';
    
    // Perform database query to fetch user data
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      if (result.length > 0) {
        res.status(200).json({ name: result[0].name });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
