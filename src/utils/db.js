/**
 * Utility function to execute database queries from the frontend
 * @param {string} query - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise} - Promise resolving to the query results
 */
export async function queryDatabase(query, params = []) {
  try {
    const response = await fetch('/.netlify/functions/db-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, params })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Database query failed');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

// Example usage:
/*
// In your component:
import { queryDatabase } from './utils/db';

async function fetchData() {
  try {
    const result = await queryDatabase('SELECT * FROM your_table');
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}
*/
