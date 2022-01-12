import { CircularProgress, Paper, Typography } from "@mui/material";
import { collection, doc, Timestamp } from "firebase/firestore";
import React from "react";
import { useFirestore, useFirestoreDocData } from "reactfire";
import {
    Bar,
    BarChart,
    Tooltip,
    XAxis, YAxis
} from "recharts";


function CustomTooltip({ payload, label, active }: any) {
    if (active && payload[0].value) {
        return (
            // label + current month short string
            <Paper
                variant="outlined"
                sx={{
                    padding: "1rem",
                }}
            >
                <Typography>
                    {label + " " +
                        new Date().toLocaleString("en-us", { month: "short" })}
                </Typography>
                <Typography>
                    Usage: <strong>{payload[0].value}</strong>
                </Typography>
            </Paper>
        );
    }

    return null;
}

interface IUsagePerKeyChartProps {
    keyId: string;
}
export default function UsagePerKeyChart({ keyId }: IUsagePerKeyChartProps) {
    const firestore = useFirestore();
    const usagesCollection = collection(firestore, "usages");
    const usageDoc = doc(usagesCollection, keyId);
    const { status, data: usage } = useFirestoreDocData(usageDoc);

    // group usage data by day and sum up the calls
    const groupQueriesByDay = (
        queries: Timestamp[]
    ): { day: number, count: number }[] => {
        // current day as a number (e.g. 12)
        const today = new Date().getDate();
        // list of {[day: number]: number}
        // groupQueries initialised with 8 days before today and 8 days after today
        const groupedQueries: { day: number, count: number }[] =
            Array(16).fill(null).map((e, i) => ({
                day: (16 - today) + i

                , count: 0
            }))
                // filter out negative days (i.e. if today is 4, then filter out -1, -2, -3, -4)
                .filter(e => e.day > 0);
        queries = queries.filter((query) => query.toDate() > new Date(new Date().setDate(today - 8)));
        queries = queries.filter((query) => query.toDate() < new Date(new Date().setDate(today + 8)));
        queries.forEach((query) => {
            const day = new Date(query.toDate()).getDate();
            groupedQueries.forEach((groupedQuery) => {
                if (groupedQuery.day === day) {
                    groupedQuery.count++;
                }
            });
        });
        return groupedQueries;
    }

    if (status === "loading") {
        return <CircularProgress />
    }
    return (
        usage && usage.queries ?
            <BarChart
                data={groupQueriesByDay(usage?.queries || [])}
                width={800}
                height={400}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                }}
            >
                <Bar dataKey="count" fill="#1f40e6" />
                <Tooltip
                    position={{ y: -40 }}
                    content={<CustomTooltip />}
                />
                <XAxis dataKey="day"
                    type="category"
                />
                <YAxis type="number" dataKey="count"
                />
            </BarChart>
            :
            <h1>No data</h1>


    );

}
