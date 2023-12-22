import { SYSTEM_PROMPT } from '$lib/prompts.js';
import type { AnalysisResponse } from '$lib/typing.js';
import { error, json } from '@sveltejs/kit';

import OpenAI from 'openai';

import { OPENAI_API_KEY } from '$env/static/private'


let DEBUG_RES: AnalysisResponse = {
    "overview": "Analysis of ERC-20 Smart Contract",
    "elements": [
        {
            "title": "Total Supply Initialization",
            "description": "The total supply is set during contract creation, but no check is performed to ensure it is non-zero.",
            "severity": "Medium"
        },
        {
            "title": "Balance Initialization",
            "description": "The caller's balance is set during contract creation, assuming a non-zero total supply. No explicit check is in place.",
            "severity": "Medium"
        },
        {
            "title": "Balance Retrieval",
            "description": "The 'balance_of_or_zero' function may return 0 if the owner's balance is not explicitly set. Consider handling this case more gracefully.",
            "severity": "Low"
        },
        {
            "title": "Allowance Retrieval",
            "description": "The 'allowance_of_or_zero' function may return 0 if the owner's allowance is not explicitly set. Consider handling this case more gracefully.",
            "severity": "Low"
        },
        {
            "title": "Allowance Approval",
            "description": "The 'approve' function allows unlimited approval, posing a potential security risk. Consider implementing a limit or additional checks.",
            "severity": "High"
        },
        {
            "title": "Transfer From",
            "description": "The 'transfer_from' function allows transfers without sufficient allowance checks. It should ensure that the caller has the required allowance before transferring.",
            "severity": "High"
        },
        {
            "title": "Transfer",
            "description": "The 'transfer' function allows transfers without checking if the caller has a sufficient balance. It should verify that the sender has enough tokens before proceeding.",
            "severity": "High"
        }
    ]
}


export async function GET({ url }) {
    const contract_url = url.searchParams.get("contracturl");

    if (contract_url == null) {
        error(400, "No contracturl specified");
    }

    console.log(`analyzing contract at: ${contract_url}`)

    // fetch contract from url  
    let file_data: Response;
    try {
        file_data = await fetch(contract_url);

    } catch {
        error(500, "Failed to load contract file")
    }

    //console.log(await file_data.text())

    // prepare query to llm
    const openai = new OpenAI({
        apiKey: OPENAI_API_KEY, // This is the default and can be omitted
    });

    const user_prompt = `Here is the contract file to analyze:\n ${await file_data.text()}`

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: SYSTEM_PROMPT}, {role: 'user', content: user_prompt}],
        model: 'gpt-4',

    });

    // return it
    let resp: AnalysisResponse = {
        overview: "",
        elements: JSON.parse(chatCompletion.choices[0].message.content).elements
    }

    return new Response(JSON.stringify(resp));
}