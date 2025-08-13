"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Users,
  FolderOpen,
  Trophy,
  Clock,
  Users2,
  FolderCheck,
  Vote,
  Hash,
  CodeSquare,
  BadgeCheck,
  Code2,
  User,
  Torus,
  Text,
  Cat,
  Coins,
  Hammer,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import LiveStatus from "./live";
import Leader from "./leader";

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border shadow-lg backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = "" }) {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>{children}</div>
  );
}

function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}
let lbNotes = [
  "IT'S LEADERBOARD TIME, CHAT",
  "Lets taketh a look at the leaderboards",
  "I tried making every leaderboard I can ;D",
];

export default function StatsDashboard({ stats }) {
  const safeStats = {
    total_projects: stats?.total_projects || 0,
    certified: stats?.certified || 0,
    certified_10: stats?.certified_10 || 0,
    devlogs: stats?.devlogs || 0,
    channels: stats?.channels || 0,
    votes_cast: stats?.votes_cast || 0,
    total_projects: stats?.total_projects || 0,
    total_users: stats?.total_users || 0,
    joined_users: stats?.joined_users || 0,
    total_minutes: stats?.total_minutes || 0,
    project_chart: stats?.project_chart || {},
    user_chart: stats?.user_chart || {},
    participants_chart: stats?.participants_chart || {},
    votes_chart: stats?.votes_chart || {},
    minutes_chart: stats?.minutes_chart || {},
    total_bans: stats?.total_bans || 0,
    total_burned_shells: stats?.total_burned_shells || 0,
    total_shells: stats?.total_shells || 0,
    total_items: stats?.total_items || 0,
    total_purchased: stats?.total_purchased || 0,
    last_synced: new Date(stats.last_sync) || new Date(),
  };

  const chartData = Object.entries(safeStats.project_chart).map(
    ([timestamp, count]) => {
      try {
        const date = new Date(timestamp);
        return {
          day: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
          }),
          projects: count || 0,
          fullDate: date.toLocaleDateString(),
        };
      } catch (error) {
        return {
          day: "Invalid",
          projects: count || 0,
          fullDate: "Invalid Date",
        };
      }
    }
  );
  const chartData_users = Object.entries(safeStats.user_chart).map(
    ([timestamp, count]) => {
      try {
        const date = new Date(timestamp);
        return {
          day: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
          }),
          projects: count || 0,
          fullDate: date.toLocaleDateString(),
        };
      } catch (error) {
        return {
          day: "Invalid",
          projects: count || 0,
          fullDate: "Invalid Date",
        };
      }
    }
  );
  const chartData_participants = Object.entries(
    safeStats.participants_chart
  ).map(([timestamp, count]) => {
    try {
      const date = new Date(timestamp);
      return {
        day: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
        }),
        projects: count || 0,
        fullDate: date.toLocaleDateString(),
      };
    } catch (error) {
      return {
        day: "Invalid",
        projects: count || 0,
        fullDate: "Invalid Date",
      };
    }
  });
  const chartData_votes = Object.entries(safeStats.votes_chart).map(
    ([timestamp, count]) => {
      try {
        const date = new Date(timestamp);
        return {
          day: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
          }),
          projects: count || 0,
          fullDate: date.toLocaleDateString(),
        };
      } catch (error) {
        return {
          day: "Invalid",
          projects: count || 0,
          fullDate: "Invalid Date",
        };
      }
    }
  );
  const chartData_hours = Object.entries(safeStats.minutes_chart).map(
    ([timestamp, count]) => {
      try {
        const date = new Date(timestamp);
        return {
          day: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
          }),
          projects: Math.floor((count / 60) * 10) / 10 || 0,
          fullDate: date.toLocaleDateString(),
        };
      } catch (error) {
        return {
          day: "Invalid",
          projects: Math.floor((count / 60) * 10) / 10 || 0,
          fullDate: "Invalid Date",
        };
      }
    }
  );

  const chartValues = Object.values(safeStats.project_chart);
  const firstValue = chartValues[0] || 0;
  const lastValue = chartValues[chartValues.length - 1] || 0;
  const growth = lastValue - firstValue;
  const growthPercentage =
    firstValue > 0 ? ((growth / firstValue) * 100).toFixed(1) : "0.0";

  const chartValues_users = Object.values(safeStats.user_chart);
  const firstValue_users = chartValues_users[0] || 0;
  const lastValue_users = chartValues_users[chartValues_users.length - 1] || 0;
  const growth_users = lastValue_users - firstValue_users;
  const growthPercentage_users =
    firstValue_users > 0
      ? ((growth_users / firstValue_users) * 100).toFixed(1)
      : "0.0";

  const chartValues_participants = Object.values(safeStats.participants_chart);
  const firstValue_participants = chartValues_participants[0] || 0;
  const lastValue_participants =
    chartValues_participants[chartValues_participants.length - 1] || 0;
  const growth_participants = lastValue_participants - firstValue_participants;
  const growthPercentage_participants =
    firstValue_participants > 0
      ? ((growth_participants / firstValue_participants) * 100).toFixed(1)
      : "0.0";

  const chartValues_hours = Object.values(safeStats.minutes_chart);
  const firstValue_hours = (chartValues_hours[0] || 0) / 6;
  const lastValue_hours =
    (chartValues_hours[chartValues_hours.length - 1] || 0) / 6;
  const growth_hours = Math.floor(lastValue_hours - firstValue_hours) / 10;
  const growthPercentage_hours =
    firstValue_hours > 0
      ? ((growth_hours / (firstValue_hours / 10)) * 100).toFixed(1)
      : "0.0";

  const chartValues_votes = Object.values(safeStats.votes_chart);
  const firstValue_votes = (chartValues_votes[0] || 0) / 6;
  const lastValue_votes =
    (chartValues_votes[chartValues_votes.length - 1] || 0) / 6;
  const growth_votes = Math.floor(lastValue_votes - firstValue_votes) / 10;
  const growthPercentage_votes =
    firstValue_votes > 0
      ? ((growth_votes / (firstValue_votes / 10)) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <a href="https://alimadcorp.github.io/hackclubusers" target="_blank">
          <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors">
                HackClub Users
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {safeStats.total_users.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">Active in Slack</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          </Card>
        </a>
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-green-500/50 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-green-300 transition-colors">
              SoM Participants
            </CardTitle>
            <div className="p-2 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
              <Users2 className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {safeStats.joined_users.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Joined Summer of Making</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-pink-300 transition-colors">
              Total Channels
            </CardTitle>
            <div className="p-2 rounded-lg bg-pink-500/20 group-hover:bg-pink-500/30 transition-colors">
              <Hash className="h-4 w-4 text-pink-400" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-pink-400 mb-1">
              {safeStats.channels.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              Different topics in the community
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-pink-600"></div>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-emerald-300 transition-colors">
              Total Projects
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors">
              <FolderOpen className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              {safeStats.total_projects.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Amazing projects created</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-violet-500/50 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-violet-300 transition-colors">
              Certified Projects
            </CardTitle>
            <div className="p-2 rounded-lg bg-violet-500/20 group-hover:bg-violet-500/30 transition-colors">
              <FolderCheck className="h-4 w-4 text-violet-400" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-violet-400 mb-1">
              {safeStats.certified.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              {safeStats.certified_10} approved 10h+ projects
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-violet-600"></div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-purple-300 transition-colors">
              Total Hours
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
              <Clock className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {(
                Math.floor((safeStats.total_minutes / 60) * 10) / 10
              ).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              Spent building cool projects
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-amber-500/50 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-amber-300 transition-colors">
              Total Devlogs
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/20 group-hover:bg-amber-500/30 transition-colors">
              <CodeSquare className="h-4 w-4 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-amber-400 mb-1">
              {safeStats.devlogs.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Showcasing progress</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-600"></div>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-cyan-300 transition-colors">
              Total Votes
            </CardTitle>
            <div className="p-2 rounded-lg bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors">
              <Vote className="h-4 w-4 text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-cyan-400 mb-1">
              {safeStats.votes_cast.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Cast on projects</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-cyan-600"></div>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-yellow-300 transition-colors">
              Total Shells Earned
            </CardTitle>
            <div className="p-2 rounded-lg bg-yellow-500/20 group-hover:bg-yellow-500/30 transition-colors">
              <Coins className="h-4 w-4 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {safeStats.total_shells.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Out of which {safeStats.total_burned_shells.toLocaleString()} were burned</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-red-500/50 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-red-300 transition-colors">
              Total Users Banned
            </CardTitle>
            <div className="p-2 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
              <Hammer className="h-4 w-4 text-red-400" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {safeStats.total_bans.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Be good kids</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-teal-500/50 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-teal-300 transition-colors">
              Total Items in Shop
            </CardTitle>
            <div className="p-2 rounded-lg bg-teal-500/20 group-hover:bg-teal-500/30 transition-colors">
              <ShoppingBag className="h-4 w-4 text-teal-400" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-teal-400 mb-1">
              {safeStats.total_items.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Suggested and added by Hackclubbers</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-teal-600"></div>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-fuchsia-500/50 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-fuchsia-300 transition-colors">
              Total Items Purchased
            </CardTitle>
            <div className="p-2 rounded-lg bg-fuchsia-500/20 group-hover:bg-fuchsia-500/30 transition-colors">
              <ShoppingCart className="h-4 w-4 text-fuchsia-400" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-fuchsia-400 mb-1">
              {safeStats.total_purchased.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Yes, that many</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 to-fuchsia-600"></div>
        </Card>
      </div>
      <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="p-4 border-b border-gray-700/50">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-200">
            <div className="p-1.5 rounded-lg bg-blue-500/20">
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </div>
            Projects Growth Timeline
            <span className="ml-auto text-sm font-normal text-gray-400">
              +{growth} ({growthPercentage}%)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickLine={{ stroke: "#4B5563" }}
                  axisLine={{ stroke: "#4B5563" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickLine={{ stroke: "#4B5563" }}
                  axisLine={{ stroke: "#4B5563" }}
                  domain={["dataMin - 5", "dataMax + 5"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                    fontSize: "12px",
                    color: "#E5E7EB",
                  }}
                  formatter={(value) => [
                    `${value.toLocaleString()} projects`,
                    "Total Projects",
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="projects"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{
                    fill: "#3B82F6",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "#1E40AF",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#1D4ED8",
                    stroke: "#3B82F6",
                    strokeWidth: 2,
                    filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))",
                  }}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="p-4 border-b border-gray-700/50">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-200">
            <div className="p-1.5 rounded-lg bg-blue-500/20">
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </div>
            Users Growth Timeline
            <span className="ml-auto text-sm font-normal text-gray-400">
              +{growth_users} ({growthPercentage_users}%)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData_users}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickLine={{ stroke: "#4B5563" }}
                  axisLine={{ stroke: "#4B5563" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickLine={{ stroke: "#4B5563" }}
                  axisLine={{ stroke: "#4B5563" }}
                  domain={["dataMin - 5", "dataMax + 5"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                    fontSize: "12px",
                    color: "#E5E7EB",
                  }}
                  formatter={(value) => [
                    `${value.toLocaleString()}`,
                    "Total Users",
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="projects"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{
                    fill: "#3B82F6",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "#1E40AF",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#1D4ED8",
                    stroke: "#3B82F6",
                    strokeWidth: 2,
                    filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))",
                  }}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="p-4 border-b border-gray-700/50">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-200">
            <div className="p-1.5 rounded-lg bg-blue-500/20">
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </div>
            Participants Over Time
            <span className="ml-auto text-sm font-normal text-gray-400">
              +{growth_participants} ({growthPercentage_participants}%)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData_participants}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickLine={{ stroke: "#4B5563" }}
                  axisLine={{ stroke: "#4B5563" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickLine={{ stroke: "#4B5563" }}
                  axisLine={{ stroke: "#4B5563" }}
                  domain={["dataMin - 5", "dataMax + 5"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                    fontSize: "12px",
                    color: "#E5E7EB",
                  }}
                  formatter={(value) => [
                    `${value.toLocaleString()}`,
                    "Total Participants",
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="projects"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{
                    fill: "#3B82F6",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "#1E40AF",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#1D4ED8",
                    stroke: "#3B82F6",
                    strokeWidth: 2,
                    filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))",
                  }}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="p-4 border-b border-gray-700/50">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-200">
            <div className="p-1.5 rounded-lg bg-blue-500/20">
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </div>
            Total votes over time
            <span className="ml-auto text-sm font-normal text-gray-400">
              +{growth_votes} ({growthPercentage_votes}%)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData_votes}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickLine={{ stroke: "#4B5563" }}
                  axisLine={{ stroke: "#4B5563" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickLine={{ stroke: "#4B5563" }}
                  axisLine={{ stroke: "#4B5563" }}
                  domain={["dataMin - 5", "dataMax + 5"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                    fontSize: "12px",
                    color: "#E5E7EB",
                  }}
                  formatter={(value) => [
                    `${value.toLocaleString()} votes`,
                    "Total votes",
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="projects"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{
                    fill: "#3B82F6",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "#1E40AF",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#1D4ED8",
                    stroke: "#3B82F6",
                    strokeWidth: 2,
                    filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))",
                  }}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="p-4 border-b border-gray-700/50">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-200">
            <div className="p-1.5 rounded-lg bg-blue-500/20">
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </div>
            Hours Spent Over Time
            <span className="ml-auto text-sm font-normal text-gray-400">
              +{growth_hours} ({growthPercentage_hours}%)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData_hours}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickLine={{ stroke: "#4B5563" }}
                  axisLine={{ stroke: "#4B5563" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickLine={{ stroke: "#4B5563" }}
                  axisLine={{ stroke: "#4B5563" }}
                  domain={["dataMin - 5", "dataMax + 5"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                    fontSize: "12px",
                    color: "#E5E7EB",
                  }}
                  formatter={(value) => [
                    `${value.toLocaleString()}`,
                    "Total Hours",
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="projects"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{
                    fill: "#3B82F6",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "#1E40AF",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#1D4ED8",
                    stroke: "#3B82F6",
                    strokeWidth: 2,
                    filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))",
                  }}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
          <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors">
            {lbNotes[Math.floor(Math.random() * lbNotes.length)]}
          </CardTitle>
        </CardHeader>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
      </Card>
      <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-green-500/50 transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
          <CardTitle className="text-xl font-medium text-gray-300 group-hover:text-green-300 transition-colors">
            User Leaderboards
          </CardTitle>
        </CardHeader>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
      </Card>
      <Leader
        data={stats.leaderboard.user.hours}
        title={"Most Hours Spent"}
        scoreSuffix={"h"}
        scoreIcon={<Clock className="h-3 w-3 text-gray-500" />}
        scoreIconTop={<Clock className="h-4 w-4 text-yellow-400" />}
      ></Leader>
      <Leader
        data={stats.leaderboard.user.projects}
        title={"Most Projects"}
        scoreSuffix={"projects"}
        scoreIcon={<FolderOpen className="h-3 w-3 text-gray-500" />}
        scoreIconTop={<FolderOpen className="h-4 w-4 text-yellow-400" />}
      ></Leader>
      <Leader
        data={stats.leaderboard.user.devlogs}
        title={"Most Devlogs"}
        scoreSuffix={"devlogs"}
        scoreIcon={<CodeSquare className="h-3 w-3 text-gray-500" />}
        scoreIconTop={<CodeSquare className="h-4 w-4 text-yellow-400" />}
      ></Leader>
      <Leader
        data={stats.leaderboard.user.votes}
        title={"Most Votes Cast"}
        scoreSuffix={"votes"}
        scoreIcon={<Vote className="h-3 w-3 text-gray-500" />}
        scoreIconTop={<Vote className="h-4 w-4 text-yellow-400" />}
      ></Leader>
      <Leader
        data={stats.leaderboard.user.badges}
        title={"Badges Collected"}
        scoreSuffix={"badges"}
        scoreIcon={<BadgeCheck className="h-3 w-3 text-gray-500" />}
        scoreIconTop={<BadgeCheck className="h-4 w-4 text-yellow-400" />}
      ></Leader>
      <Leader
        data={stats.leaderboard.user.css}
        title={"Length of Custom CSS"}
        scoreSuffix={"characters"}
        scoreIcon={<Code2 className="h-3 w-3 text-gray-500" />}
        scoreIconTop={<Code2 className="h-4 w-4 text-yellow-400" />}
      ></Leader>
      <Leader
        data={stats.leaderboard.user.bio}
        title={"Length of Bio"}
        scoreSuffix={"characters"}
        scoreIcon={<Text className="h-3 w-3 text-gray-500" />}
        scoreIconTop={<Text className="h-4 w-4 text-yellow-400" />}
      ></Leader>
      <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-green-500/50 transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
          <CardTitle className="text-xl font-medium text-gray-300 group-hover:text-green-300 transition-colors">
            Project Leaderboards
          </CardTitle>
        </CardHeader>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
      </Card>
      <Leader
        data={stats.leaderboard.project.hours}
        title={"Most Hours Spent"}
        scoreSuffix={"h"}
        scoreIcon={<Clock className="h-3 w-3 text-gray-500" />}
        scoreIconTop={<Clock className="h-4 w-4 text-yellow-400" />}
        bgFill={true}
      ></Leader>
      <Leader
        data={stats.leaderboard.project.devlogs}
        title={"Most Devlogs"}
        scoreSuffix={"devlogs"}
        scoreIcon={<CodeSquare className="h-3 w-3 text-gray-500" />}
        scoreIconTop={<CodeSquare className="h-4 w-4 text-yellow-400" />}
        bgFill={true}
      ></Leader>
      <Leader
        data={stats.leaderboard.project.followers}
        title={"Most Followers"}
        scoreSuffix={"followers"}
        scoreIcon={<Users2 className="h-3 w-3 text-gray-500" />}
        scoreIconTop={<Users2 className="h-4 w-4 text-yellow-400" />}
        bgFill={true}
      ></Leader>
      <Leader
        data={stats.leaderboard.project.title}
        title={"Longest Title"}
        scoreSuffix={"characters"}
        scoreIcon={<Text className="h-3 w-3 text-gray-500" />}
        scoreIconTop={<Text className="h-4 w-4 text-yellow-400" />}
        bgFill={true}
      ></Leader>

      <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-800/50">
        <div className="flex items-center justify-center gap-2">
          <p>Last updated: {safeStats.last_synced.toLocaleString()}</p>
          <span> </span>
          <LiveStatus></LiveStatus>
        </div>
      </div>
    </div>
  );
}
