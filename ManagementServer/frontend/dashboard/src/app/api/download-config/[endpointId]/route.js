import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    // Await the params before using them
    const { endpointId } = await Promise.resolve(params);

    // Get endpoint details from backend
    const response = await fetch(`http://backend:5001/get-endpoint/${endpointId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch endpoint details');
    }

    const data = await response.json();

    // Generate config file content
    const configContent = `# Endpoint Configuration File
api=http://localhost:5001/submit_logs
key=${data.authkey}
name=${data.Name}
id=${data.endpoint_id}
buffer_size=65
batch_size=90`;

    // Return the config file
    return new NextResponse(configContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename=endpoint_${endpointId}_config.conf`,
      },
    });
  } catch (error) {
    console.error('Download config error:', error);
    return NextResponse.json({ error: 'Failed to download configuration' }, { status: 500 });
  }
} 