export const getBackendService = async () => {
    const response = await fetch('http://localhost:3000');

    if(!response.ok) {
        throw new Error('Failed to reach backend status');
    }
    return response.text();
}