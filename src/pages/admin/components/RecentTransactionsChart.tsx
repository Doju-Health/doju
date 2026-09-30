import { useMemo } from "react";
import { useGetTransactions } from "../api/use-get-transactions";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export const RecentTransactionsChart = () => {
  const transactionsQuery = useGetTransactions();

  const chartData = useMemo(() => {
    if (!transactionsQuery.data?.data) return [];

    return transactionsQuery.data.data
      .slice(0, 10)
      .map((transaction) => ({
        date: format(new Date(transaction.createdAt), "MMM dd"),
        fullDate: transaction.createdAt,
        amount: parseFloat(transaction.amount),
      }))
      .reverse();
  }, [transactionsQuery.data]);

  return (
    <QueryWrapper
      currentQuery={transactionsQuery}
      customLoader={<Skeleton className="h-80 w-full rounded-md" />}
    >
      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <CardDescription className="text-xs">
            Transaction amounts over the last 10 transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="w-full h-80 font-inter"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid vertical={false} stroke="#eef0f3" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}
                />
                <YAxis
                  stroke="#6b7280"
                  axisLine={false}
                  tickLine={false}
                  width={48}
                  style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}
                  tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div
                          className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg font-inter"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {format(new Date(data.fullDate), "PPP")}
                          </p>
                          <p className="text-sm text-green-600 font-semibold">
                            ₦{data.amount.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </QueryWrapper>
  );
};
