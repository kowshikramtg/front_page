import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ 
            error: 'GEMINI_API_KEY is not set in the environment. Please add it to your .env.local file.',
            needsKey: true
        }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const textMessage = formData.get('message') as string;
        const file = formData.get('file') as File | null;

        const genAI = new GoogleGenerativeAI(apiKey);
        
        // We use gemini-1.5-flash as it is extremely fast and handles document attachment perfectly.
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Load specific context from our specialized knowledge base
        let systemContext = '';
        try {
            const contextPath = path.join(process.cwd(), 'lib', 'mot-007-context.txt');
            systemContext = await fs.readFile(contextPath, 'utf-8');
        } catch (e) {
            console.warn('Could not load specialized context (lib/mot-007-context.txt). Proceeding without it.');
        }

        const prompt = [
            `SYSTEM INSTRUCTION: You are an industrial expert diagnostic AI system for the SPredict Platform. Respond using neat markdown. Keep it punchy, technical, and actionable.`,
            `SPECIALIZED DOMAIN KNOWLEDGE BASE:\n${systemContext}`,
            `\n---\nUSER INQUIRY:\n${textMessage || 'Review the attached equipment document and summarize the key fault thresholds.'}`
        ];

        let result;
        
        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            
            const filePart = {
                inlineData: {
                    data: buffer.toString('base64'),
                    mimeType: file.type || 'application/pdf',
                },
            };
            
            result = await model.generateContent([filePart, ...prompt]);
        } else {
            result = await model.generateContent(prompt);
        }

        const responseText = result.response.text();

        return NextResponse.json({ reply: responseText });

    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
