import React, { useState, useEffect, useRef } from "react";
import {
  FaPaperclip,
  FaEllipsisV,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "./ArtistChat.css";
import ArtistSidebar from "./sidebar/ArtistSidebar";
import ArtistHeader from "./header/ArtistHeader";

const ArtistChat = () => {
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isCustomerTyping, setIsCustomerTyping] = useState(false);
  const [activeChatMenu, setActiveChatMenu] = useState(null);
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const location = useLocation();

  const chatMenuRef = useRef(null);
  const messageMenuRef = useRef(null);

  // Load chats and messages from localStorage on component mount
  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem("chats")) || [];
    const savedMessages = JSON.parse(localStorage.getItem("messages")) || {};

    if (savedChats.length > 0) {
      setChats(savedChats);
    }

    if (Object.keys(savedMessages).length > 0) {
      setMessages(savedMessages);
    }
  }, []);

  // Sync chats and messages with localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  // Handle new client conversation through location state
  useEffect(() => {
    if (location.state && location.state.client) {
      const client = location.state.client;

      setChats((prevChats) => {
        const isAlreadyInChats = prevChats.some((chat) => chat.id === client.id);
        if (!isAlreadyInChats) {
          const updatedChats = [...prevChats, { ...client, status: "Online" }];
          localStorage.setItem("chats", JSON.stringify(updatedChats));
          return updatedChats;
        }
        return prevChats;
      });

      setMessages((prevMessages) => {
        if (!prevMessages[client.id]) {
          const updatedMessages = { ...prevMessages, [client.id]: [] };
          localStorage.setItem("messages", JSON.stringify(updatedMessages));
          return updatedMessages;
        }
        return prevMessages;
      });

      setCurrentChat(client.id);
    }
  }, [location.state]);

  // Close chat and message menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeChatMenu &&
        chatMenuRef.current &&
        !chatMenuRef.current.contains(event.target)
      ) {
        setActiveChatMenu(null);
      }
      if (
        deleteConfirm &&
        messageMenuRef.current &&
        !messageMenuRef.current.contains(event.target)
      ) {
        setDeleteConfirm(false);
        setActiveMessageId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeChatMenu, deleteConfirm]);

  // Chat actions
  const deleteChat = (chatId) => {
    setChats((prevChats) => {
      const updatedChats = prevChats.filter((chat) => chat.id !== chatId);
      localStorage.setItem("chats", JSON.stringify(updatedChats));
      return updatedChats;
    });

    setMessages((prevMessages) => {
      const updatedMessages = { ...prevMessages };
      delete updatedMessages[chatId];
      localStorage.setItem("messages", JSON.stringify(updatedMessages));
      return updatedMessages;
    });

    setActiveChatMenu(null);
    if (currentChat === chatId) setCurrentChat(null);
  };

  const deleteMessage = (chatId, messageId) => {
    setMessages((prevMessages) => {
      const updatedMessages = {
        ...prevMessages,
        [chatId]: prevMessages[chatId].filter((msg) => msg.id !== messageId),
      };
      localStorage.setItem("messages", JSON.stringify(updatedMessages));
      return updatedMessages;
    });
    setDeleteConfirm(false);
    setActiveMessageId(null);
  };

  const handleNewConversation = (chatId) => {
    setCurrentChat(chatId);
    setActiveChatMenu(null);
  };

  const toggleChatMenu = (chatId) => {
    setActiveChatMenu(activeChatMenu === chatId ? null : chatId);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && currentChat) {
      const newMessageData = {
        id: Date.now().toString(), // Unique ID for each message
        sender: "Artist",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString(),
        read: true,
      };

      setMessages((prevMessages) => {
        const updatedMessages = {
          ...prevMessages,
          [currentChat]: [...(prevMessages[currentChat] || []), newMessageData],
        };
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
      setNewMessage("");
      scrollToBottom();
    }
  };

  // Handle file attachment
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && currentChat) {
      const fileURL = URL.createObjectURL(file);
      const newFileMessage = {
        id: Date.now().toString(),
        sender: "Artist",
        message: "",
        timestamp: new Date().toLocaleTimeString(),
        read: true,
        file: { name: file.name, url: fileURL, type: file.type },
      };

      setMessages((prevMessages) => {
        const updatedMessages = {
          ...prevMessages,
          [currentChat]: [...(prevMessages[currentChat] || []), newFileMessage],
        };
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTypingIndicator = (e) => {
    setNewMessage(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const markChatAsImportant = (chatId) => {
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, important: !chat.important } : chat
      );
      localStorage.setItem("chats", JSON.stringify(updatedChats));
      return updatedChats;
    });
    setActiveChatMenu(null);
  };

  const handleMediaClick = (file) => {
    setSelectedMedia(file);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      if (currentChat) {
        setIsCustomerTyping(true);
        setTimeout(() => setIsCustomerTyping(false), 3000);
      }
    }, 5000);
    return () => clearTimeout(typingTimeout);
  }, [currentChat]);

  const confirmDeleteMessage = (messageId) => {
    setActiveMessageId(messageId);
    setDeleteConfirm(true);
  };

  return (
    <div className="artist-dashboard">
      {/* Sidebar */}
      <ArtistSidebar />

      {/* Main Dashboard Content */}
      <div className="artist-main-dashboard">
        {/* Top Bar */}
        <ArtistHeader />

        {/* Chats and Chat Box */}
        <div className="artist-chat-container">
          <div className="artist-chat-chats">
            <div className="chats-headerr">
              <h4>Chats</h4>
            </div>
            <ul>
              {chats.map((chat) => (
                <li
                  key={chat.id}
                  className="chat-item"
                  onClick={() => handleNewConversation(chat.id)}
                >
                  <div className="chat-info">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="chat-avatar"
                    />
                    <div className="chat-name-status">
                      <span className="chat-name">{chat.name}</span>
                      {chat.status === "Online" ? (
                        <span className="online-dot"></span>
                      ) : (
                        <span className="offline-dot"></span>
                      )}
                    </div>
                  </div>
                  <FaEllipsisV
                    className="chat-edit-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChatMenu(chat.id);
                    }}
                  />

                  {activeChatMenu === chat.id && (
                    <div ref={chatMenuRef} className="chat-action-menu">
                      <p onClick={() => deleteChat(chat.id)}>Delete Chat</p>
                      <p onClick={() => markChatAsImportant(chat.id)}>
                        {chat.important ? "Unmark Important" : "Mark as Important"}
                      </p>
                      <p onClick={() => setActiveChatMenu(null)}>Cancel</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Chat Box */}
          <div className={`chats-box ${deleteConfirm ? "no-scroll" : ""}`}>
            {currentChat ? (
              <>
                <div className="chat-header">
                  <div className="chat-header-content">
                    <h4>{chats.find((c) => c.id === currentChat)?.name}</h4>
                    <span className="online-status">
                      {chats.find((c) => c.id === currentChat)?.status ===
                      "Online"
                        ? "Online"
                        : "Offline"}
                    </span>
                  </div>
                </div>
                <div className={`chats-messages ${deleteConfirm ? 'no-scroll' : ''}`}>
                  {messages[currentChat]?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chats-message ${
                        msg.sender === "Artist"
                          ? "chats-sent"
                          : "chats-received"
                      }`}
                    >
                      <div
                        className={`chats-message-content ${
                          msg.important ? "important" : ""
                        }`}
                      >
                        {msg.file && msg.file.type ? (
                          msg.file.type.startsWith("image") ? (
                            <img
                              src={msg.file.url}
                              alt={msg.file.name}
                              className="attached-image"
                              onClick={() => handleMediaClick(msg.file)}
                            />
                          ) : msg.file.type.startsWith("video") ? (
                            <video
                              controls
                              className="attached-video"
                              onClick={() => handleMediaClick(msg.file)}
                            >
                              <source src={msg.file.url} type={msg.file.type} />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <a
                              href={msg.file.url}
                              download={msg.file.name}
                              className="attached-document"
                            >
                              {msg.file.name}
                            </a>
                          )
                        ) : (
                          <p>{msg.message}</p>
                        )}
                        <small>{msg.timestamp}</small>&nbsp;
                        {msg.read && <FaCheck className="read-receipt-icon" />}

                        {/* Edit icon for each message */}
                        <FaEllipsisV
                          className="message-edit-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteMessage(msg.id);
                          }}
                        />

                        {/* Message action menu */}
                        {deleteConfirm && activeMessageId === msg.id && (
                          <div
                            ref={messageMenuRef}
                            className="message-action-menu"
                          >
                            <p onClick={() => deleteMessage(currentChat, msg.id)}>
                              Delete Message
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isCustomerTyping && (
                    <div className="typing-indicator">typing...</div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </>
            ) : (
              <p className="select-chat-placeholder">
                Select a chat to start messaging
              </p>
            )}

            {currentChat && (
              <div className="chats-message-input">
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <FaPaperclip
                  className="add-attachment-icon"
                  size={30}
                  onClick={() => fileInputRef.current.click()}
                />
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={handleTypingIndicator}
                  onKeyPress={handleKeyPress}
                />
                <button onClick={handleSendMessage} className="send-message-btn">
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-view modal for media */}
      {selectedMedia && (
        <div className="media-modal" onClick={closeModal}>
          <div className="media-modal-content" onClick={(e) => e.stopPropagation()}>
            <FaTimes className="close-modal-icon" onClick={closeModal} />
            {selectedMedia.type.startsWith("image") ? (
              <img src={selectedMedia.url} alt={selectedMedia.name} className="modal-image" />
            ) : selectedMedia.type.startsWith("video") ? (
              <video controls className="modal-video">
                <source src={selectedMedia.url} type={selectedMedia.type} />
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistChat;
