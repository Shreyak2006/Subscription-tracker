import React, { useEffect, useState } from 'react';
import { fetchSubscriptions, addSubscription, deleteSubscription, updateSubscription } from './api';
import Dashboard from './components/Dashboard';
import SubscriptionForm from './components/SubscriptionForm';
import SubscriptionList from './components/SubscriptionList';

function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSubscription, setEditingSubscription] = useState(null);

  // const loadSubscriptions = async () => {
  //   try {
  //     const res = await fetchSubscriptions();
  //     setSubscriptions(res.data || []);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const loadSubscriptions = async () => {
    try {
      const res = await fetchSubscriptions();
      setSubscriptions(res || []); // ✅ FIX HERE
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  // const handleAdd = async (sub) => {
  //   try {
  //     const res = await addSubscription(sub);
  //     if (res) {
  //       loadSubscriptions();
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleAdd = async (sub) => {
    try {
      await addSubscription(sub);   // just wait
      loadSubscriptions();          // always reload
    } catch (error) {
      console.error(error);
    }
  };

  // const handleUpdate = async (id, sub) => {
  //   try {
  //     const res = await updateSubscription(id, sub);
  //     if (res) {
  //       loadSubscriptions();
  //       setEditingSubscription(null);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  const handleUpdate = async (id, sub) => {
    try {
      await updateSubscription(id, sub);  // no res check
      loadSubscriptions();
      setEditingSubscription(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubscription(id);
      setSubscriptions(subscriptions.filter((s) => s.id !== id));
      if (editingSubscription && editingSubscription.id === id) {
        setEditingSubscription(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (sub) => {
    setEditingSubscription(sub);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingSubscription(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <h1>SubTrack 🚀</h1>
        <p style={{ color: '#94a3b8' }}>Manage your subscriptions and expenses with AI-powered ease.</p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      ) : (
        <>
          <Dashboard subscriptions={subscriptions} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            <div style={{ gridColumn: 'span 1' }}>
              <SubscriptionForm
                onAdd={handleAdd}
                onUpdate={handleUpdate}
                editingSubscription={editingSubscription}
                onCancelEdit={handleCancelEdit}
              />
            </div>

            <div style={{ gridColumn: 'span 1' }}>
              <SubscriptionList
                subscriptions={subscriptions}
                onDelete={handleDelete}
                onEdit={handleEditClick}
              />
            </div>
          </div>
          <style>{`
            @media (max-width: 768px) {
                div[style*="grid-template-columns"] {
                    grid-template-columns: 1fr !important;
                }
            }
          `}</style>
        </>
      )}
    </div>
  );
}

export default App;
