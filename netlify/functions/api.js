// Netlify Functions handler for Next.js API routes
const { NextRequest } = require('next/server');

// Import your API handlers
const abandonedFormsHandler = require('../../src/app/api/abandoned-forms/route');
const bookingsHandler = require('../../src/app/api/bookings/route');
const bookingStatusHandler = require('../../src/app/api/bookings/status/route');

exports.handler = async (event, context) => {
  const { path, httpMethod, body, headers, queryStringParameters } = event;
  
  try {
    // Create a Next.js compatible request object
    const url = `https://example.com${path}${queryStringParameters ? '?' + new URLSearchParams(queryStringParameters).toString() : ''}`;
    const request = new NextRequest(url, {
      method: httpMethod,
      headers: headers,
      body: httpMethod !== 'GET' ? body : undefined,
    });

    let response;
    
    // Route to appropriate handler based on path
    if (path.startsWith('/api/abandoned-forms')) {
      if (httpMethod === 'GET') {
        response = await abandonedFormsHandler.GET(request);
      } else if (httpMethod === 'POST') {
        response = await abandonedFormsHandler.POST(request);
      } else if (httpMethod === 'PATCH') {
        response = await abandonedFormsHandler.PATCH(request);
      }
    } else if (path.startsWith('/api/bookings/status')) {
      if (httpMethod === 'PATCH') {
        response = await bookingStatusHandler.PATCH(request);
      }
    } else if (path.startsWith('/api/bookings')) {
      if (httpMethod === 'GET') {
        response = await bookingsHandler.GET(request);
      } else if (httpMethod === 'POST') {
        response = await bookingsHandler.POST(request);
      } else if (httpMethod === 'PATCH') {
        response = await bookingsHandler.PATCH(request);
      }
    }

    if (!response) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Not Found' }),
      };
    }

    const responseData = await response.json();
    
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(responseData),
    };
  } catch (error) {
    console.error('Netlify function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};
