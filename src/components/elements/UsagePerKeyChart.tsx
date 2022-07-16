import { CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { collection, doc, Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useFirestore, useFirestoreDocData } from "reactfire";
import {
    Bar,
    BarChart,
    Tooltip,
    XAxis, YAxis
} from "recharts";

//create your forceUpdate hook
function useForceUpdate() {
    const setValue = useState(0)[1]; // integer state
    return () => setValue((v: number) => v + 1); // update the state to force render
}


function CustomTooltip({ payload, label, active }: any) {
    if (active && payload && payload[0] && payload[0].value) {
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
                    Requests: <strong>{payload[0].value}</strong>
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
    const forceUpdate = useForceUpdate();

    // Stupid hack necessary because recharts crashes when document is updated
    useEffect(() => {
        forceUpdate();
    }, [usage]);

    // group usage data by day and sum up the calls
    const groupQueriesByDay = (
        queries: Timestamp[]
    ): { day: number, count: number }[] => {
        const today = new Date();

        const groupedQueries: { day: number, count: number }[] = [];

        // get first day of month
        const firstDayOfMonth = new Date().getDate() - new Date().getDay();
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDay();

        // filter from this month only
        queries = queries.filter((query) => query.toDate() >=
            new Date(new Date().setDate(today.getDate() - firstDayOfMonth)));
        queries = queries.filter((query) => query.toDate() <=
            new Date(new Date().setDate(today.getDate() + lastDayOfMonth)));

        queries.forEach((query) => {
            const day = new Date(query.toDate()).getDate();
            groupedQueries[day] = {
                day,
                count: groupedQueries[day] ? groupedQueries[day].count + 1 : 1
            };
        });

        return groupedQueries;
    }

    if (status === "loading") {
        return <CircularProgress />
    }
    const q = groupQueriesByDay(usage?.queries || []);
    return (
        usage && usage!.queries ?
            <BarChart
                data={q}
                width={
                    window.innerWidth > 600 ?
                        800 :
                        300
                }
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
            <Grid container justifyContent="center" alignItems="center"
            >
                <Grid item>
                    <Typography variant="h4"
                        align="center"
                    // Link to https://docs.langa.me in another tab
                    >

                        No data yet! See the <a href="https://docs.langa.me" 
                            target="_blank"
                            rel="noopener noreferrer"
                            >
                            <strong>
                                {" "}
                                documentation
                            </strong>
                        </a> for more information.

                    </Typography>
                </Grid>
            </Grid>


    );

}
