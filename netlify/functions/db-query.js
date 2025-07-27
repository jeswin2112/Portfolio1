import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const handler = async (event, context) => {
  try {
    // For security, only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' })
      };
    }

    // Parse the request body
    const { query, params = [] } = JSON.parse(event.body || '{}');
    
    if (!query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Query is required' })
      };
    }

    // Execute the query
    const { rows } = await pool.query(query, params);
    
    // Return the query results
    return {
      statusCode: 200,
      body: JSON.stringify({ data: rows })
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Database error',
        details: error.message 
      })
    };
  }
};
