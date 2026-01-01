import React,{useState} from 'react'
import { dummyConnectionsData } from "../assets/assets";
import { Search, User } from "lucide-react";
import UserCard from '../components/UserCard';
import Loding from '../components/Loding';
const Discover = () => {
  const [input, setInput] = useState("");
    const [users, setUsers] = useState(dummyConnectionsData);
    const [loading, setLoading] = useState(false);
  
    const handleSearch = async (e) => {
      if (e.key === "Enter") {
        setUsers([]);
        setLoading(true);
        setTimeout(() => {
          setUsers(dummyConnectionsData);
          setLoading(false);
        }, 2000);
      }
    };
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Discover</h1>
              <p className="text-slate-600">
                Connect with amazing people and grow your network
              </p>
            </div>
            {/* Search Bar */}
            <div className="mb-8 shadow-md rounded-md border-slate-200 border border-slate-200/60 bg-white/80">
              <div className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5"/>
                  <input type="text" placeholder="Search users..." value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={handleSearch} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                  
                </div>
              </div>
            </div>

            <div>
              {/* Users List */}
              {users.map((user, index) => (
                <UserCard key={index} user={user} />  
              )
              )}
            </div>
            {
              loading && (<Loding height='60vh'/>)
            }
          </div>
        </div>
  )
}

export default Discover