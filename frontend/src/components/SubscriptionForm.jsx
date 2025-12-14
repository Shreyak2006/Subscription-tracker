import React, { useState, useEffect } from 'react';

const SubscriptionForm = ({ onAdd, onUpdate, editingSubscription, onCancelEdit }) => {
    const [form, setForm] = useState({
        name: '',
        category: 'Entertainment',
        cost: '',
        billing_cycle: 'Monthly',
        renewal_date: ''
    });

    useEffect(() => {
        if (editingSubscription) {
            setForm({
                name: editingSubscription.name,
                category: editingSubscription.category,
                cost: editingSubscription.cost,
                billing_cycle: editingSubscription.billing_cycle,
                renewal_date: editingSubscription.renewal_date
            });
        }
    }, [editingSubscription]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const subData = { ...form, cost: parseFloat(form.cost) };

        if (editingSubscription) {
            onUpdate(editingSubscription.id, subData);
        } else {
            onAdd(subData);
        }

        clearForm();
    };

    const clearForm = () => {
        setForm({
            name: '',
            category: 'Entertainment',
            cost: '',
            billing_cycle: 'Monthly',
            renewal_date: ''
        });
    }

    return (
        <div className="card">
            <h3>{editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input name="name" placeholder="Service Name (e.g. Netflix)" value={form.name} onChange={handleChange} required />
                    <select name="category" value={form.category} onChange={handleChange}>
                        <option>Entertainment</option>
                        <option>Productivity</option>
                        <option>Utilities</option>
                        <option>Other</option>
                    </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <input name="cost" type="number" step="0.01" placeholder="Cost" value={form.cost} onChange={handleChange} required />
                    <select name="billing_cycle" value={form.billing_cycle} onChange={handleChange}>
                        <option>Monthly</option>
                        <option>Yearly</option>
                    </select>
                    <input name="renewal_date" type="date" value={form.renewal_date} onChange={handleChange} required />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        {editingSubscription ? 'Update Subscription' : 'Add Subscription'}
                    </button>
                    {editingSubscription && (
                        <button type="button" className="btn btn-danger" onClick={onCancelEdit}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default SubscriptionForm;
