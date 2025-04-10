import React, {useState, useEffect} from 'react';
import { supabase } from "../Client";
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';  // this import is needed even though it says unused or else the chart doesn't render, don't remove
import '../Css-folder/Analytics.css';

const Analytics = () => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        const createChart = async () => {
            // get registration data from the event_register table
            const { data: registrations, error } = await supabase
                .from('event_register')
                .select('eventid');

            if (error) {
                console.error("Error fetching registration data: ", error);
                return;
            }

            const registrationCount = {};

            registrations.forEach(registration => {
                const eventId = registration.eventid;
                registrationCount[eventId] = (registrationCount[eventId] || 0) + 1;  // if an event does not have a registration count yet, we initialize it as 0
            });  // match each event id with its respective registration count

            const eventIds = Object.keys(registrationCount); // since event ids are the keys, collect them to query the database again

            const { data: events, error: eError } = await supabase
                .from('event')
                .select('id, name')
                .in('id', eventIds);  // get the event names from the event table to match with the event ids in the data we already collected

            if (eError) {
                console.error("Error fetching event data: ", eError);
                return;
            }

            const labels = [];
            const data = [];

            events.forEach(event => {
                labels.push(event.name);  // use event names as x axis labels
                data.push(registrationCount[event.id] || 0);  // if an event doesn't have any registrations, use 0 since it won't be found in registrationCount
                console.log("Event Name: ", event.name, "; Event Registrations: ", (registrationCount[event.id] || 0));  // log them for debugging purposes
            });

            // Set up chart data for Chart.js
            setChartData({
            labels,  // labels for each data point
            datasets: [
                {
                label: 'Number of Registrations',
                data: data,
                borderWidth: 2,
                },  // information to render the points of the graph
            ],
            });

            setLoading(false);  // remove loading message once all data is collected in order to render the graph
        };
  
        createChart();
    }, []);
  
    if (loading) {
        return (
            <div className="registration-chart">
                <p>Loading registration data...</p>
            </div>
        );  // render this while loading state is true since data has not been fetched yet to avoid crashes
    }
  
    return (  // return this once loading state changes
        <div className="registration-chart">
            <p></p>
            <h1>Event Registrations</h1>
            <Bar
                data={chartData}  // the info to create the chart
                options={{
                    scales: {
                        x: {
                            offset: true, // leaves a gap between the start and end points and the edges of the graph
                            title: {
                                display: true,  // display axis title
                                text: 'Event',
                                font: {
                                    size: 16,
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,  // else begins at smallest value
                            ticks: { precision: 0 },  // whole numbers only, can't half 1/2 a registrar
                            title: {
                                display: true,  // display axis title
                                text: 'Registrations',
                                font: {
                                    size: 16,
                                }
                            }
                        },
                    },
                    layout: {
                        padding: {
                            left: 20,
                            right: 20,  // how far the padding separating the edges of the graph and the points is
                        }
                    },
                    plugins: {
                        legend: {
                            display: false  // removes the legend from being displayed
                        },
                    }
                }}
            />
        </div>
      );
    };

export default Analytics;