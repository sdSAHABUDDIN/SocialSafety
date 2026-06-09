import React from "react";
import { dummyConnectionsData } from "../assets/assets";
import { Eye, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();
  const getHealthStatus = () => {
    const statuses = ["Normal", "Warning", "Emergency"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const healthColor = {
    Normal: "bg-green-100 text-green-700",
    Warning: "bg-yellow-100 text-yellow-700",
    Emergency: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen relative bg-slage-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Messages</h1>
          <p className="text-slate-600">Talk to your friends and family</p>
        </div>
        <button
          onClick={() => alert("🚨 Emergency alert sent to all connections")}
          className="mb-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          🚨 Send Emergency Alert to Family
        </button>

        <div className="flex flex-col gap-3">
          {/* Connections List */}
          {dummyConnectionsData.map((user) => {
            const health = getHealthStatus();

            return (
              <div
                key={user._id}
                className="flex max-w-xl gap-5 p-6 bg-white shadow rounded-md"
              >
                <img
                  src={user.profile_picture}
                  alt=""
                  className="rounded-full size-12"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-700">
                        {user.full_name}
                      </p>
                      <p className="text-slate-500">@{user.username}</p>
                    </div>

                    {/* 🔥 HEALTH BADGE */}
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${healthColor[health]}`}
                    >
                      {health}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">{user.bio}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate(`/messages/${user._id}`)}
                    className="size-10 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigate(`/profile/${user._id}`)}
                    className="size-10 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Messages;
