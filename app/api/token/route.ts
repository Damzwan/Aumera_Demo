import {NextResponse} from 'next/server';
import {GoogleGenAI} from '@google/genai';

export async function POST() {
    try {
        const client = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            httpOptions: { apiVersion: 'v1alpha' }
        });

        const response = await client.authTokens.create({});

        return NextResponse.json({
            token: response.name
        });
    } catch (error) {
        console.error("Token generation failed:", error);
        return NextResponse.json({error: "Failed to generate token"}, {status: 500});
    }
}