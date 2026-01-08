import React from 'react';
import { CreditCard, History, Layout, ArrowUpRight } from 'lucide-react';

const BillingView = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold mb-8">Usage & Billing</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Current Plan Card */}
        <div className="lg:col-span-2 bg-[#1e1f20] border border-[#3c4043] p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Current Plan</p>
              <h3 className="text-xl font-bold text-[#8ab4f8]">Developer Pro</h3>
            </div>
            <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md transition-colors">Manage Plan</button>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Monthly Credit Usage</span>
                <span>$42.50 / $100.00</span>
              </div>
              <div className="h-2 bg-black rounded-full overflow-hidden">
                <div className="h-full bg-[#8ab4f8] w-[42.5%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-[#1e1f20] border border-[#3c4043] p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-[#2d2e30] transition-colors">
            <div className="flex items-center gap-3">
              <CreditCard size={18} className="text-gray-400" />
              <span className="text-sm font-medium">Payment Method</span>
            </div>
            <ArrowUpRight size={16} className="text-gray-500" />
          </div>
          <div className="bg-[#1e1f20] border border-[#3c4043] p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-[#2d2e30] transition-colors">
            <div className="flex items-center gap-3">
              <History size={18} className="text-gray-400" />
              <span className="text-sm font-medium">Billing History</span>
            </div>
            <ArrowUpRight size={16} className="text-gray-500" />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      <div className="bg-[#1e1f20] border border-[#3c4043] rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#3c4043] bg-black/20">
              <th className="px-6 py-4 font-medium text-gray-400">Date</th>
              <th className="px-6 py-4 font-medium text-gray-400">Description</th>
              <th className="px-6 py-4 font-medium text-gray-400">Amount</th>
              <th className="px-6 py-4 font-medium text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3c4043]">
            <tr>
              <td className="px-6 py-4 text-gray-300">Jan 01, 2024</td>
              <td className="px-6 py-4">Monthly Subscription - Pro</td>
              <td className="px-6 py-4">$29.00</td>
              <td className="px-6 py-4 text-green-400">Paid</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-gray-300">Dec 01, 2023</td>
              <td className="px-6 py-4">Monthly Subscription - Pro</td>
              <td className="px-6 py-4">$29.00</td>
              <td className="px-6 py-4 text-green-400">Paid</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingView;