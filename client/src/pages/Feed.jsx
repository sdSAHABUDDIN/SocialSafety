
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { dummyPostsData } from '../assets/assets';
import Loding from '../components/Loding';
import StoriesBar from '../components/StoriesBar';

const Feed = () => {
  const [feeds,setfeeds]=useState([]);
  const [loading,setLoading]=useState(true);
  const fetchFeeds=async()=>{
    setfeeds(dummyPostsData);
    setLoading(false);
  }
  useEffect(()=>{
    fetchFeeds();
  },[])

  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
      {/*Stories and post list */}
      <div>
        <StoriesBar />
        
        <div className='p-4 space-y-6'>
          List of post
        </div>
     </div>
      {/* Right Sidebar */}
     <div>
      <div>
        <h1>Sponsored</h1>
      </div>
      <h1>Recent messages</h1>
     </div>
    </div>
  ) : <Loding/>;
}

export default Feed