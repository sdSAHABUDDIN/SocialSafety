import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyPostsData, dummyUserData } from "../assets/assets";
import Loding from "../components/Loding";
import UserProfileInfo from "../components/UserProfileInfo";
import PostCard from "../components/PostCard";
import moment from "moment";
import ProfileModal from "../components/ProfileModal";

// ✅ DEMO HEALTH DATA
const demoHealthData = {
  heartRate: 72,
  temperature: 36.7,
  motion: "Normal",
  status: "Normal",
  deviceConnected: true,
  lat: 22.5726,
  lng: 88.3639,
  lastSync: "2 min ago",
};

const Profile = () => {
  const { profileId } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);
  const [health, setHealth] = useState(null);

  // ✅ DEMO USER + DEMO HEALTH
  const fetchUser = () => {
    setUser(dummyUserData);
    setPosts(dummyPostsData);
    setHealth(demoHealthData); // 👈 IMPORTANT
  };

  useEffect(() => {
    fetchUser();
  }, [profileId]);

  if (!user) return <Loding />;

  return (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <UserProfileInfo
            user={user}
            posts={posts}
            profileId={profileId}
            setShowEdit={setShowEdit}
            health={health}
          />
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow p-1 flex max-w-md mx-auto">
            {["posts", "media", "likes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Posts */}
          {activeTab === "posts" && (
            <div className="mt-6 flex flex-col items-center gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {/* Media */}
          {activeTab === "media" && (
            <div className="flex flex-wrap mt-6 max-w-6xl">
              {posts
                .filter((post) => post.image_urls.length > 0)
                .map((post) =>
                  post.image_urls.map((image, index) => (
                    <Link key={index} target="_blank" to={image}>
                      <img
                        src={image}
                        className="w-64 aspect-video object-cover"
                        alt=""
                      />
                      <p className="text-xs text-gray-500">
                        Posted {moment(post.createdAt).fromNow()}
                      </p>
                    </Link>
                  ))
                )}
            </div>
          )}
        </div>
      </div>

      {showEdit && <ProfileModal setShowEdit={setShowEdit} />}
    </div>
  );
};

export default Profile;
