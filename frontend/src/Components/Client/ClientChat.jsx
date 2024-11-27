import React, { useState, useEffect, useRef } from "react";
import {
  FaPaperclip,
  FaEllipsisV,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "./ClientChat.css";
import ClientSidebar from "./sidebar/ClientSidebar";
import ClientHeader from "./header/ClientHeader";

const ClientChat = () => {
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem("clientChats")) || [];
    const savedMessages = JSON.parse(localStorage.getItem("clientMessages")) || {};
    setChats(savedChats);
    setMessages(savedMessages);
  }, []);

  useEffect(() => {
    localStorage.setItem("clientChats", JSON.stringify(chats));
    localStorage.setItem("clientMessages", JSON.stringify(messages));
  }, [chats, messages]);

  useEffect(() => {
    if (location.state && location.state.artist) {
      const artist = location.state.artist;
      const isAlreadyInChats = chats.some((chat) => chat.id === artist.id);

      if (!isAlreadyInChats) {
        setChats([...chats, { ...artist, status: "Online" }]);
      }

      if (!messages[artist.id]) {
        setMessages({ ...messages, [artist.id]: [] });
      }

      setCurrentChat(artist.id);
    }
  }, [location.state]);

  const handleSendMessage = () => {
    if (newMessage.trim() && currentChat) {
      const newMessageData = {
        id: Date.now().toString(),
        sender: "Client",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prevMessages) => ({
        ...prevMessages,
        [currentChat]: [...(prevMessages[currentChat] || []), newMessageData],
      }));

      setNewMessage("");
      scrollToBottom();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && currentChat) {
      const fileURL = URL.createObjectURL(file);
      const newFileMessage = {
        id: Date.now().toString(),
        sender: "Client",
        file: { name: file.name, url: fileURL, type: file.type },
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prevMessages) => ({
        ...prevMessages,
        [currentChat]: [...(prevMessages[currentChat] || []), newFileMessage],
      }));
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="client-chat-dashboard">
      <ClientSidebar />
      <div className="client-main-dashboard">
        <ClientHeader />
        <div className="client-chat-container">
          <div className="client-chat-list">
            <h4>Chats</h4>
            <ul>
              {chats.map((chat) => (
                <li
                  key={chat.id}
                  onClick={() => setCurrentChat(chat.id)}
                  className={`client-chat-item ${
                    currentChat === chat.id ? "client-active-chat" : ""
                  }`}
                >
                  <div className="client-chat-info">
                    <img src={chat.avatar} alt={chat.name} className="client-chat-avatar" />
                    <span>{chat.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="client-chat-box">
            {currentChat ? (
              <>
                <div className="client-chat-messages">
                  {messages[currentChat]?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`client-chat-message ${
                        msg.sender === "Client" ? "client-message-sent" : "client-message-received"
                      }`}
                    >
                      {msg.file ? (
                        <a href={msg.file.url} download={msg.file.name}>
                          {msg.file.name}
                        </a>
                      ) : (
                        <p>{msg.message}</p>
                      )}
                      <small>{msg.timestamp}</small>
                    </div>
                  ))}
                  <div ref={messagesEndRef}></div>
                </div>
                <div className="client-chat-input">
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <FaPaperclip onClick={() => fileInputRef.current.click()} />
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                  />
                  <button onClick={handleSendMessage}>Send</button>
                </div>
              </>
            ) : (
              <p>Select a chat to start messaging</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientChat;
