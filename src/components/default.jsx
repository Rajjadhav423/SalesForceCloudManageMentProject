"use client";
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";
import { 
  CircleIcon, 
  ArrowUpIcon,
  ArrowDownIcon,
  CloudIcon,
  UsersIcon,
  DatabaseIcon,
  CodeIcon,
  BarChart3Icon,
  LineChartIcon,
  ActivityIcon
} from "lucide-react";
import { Progress } from "../components/ui/progress";

const Dashboard = () => {
  // Sample data for the dashboard
  const stats = [
    {
      title: "Active Users",
      value: "2,354",
      description: "User activity in the last 30 days",
      change: "+12%",
      increasing: true,
      icon: <UsersIcon className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Storage Usage",
      value: "64.2 GB",
      description: "Total cloud storage used",
      change: "+5%",
      increasing: true,
      icon: <DatabaseIcon className="h-5 w-5 text-purple-500" />
    },
    {
      title: "API Requests",
      value: "1.2M",
      description: "Total requests this month",
      change: "-3%",
      increasing: false,
      icon: <CodeIcon className="h-5 w-5 text-green-500" />
    }
  ];

  const cloudServices = [
    { name: "Sales Cloud", usage: 75, color: "bg-blue-500" },
    { name: "Service Cloud", usage: 45, color: "bg-purple-500" },
    { name: "Marketing Cloud", usage: 60, color: "bg-green-500" },
    { name: "Commerce Cloud", usage: 30, color: "bg-yellow-500" }
  ];

  const recentActivities = [
    { time: "10:32 AM", activity: "New user registration", user: "Maria K." },
    { time: "09:14 AM", activity: "Data backup completed", user: "System" },
    { time: "Yesterday", activity: "API endpoint updated", user: "Dev Team" },
    { time: "Yesterday", activity: "Storage quota increased", user: "Admin" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full text-sm text-blue-700 dark:text-blue-300">
          <CloudIcon className="h-4 w-4 mr-1" />
          Cloud Status: Online
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">{stat.title}</CardTitle>
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <CardDescription className="flex items-center">
                {stat.description}
                <div className={`ml-auto flex items-center ${stat.increasing ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.increasing ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
                  {stat.change}
                </div>
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Usage Analytics</CardTitle>
            <CardDescription>Service utilization across cloud products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cloudServices.map((service, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-gray-500">{service.usage}%</div>
                  </div>
                  <Progress value={service.usage} className={`h-2 ${service.color}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest system events</CardDescription>
            </div>
            <ActivityIcon className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                  <div className="mr-2">
                    <CircleIcon className="h-2 w-2 mt-2 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.activity}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{activity.time}</span>
                      <span className="mx-1">•</span>
                      <span>{activity.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Resource usage over time</CardDescription>
            </div>
            <LineChartIcon className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Resource Distribution</CardTitle>
              <CardDescription>Allocation across services</CardDescription>
            </div>
            <BarChart3Icon className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;