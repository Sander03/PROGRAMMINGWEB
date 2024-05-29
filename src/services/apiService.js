import {getToken} from "@/services/userService";

export async function post(endpoint, body) {
    let headers = {
        'Content-Type': 'application/json',
    }
    const token = getToken();
    if (token !== undefined && token !== null) {
        headers["Authorization"] = `Basic ${getToken()}`
    }
    const response = await fetch(`https://localhost:7232/api/${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: body
    });
    if (!response.ok) {
        let errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(`Server error: ${response.statusText} - ${errorData}`);
    }
    return response.json();
}