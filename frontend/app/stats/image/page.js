"use client";
import {
  Users,
  FolderOpen,
  Clock,
  Users2,
  FolderCheck,
} from "lucide-react";
import { stats } from "@/data/stats";
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

export default function StatImage() {
  const safeStats = {
    total_projects: stats?.total_projects || 0,
    certified: stats?.certified || 0,
    certified_10: stats?.certified_10 || 0,
    total_projects: stats?.total_projects || 0,
    total_users: stats?.total_users || 0,
    joined_users: stats?.joined_users || 0,
    total_minutes: stats?.total_minutes || 0,
    project_chart: stats?.project_chart || {},
    user_chart: stats?.user_chart || {},
    participants_chart: stats?.participants_chart || {},
    minutes_chart: stats?.minutes_chart || {},
    top10_users: stats?.top10_users || [],
    top10Hours: stats?.top10Hours || [],
    last_synced: new Date(stats.last_sync) || new Date(),
  };
  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6 min-h-screen">
      <div className="grid grid-cols-2 gap-4 mb-8">
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

        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-yellow-300 transition-colors">
              Total Projects
            </CardTitle>
            <div className="p-2 rounded-lg bg-yellow-500/20 group-hover:bg-yellow-500/30 transition-colors">
              <FolderOpen className="h-4 w-4 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {safeStats.total_projects.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Amazing projects created</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
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
      </div>
    </div>
  );
}
