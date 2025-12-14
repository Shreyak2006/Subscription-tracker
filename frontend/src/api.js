// const API_URL = 'http://localhost:8000/subscription';
// const API_URL = "https://subscription-tracker-dashboard.render.com/web/srv-d4ve71a4d50c73807us0/logs?r=1h.onrender.com/subscription";
// const API_URL = "https://subscription-tracker-xxxx.onrender.com/subscription";

const API_URL = "https://subscription-tracker-9ktn.onrender.com/subscription";
export const fetchSubscriptions = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    console.log("Fetched subscriptions:", data);
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