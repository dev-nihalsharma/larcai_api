import React, { useEffect, useState } from 'react';
import { CreditCard, History, Wallet, ArrowUpRight, Plus } from 'lucide-react';
import { getBillingData, buyCredits } from '../api/billing';

const BillingView = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ balance: 0, history: [] });

  const [amount, setAmount] = useState(100);
  const [phone, setPhone] = useState("9999999999");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => console.log("Cashfree SDK Loaded");
    document.body.appendChild(script);
  }, []);

  const loadData = async () => {
    try {
      const res = await getBillingData();
      setData(res);
    } catch (err) {
      console.error("Failed to load billing:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async () => {
    if (!window.Cashfree) return alert("SDK not loaded yet. Please wait.");
    setProcessing(true);

    try {
      const order = await buyCredits(amount, phone);

      const cashfree = window.Cashfree({ mode: "sandbox" }); 
      cashfree.checkout({
        paymentSessionId: order.payment_session_id,
        returnUrl: `http://localhost:8000/subscriptions/success?order_id=${order.order_id}&amount=${amount}`
      });

    } catch (err) {
      alert("Recharge Failed: " + (err.error || err.message));
      setProcessing(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500 text-[#e3e3e3]">
      <h1 className="text-3xl font-bold mb-8">Usage & Billing</h1>

      {/* Balance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-[#1e1f20] border border-[#3c4043] p-6 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-gray-400 text-sm mb-1">Available Credits</p>
            <h3 className="text-4xl font-bold text-[#8ab4f8] mb-6">
              {loading ? "..." : data.balance.toFixed(2)}
            </h3>

            {/* Recharge Form */}
            <div className="flex gap-4 items-end bg-[#0e0e0e] p-4 rounded-xl border border-[#3c4043]">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="bg-[#1e1f20] border border-[#3c4043] rounded-lg px-3 py-2 text-white w-24 outline-none focus:border-[#8ab4f8]"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-[#1e1f20] border border-[#3c4043] rounded-lg px-3 py-2 text-white w-32 outline-none focus:border-[#8ab4f8]"
                />
              </div>
              <button
                onClick={handleRecharge}
                disabled={processing}
                className="bg-[#8ab4f8] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#aecbfa] transition-colors flex items-center gap-2"
              >
                {processing ? "Processing..." : <><Plus size={18} /> Add Funds</>}
              </button>
            </div>
          </div>
          {/* Background Decor */}
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#8ab4f8]/10 to-transparent pointer-events-none" />
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-[#1e1f20] border border-[#3c4043] p-4 rounded-2xl">
            <p className="text-sm text-gray-400 leading-relaxed">
              Credits are used for AI requests, model usage, and advanced features.
              Your balance is deducted automatically based on usage.
            </p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      <div className="bg-[#1e1f20] border border-[#3c4043] rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#3c4043] bg-black/20">
              <th className="px-6 py-4 font-medium text-gray-400">Date</th>
              <th className="px-6 py-4 font-medium text-gray-400">Order ID</th>
              <th className="px-6 py-4 font-medium text-gray-400">Amount</th>
              <th className="px-6 py-4 font-medium text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3c4043]">
            {data.history.length === 0 ? (
              <tr><td colSpan="4" className="p-6 text-center text-gray-500">No transactions yet</td></tr>
            ) : (
              data.history.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-gray-300">{tx.date}</td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{tx.id.split('_').pop()}</td>
                  <td className="px-6 py-4">₹{tx.amount}</td>
                  <td className={`px-6 py-4 font-medium ${tx.status === 'SUCCESS' ? 'text-green-400' :
                      tx.status === 'PENDING' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                    {tx.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingView;