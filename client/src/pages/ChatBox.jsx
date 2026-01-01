import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyMessagesData, dummyUserData } from "../assets/assets";
import { Image, Send } from "lucide-react";

const ChatBox = () => {
  const { userId } = useParams();

  const [messages, setMessages] = useState(dummyMessagesData);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);

  const messagesEndRef = useRef(null);

  // Load user based on route param
  useEffect(() => {
    if (dummyUserData._id === userId) {
      setUser(dummyUserData);
    }
  }, [userId]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text && !image) return;

    const newMessage = {
      _id: Date.now(),
      sender: "me",
      text,
      image,
      createdAt: new Date(),
    };

    setMessages([...messages, newMessage]);
    setText("");
    setImage(null);
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen">

      {/* HEADER */}
      <div className="flex items-center gap-3 p-3 border-b bg-white">
        <img
          src={user.profile_picture}
          alt=""
          className="size-9 rounded-full"
        />
        <div>
          <p className="font-medium">{user.full_name}</p>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="p-5 md:px-10 h-full overflow-y-scroll">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.toSorted((a,b)=>new Date(a.createdAt)- new Date(b.createdAt)).map((msg,index) => (
          <div
            key={index}
            className={`flex flex-col  ${
              msg.to_user_id !==user._id ? 'items-start':'items-end'
            }`}
          >
            <div className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${msg.to_user_id !== user._id ? 'rounded-bl-none':'rounded-br-none'}`}>
              {msg.message_type==='image' && <img src={msg.media_url} className="w-full max-w-sm rounded-lg mb-1" alt=""/>}
              <p>{msg.text}</p>
            </div>
            
          </div>
        ))}
        </div>
        
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 flex items-center gap-2 border-t bg-white">
        <label htmlFor="chat-image" className="cursor-pointer">
          <Image className="size-6 text-gray-500" />
        </label>
        <input
          id="chat-image"
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
        />

        <button onClick={sendMessage}>
          <Send className="size-5 text-indigo-600" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
