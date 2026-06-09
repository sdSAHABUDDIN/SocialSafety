import React from "react";
import {
  dummyConnectionsData as connections,
  dummyFollowersData as followers,
  dummyFollowingData as following,
  dummyPendingConnectionsData as pendingConnections,
} from "../assets/assets";
import { data, useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserPlus,
  UserRoundPen,
  MessageSquare,
} from "lucide-react";
const Connetions = () => {
  const navigate = useNavigate();

  const dataArray = [
    { label: "Followers", value: followers, icon: Users },
    { label: "Following", value: following, icon: UserCheck },
    {
      label: "Pending Connections",
      value: pendingConnections,
      icon: UserRoundPen,
    },
    { label: "Connections", value: connections, icon: UserPlus },
  ];

  const dummyHealthMap = {
    Normal: {
      color: "bg-green-100 text-green-700",
      label: "Normal",
    },
    Warning: {
      color: "bg-yellow-100 text-yellow-700",
      label: "Warning",
    },
    Emergency: {
      color: "bg-red-100 text-red-700",
      label: "Emergency",
    },
  };
  // helper to simulate health
  const getRandomHealth = () => {
    const states = ["Normal", "Warning", "Emergency"];
    return {
      status: states[Math.floor(Math.random() * states.length)],
      heartRate: Math.floor(60 + Math.random() * 60),
      temperature: (36 + Math.random() * 2).toFixed(1),
    };
  };

  const [currentTab, setCurrentTab] = React.useState("Connections");
  const isConnectionTab = currentTab === "Connections";
  const health = isConnectionTab ? getRandomHealth() : null;

  const activeTab = dataArray.find((item) => item.label === currentTab);
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Connections
          </h1>
          <p className="text-slate-600">Manage your connections</p>
        </div>
        {/* Connections Lists */}
        <div className="mb-8 flex flex-wrap gap-6">
          {dataArray.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-200 bg-white shadow rounded-md "
            >
              <b>{item.value.length}</b>
              <p className="text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>

        {/*tabs*/}
        <div className="inline-flex flex-wrap items-center border border-gray-200 rounded-md p-1 bg-white shadow-sm">
          {dataArray.map((tab) => (
            <button
              key={tab.label}
              className={`flex items-center px-3 py-1 text-sm rounded-md cursor-pointer transition-colors ${
                currentTab === tab.label
                  ? "bg-white font-medium text-black"
                  : "text-gray-500 hover:text"
              }`}
              onClick={() => setCurrentTab(tab.label)}
            >
              <tab.icon className="w-4 h-4 mr-1" />
              <span>{tab.label} </span>
              {tab.count !== undefined && (
                <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
        {/* Connections List */}
        <div className="flex flex-wrap gap-6 mt-6">
          {activeTab?.value?.map((user) => {
  const isConnectionTab = currentTab === "Connections";
  const health = isConnectionTab ? getRandomHealth() : null;
  const badge = health ? dummyHealthMap[health.status] : null;

  return (
    <div
      key={user._id}
      className="w-full max-w-md flex gap-5 p-6 bg-white shadow rounded-md"
    >
      <img
        src={user.profile_picture}
        alt=""
        className="rounded-full size-12 shadow-md"
      />

      <div className="flex-1">
        {/* Name */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-700">{user.full_name}</p>
            <p className="text-slate-500 text-sm">@{user.username}</p>
          </div>

          {/* 🔥 HEALTH BADGE – ONLY FOR CONNECTIONS */}
          {isConnectionTab && (
            <span
              className={`px-3 py-1 text-xs rounded-full font-semibold ${badge.color}`}
            >
              {badge.label}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mt-1">
          {user.bio.slice(0, 40)}...
        </p>

        {/* 🔥 HEALTH SNAPSHOT – ONLY FOR CONNECTIONS */}
        {isConnectionTab && (
          <div className="flex gap-4 mt-3 text-sm">
            <span>❤️ {health.heartRate} BPM</span>
            <span>🌡️ {health.temperature} °C</span>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex max-sm:flex-col gap-2 mt-4">
          <button
            onClick={() => navigate(`/profile/${user._id}`)}
            className="w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
          >
            View Profile
          </button>

          <button
            onClick={() => navigate(`/messages/${user._id}`)}
            className="w-full p-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
          >
            Message
          </button>

          {/* 🔥 EMERGENCY BUTTON – ONLY FOR CONNECTIONS & ONLY IF EMERGENCY */}
          {isConnectionTab && health.status === "Emergency" && (
            <button className="w-full p-2 text-sm rounded bg-red-600 text-white hover:bg-red-700">
              🚨 Emergency
            </button>
          )}
        </div>
      </div>
    </div>
  );
})}

        </div>
      </div>
    </div>
  );
};

export default Connetions;
