import React, { useState } from "react";
import { dummyUserData } from "../assets/assets";
import { Pencil } from "lucide-react";

const ProfileModal = ({setShowEdit}) => {
  const user = dummyUserData;
  const [editFrom, setEditFrom] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    profile_picture: null,
    cover_photo: null,
    full_name: user.full_name,
  });
  const handleSaveProfile = async (e) => {
    e.preventDefault();
  };
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-110 h-screen overflow-y-scroll bg-black/50">
      <div className="max-w-2xl sm:py-6 mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Edit Profile
          </h1>
          <form className="space-y-4" onSubmit={handleSaveProfile}>
            <div className="flex flex-col items-start gap-3">
              <label
                htmlFor="profile_picture"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Profile Picture
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  id="profile_picture"
                  onChange={(e) =>
                    setEditFrom({
                      ...editFrom,
                      profile_picture: e.target.files[0],
                    })
                  }
                />
                <div className="relative w-24 h-24 mt-2 group">
                  <img
                    src={
                      editFrom.profile_picture
                        ? URL.createObjectURL(editFrom.profile_picture)
                        : user.profile_picture
                    }
                    alt=""
                    className="w-24 h-24 rounded-full object-cover"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 hidden group-hover:flex bg-black/30 rounded-full items-center justify-center">
                    <Pencil className="w-5 h-5 text-white" />
                  </div>
                </div>
              </label>
            </div>
            <div className="flex flex-col items-start gap-3">
              <label htmlFor="cover_photo" className="block text-sm font-medium text-gray-700 mb-1">
                Cover Photo
                <input hidden type="file" accept="image/*" id="cover_photo" onChange={(e)=>setEditFrom({...editFrom,cover_photo:e.target.files[0]})} />
                <div className="relative   mt-2 group">
                  <img src={editFrom.cover_photo ? URL.createObjectURL(editFrom.cover_photo):user.cover_photo} alt="" className="w-80 h-40 rounded-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 object-cover mt-2"/>
                  <div className="absolute inset-0 hidden group-hover:flex bg-black/30 rounded-full items-center justify-center">
                    <Pencil className="w-5 h-5 text-white"/>
                  </div>
                </div>
              </label>

            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                full name
            </label>
            <input type="text" className="w-full p-3 border-gray-200 rounded-lg" placeholder="Please enter your full name" onChange={(e)=>setEditFrom({...editFrom, full_name:e.target.value})}value={editFrom.full_name}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
            </label>
            <input type="text" className="w-full p-3 border-gray-200 rounded-lg" placeholder="Please enter your user name" onChange={(e)=>setEditFrom({...editFrom, username:e.target.value})}value={editFrom.username}/>
          </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
               Bio
            </label>
            <textarea rows={3} type="text" className="w-full p-3 border-gray-200 rounded-lg" placeholder="Please enter a short bio" onChange={(e)=>setEditFrom({...editFrom, Bio:e.target.value})}value={editFrom.bio}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
               Location
            </label>
             <input type="text" className="w-full p-3 border-gray-200 rounded-lg" placeholder="Please enter your user name" onChange={(e)=>setEditFrom({...editFrom, location:e.target.value})}value={editFrom.location}/>
          </div>
          <div className="flex justify-end space-x-3 pt-6">
            <button onClick={()=>setShowEdit(false)} type='button'className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                    Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition cursor-pointer">
                    Save Chages
            </button>
          </div>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
