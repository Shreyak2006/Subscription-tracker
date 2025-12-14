import React, { useMemo } from 'react';

const Dashboard = ({ subscriptions }) => {
    const totalCost = useMemo(() => {
        return subscriptions.reduce((acc, curr) => acc + curr.cost, 0);
    }, [subscriptions]);

    const activeCount = subscriptions.length;

    // Find nearest upcoming renewal
    const upcomingRenewal = useMemo(() => {
        if (subscriptions.length === 0) return { date: 'None', isUrgent: false };

        const today = new Date();
        const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const sorted = [...subscriptions]
            .map(s => ({ ...s, dateObj: new Date(s.renewal_date) }))
            .filter(s => s.dateObj >= todayZero)
            .sort((a, b) => a.dateObj - b.dateObj);

        if (sorted.length === 0) return { date: 'None', isUrgent: false };

        const next = sorted[0];
        const diffTime = Math.abs(next.dateObj - todayZero);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
            date: `${next.name} (${next.renewal_date})`,
            isUrgent: diffDays <= 7,
            name: next.name,
            days: diffDays
        };
    }, [subscriptions]);

    React.useEffect(() => {
        if (upcomingRenewal.isUrgent && 'Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification('SubTrack Alert 🚨', {
                    body: `Your subscription for ${upcomingRenewal.name} renews in ${upcomingRenewal.days} days!`,
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission();
            }
        }
    }, [upcomingRenewal]);

    return (
        <div className="stats-grid">
            <div className="card">
                <div className="stat-label">Total Monthly Cost</div>
                <div className="stat-value">${totalCost.toFixed(2)}</div>
            </div>
            <div className="card">
                <div className="stat-label">Active Subscriptions</div>
                <div className="stat-value">{activeCount}</div>
            </div>
            <div className="card" style={upcomingRenewal.isUrgent ? { border: '1px solid #ef4444', background: 'rgba(239, 68, 68, 0.1)' } : {}}>
                <div className="stat-label" style={upcomingRenewal.isUrgent ? { color: '#ef4444' } : {}}>Next Renewal</div>
                <div className="stat-value" style={{ fontSize: '1.25rem', color: upcomingRenewal.isUrgent ? '#ef4444' : 'inherit' }}>
                    {upcomingRenewal.date}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
