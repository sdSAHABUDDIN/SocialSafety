import React, { useEffect, useState } from "react";
import { assets, dummyPostsData } from "../assets/assets";
import Loding from "../components/Loding";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import RecentMessage from "../components/RecentMessage";

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dummy data load
    setFeeds(dummyPostsData);
    setLoading(false);
  }, []);

  if (loading) return <Loding />;

  // 🔴 Emergency posts
  const emergencyPosts = feeds.filter(
    (post) => post.post_type === "emergency"
  );

  // 🟡 Health posts
  const healthPosts = feeds.filter(
    (post) => post.post_type === "health"
  );

  // 🔵 Normal social posts
  const normalPosts = feeds.filter(
    (post) => post.post_type === "normal"
  );

  return (
    <div className="h-full overflow-y-scroll no-scrollbar py-6 xl:pr-5 flex justify-center xl:gap-8 bg-slate-50">

      {/* MAIN FEED */}
      <div className="w-full max-w-2xl">

        {/* FEED HEADER */}
        <div className="bg-white p-4 rounded-md shadow mb-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Family Safety Feed
          </h2>
          <p className="text-sm text-slate-500">
            Emergency alerts, health updates, and family posts
          </p>
        </div>

        {/* 🚨 EMERGENCY ALERTS */}
        <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-6">
          <h3 className="text-red-600 font-semibold mb-2">
            🚨 Emergency Alerts
          </h3>

          {emergencyPosts.length === 0 ? (
            <p className="text-sm text-red-400">
              No active emergency alerts
            </p>
          ) : (
            emergencyPosts.map((post) => (
              <PostCard key={post._id} post={post} priority />
            ))
          )}
        </div>

        {/* 🩺 FAMILY HEALTH SUMMARY */}
        <div className="bg-white p-4 rounded-md shadow mb-6">
          <h3 className="font-semibold text-slate-700 mb-3">
            🩺 Family Health Overview
          </h3>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-green-50 rounded text-green-700">
              Most members are normal
            </div>
            <div className="p-3 bg-yellow-50 rounded text-yellow-700">
              {healthPosts.length} health update(s)
            </div>
          </div>
        </div>

        {/* STORIES */}
        <StoriesBar />

        {/* 🟨 HEALTH POSTS */}
        {healthPosts.length > 0 && (
          <div className="mt-6 space-y-6">
            <h3 className="text-sm font-semibold text-slate-600">
              Health Updates
            </h3>
            {healthPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* 🟦 NORMAL POSTS */}
        <div className="mt-6 space-y-6">
          <h3 className="text-sm font-semibold text-slate-600">
            Family Posts
          </h3>
          {normalPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="max-xl:hidden sticky top-0">
        <div className="max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow mb-4">
          <h3 className="text-slate-800 font-semibold">Sponsored</h3>
          <img
            src={assets.sponsored_img}
            className="w-75 h-50 rounded-md"
            alt=""
          />
          <p className="text-slate-600">Email marketing</p>
          <p className="text-slate-400">
            Supercharge your marketing with a powerful platform.
          </p>
        </div>

        <RecentMessage />
      </div>
    </div>
  );
};

export default Feed;
