import {
  Calendar,
  MapPin,
  PenBox,
  Verified,
  HeartPulse,
  Thermometer,
  Activity,
} from "lucide-react";
import React from "react";
import moment from "moment";

const UserProfileInfo = ({ user, posts, profileId, setShowEdit, health }) => {
  // ✅ DEMO MODE: always true
  const isConnection = true;

  return (
    <div className="relative py-4 px-6 md:px-8 bg-white">
      {/* Profile Picture */}
      <div className="w-32 h-32 border-4 border-white shadow-lg absolute -top-16 rounded-full">
        <img
          src={user?.profile_picture}
          alt=""
          className="rounded-full w-full h-full object-cover"
        />
      </div>

      <div className="w-full pt-16 md:pt-0 md:pl-36">
        {/* Name */}
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">{user?.full_name}</h1>
              <Verified className="w-5 h-5 text-blue-500" />
            </div>

            <p className="text-gray-500">@{user?.username}</p>

            {/* ✅ HEALTH STATUS */}
            {health && (
              <span
                className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-semibold
                  ${health.status === "Normal" && "bg-green-100 text-green-700"}
                  ${health.status === "Warning" && "bg-yellow-100 text-yellow-700"}
                  ${health.status === "Emergency" && "bg-red-100 text-red-700"}
                `}
              >
                Health Status: {health.status}
              </span>
            )}
          </div>

          {!profileId && (
            <button
              onClick={() => setShowEdit(true)}
              className="flex items-center gap-2 border px-4 py-2 rounded-lg mt-4 md:mt-0"
            >
              <PenBox className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        {/* Bio */}
        <p className="text-gray-700 text-sm max-w-md mt-4">{user?.bio}</p>

        {/* Joined */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
          <Calendar className="w-4 h-4" />
          Joined {moment(user?.createdAt).fromNow()}
        </div>

        {/* ✅ HEALTH SNAPSHOT */}
        {health && (
          <>
            <div className="mt-6 grid grid-cols-3 gap-4 max-w-md">
              <div className="p-3 bg-red-50 rounded-lg text-center">
                <HeartPulse className="mx-auto text-red-500" />
                <p className="text-xs">Heart Rate</p>
                <p className="font-bold">{health.heartRate} BPM</p>
              </div>

              <div className="p-3 bg-orange-50 rounded-lg text-center">
                <Thermometer className="mx-auto text-orange-500" />
                <p className="text-xs">Temperature</p>
                <p className="font-bold">{health.temperature} °C</p>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <Activity className="mx-auto text-blue-500" />
                <p className="text-xs">Motion</p>
                <p className="font-bold">{health.motion}</p>
              </div>
            </div>

            {/* Location */}
            <div className="mt-6 max-w-md">
              <iframe
                src={`https://maps.google.com/maps?q=${health.lat},${health.lng}&z=15&output=embed`}
                className="w-full h-64 rounded"
                title="location"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfileInfo;
