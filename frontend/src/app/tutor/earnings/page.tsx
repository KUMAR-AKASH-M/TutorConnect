"use client";

import { useQuery } from '@tanstack/react-query';
import { getPaymentHistory } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, IndianRupee, TrendingUp, ArrowUpRight, Receipt } from 'lucide-react';

export default function TutorEarningsPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: getPaymentHistory,
  });

  const payments = response?.data || [];
  const completedPayments = payments.filter((p: any) => p.status === 'Completed');
  const pendingPayments = payments.filter((p: any) => p.status === 'Pending');
  const totalEarnings = completedPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  const pendingEarnings = pendingPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-3xl animate-pulse" />)}
        </div>
        <div className="h-72 bg-slate-100 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Earnings & Transactions</h1>
        <p className="text-slate-500 mt-1">Monitor your received payments and total teaching revenue.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-linear-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl text-white shadow-lg shadow-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-white/80">Total Revenue</p>
            <div className="bg-white/20 p-2 rounded-xl">
              <IndianRupee className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="text-4xl font-bold">₹{totalEarnings.toFixed(2)}</div>
          <p className="text-xs text-white/70 mt-1.5 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> Cleared & withdrawable
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-500">Completed</p>
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="text-4xl font-bold text-slate-900">{completedPayments.length}</div>
          <p className="text-xs text-slate-400 mt-1.5">Successful transactions</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-500">Pending</p>
            <div className="bg-amber-50 p-2 rounded-xl text-amber-500">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div className="text-4xl font-bold text-slate-900">₹{pendingEarnings.toFixed(2)}</div>
          <p className="text-xs text-slate-400 mt-1.5">Awaiting processing</p>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Invoices & Receipts</h2>
          <p className="text-slate-500 text-sm mt-1">A history of all student tuition payments processed on your account.</p>
        </div>

        {completedPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {completedPayments.map((payment: any) => (
                  <tr key={payment._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{payment.transactionId?.substring(0, 18)}...</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                          {(payment.student?.name || 'S').charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-900 text-sm">{payment.student?.name || 'Student'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{new Date(payment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">Cleared</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                      +₹{payment.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <TrendingUp className="mx-auto h-10 w-10 mb-3 text-slate-300" />
            <p className="font-semibold text-slate-500">No transactions yet</p>
            <p className="text-sm mt-1">Your earnings will appear here once students complete payments.</p>
          </div>
        )}
      </div>
    </div>
  );
}
