// import React, { useState } from 'react';
// import { deleteSubscription } from "../api";
// import { useEffect, useState } from "react";
// import { fetchSubscriptions } from "../api";
import React, { useEffect, useState } from "react";
import { fetchSubscriptions, deleteSubscription } from "../api";

const SubscriptionList = ({ subscriptions, onDelete, onEdit }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const handleDelete = async (id) => {
        try {
            await deleteSubscription(id);
            onDelete(id);
        } catch (error) {
            alert("Delete failed");
        }
    };

    const filteredSubscriptions = subscriptions.filter(sub =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Your Subscriptions</h3>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '200px', marginBottom: 0 }}
                />
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Category</th>
                            <th>Cost</th>
                            <th>Cycle</th>
                            <th>Renewal</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSubscriptions.map((sub) => {
                            const today = new Date();
                            const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                            const renewal = new Date(sub.renewal_date);
                            const daysUntil = Math.ceil((renewal - todayZero) / (1000 * 60 * 60 * 24));
                            const isUrgent = daysUntil >= 0 && daysUntil <= 7;

                            return (
                                <tr key={sub.id}>
                                    <td style={{ fontWeight: 600 }}>{sub.name}</td>
                                    <td><span className="badge">{sub.category}</span></td>
                                    <td>${sub.cost.toFixed(2)}</td>
                                    <td>{sub.billing_cycle}</td>
                                    <td style={isUrgent ? { color: '#ef4444', fontWeight: 'bold' } : {}}>
                                        {sub.renewal_date} {isUrgent && '⚠️'}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', background: '#3b82f6', color: 'white' }} onClick={() => onEdit(sub)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }} onClick={() => onDelete(sub.id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        {filteredSubscriptions.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8' }}>
                                    {searchTerm ? 'No matching subscriptions.' : 'No subscriptions added yet.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubscriptionList;
