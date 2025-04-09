import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        // "backend" domain name is resolved by docker to the address of the backend container
        const response = await fetch("http://backend:5001/login");
        const data = await response.json();
        
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
