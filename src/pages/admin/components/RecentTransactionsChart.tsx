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
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}
                  label={{
                    value: "Date",
                    position: "insideBottomRight",
                    offset: -8,
                    style: {
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                    },
                  }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}
                  label={{
                    value: "Amount (₦)",
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                    },
                  }}
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
                  stroke="hsl(95 70% 45%)"
                  fill="hsl(95 50% 95%)"
                  fillOpacity={1}
                  strokeWidth={0.7}
                  dot={{ fill: "hsl(95 70% 45%)", r: 2 }}
                  activeDot={{ r: 3 }}
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
