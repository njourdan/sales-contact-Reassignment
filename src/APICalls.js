import dotenv from 'dotenv';
import Bottleneck from 'bottleneck';
dotenv.config();
const API_KEY = process.env.API_KEY
const limiter = new Bottleneck({
    maxConcurrent: 10,
    minTime: 100,
    reservoir: 10, // Initial number of requests
    reservoirIncreaseAmount: 3,
    reservoirIncreaseInterval: 100, // request 10 times a second
    reservoirIncreaseMaximum: 15, // Maximum reservoir size
});
export const limitedInsightlyCall = limiter.wrap(insightlyCall);
export async function insightlyCall(endPoint, options = {}, retries = 5) {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            await delay(250); // 3-second delay before each attempt
            
            let url = 'https://api.na1.insightly.com/v3.1/' + endPoint;
            let defaultHeaders = {
                'Accept': 'application/json',
                'Authorization': 'Basic ' + API_KEY,
            };
            options.headers = { ...defaultHeaders, ...options.headers };
            options.method = options.method || "GET";
            
            let response = await fetch(url, options);
            
            if (response.status === 429) {
                if (attempt < retries) {
                    console.warn('429 Too Many Requests. Retrying...');
                    continue; // Retry if the maximum number of retries has not been reached
                } else {
                    throw new Error('HTTP error! status: 429 (Too Many Requests). Maximum retries exceeded.');
                }
            }
            
            if (!response.ok) {
                console.warn('400 error on'+endPoint);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error in insightlyCall: ' + error.message);
            if (attempt >= retries) {
                throw error; // Rethrow the error after the maximum number of retries
            }
        }
    }
}