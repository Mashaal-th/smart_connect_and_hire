import type { NextApiRequest, NextApiResponse } from "next";
import {Configuaration, OpenAIApi} from 'openai';

const configuration = new Configuaration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    if (req.method  !== 'POST') return res.status(405).end('Method mot allowed');

    const {message} = req.body;

    if (!message) return res.status(400).json ({error:'No message provided'});
     
    try {
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content:message}],

        });
        const reply = completion.data.choices[0].message?.content;
        res.status(200).json({reply});
    }
    catch (error:any){
        console.error(error);
        res.status(500).json({error:'OpenAI API request failed'});
    }
}