"use client";

import { useQuery } from '@tanstack/react-query';
import { getPaymentHistory } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function TutorEarningsPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: getPaymentHistory,
  });

  const payments = response?.data || [];
  const completedPayments = payments.filter((p: any) => p.status === 'Completed');
  const totalEarnings = completedPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Earnings & Transactions</h1>
        <p className="text-muted-foreground">Monitor received student payments, invoices, and your total teaching revenue.</p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map(i => <div key={i} className="h-28 bg-muted/50 rounded-2xl animate-pulse" />)}
          </div>
          <div className="h-64 bg-muted/50 rounded-2xl animate-pulse" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-md bg-linear-to-br from-emerald-500 to-teal-600 text-white hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Total Revenue</CardTitle>
                <div className="bg-white/20 p-2 rounded-lg"><DollarSign className="h-4 w-4 text-white" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">${totalEarnings.toFixed(2)}</div>
                <p className="text-xs text-white/80 mt-1.5">Cleared and withdrawable</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white dark:bg-black/50 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Transactions Logged</CardTitle>
                <div className="bg-muted p-2 rounded-lg text-primary"><Wallet className="h-4 w-4" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground">{completedPayments.length}</div>
                <p className="text-xs text-muted-foreground mt-1.5">Successful payment transfers</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-md bg-white dark:bg-black/50">
            <CardHeader>
              <CardTitle>Invoices & Receipts</CardTitle>
              <CardDescription>A history of all student tuition payments processed on your account.</CardDescription>
            </CardHeader>
            <CardContent>
              {completedPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b text-sm font-medium text-muted-foreground">
                        <th className="pb-3 pt-1">Transaction ID</th>
                        <th className="pb-3 pt-1">Student</th>
                        <th className="pb-3 pt-1">Date</th>
                        <th className="pb-3 pt-1">Status</th>
                        <th className="pb-3 pt-1 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                      {completedPayments.map((payment: any) => (
                        <tr key={payment._id} className="hover:bg-muted/10 transition-colors">
                          <td className="py-4 font-mono text-xs">{payment.transactionId}</td>
                          <td className="py-4 font-medium">{payment.student?.name || 'Student'}</td>
                          <td className="py-4 text-muted-foreground">{new Date(payment.createdAt).toLocaleDateString()}</td>
                          <td className="py-4">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                              Cleared
                            </span>
                          </td>
                          <td className="py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">+${payment.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-2xl bg-muted/10">
                  <TrendingUp className="mx-auto h-8 w-8 mb-3 text-muted-foreground" />
                  No payment transactions processed yet.
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
