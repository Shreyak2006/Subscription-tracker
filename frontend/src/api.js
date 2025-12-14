const API_URL = 'http://localhost:8000/subscription';

export const fetchSubscriptions = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    return data.data[0];
};

export const addSubscription = async (subscription) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
    });
    if (!response.ok) throw new Error('Failed to add');
    return response.json();
};

export const deleteSubscription = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete');
    return response.json();
};

export const updateSubscription = async (id, subscription) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
    });
    if (!response.ok) throw new Error('Failed to update');
    return response.json();
};
