import React, { useState, useEffect, useRef } from "react";
import { FaEllipsisV, FaCheck } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { db } from "../../firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./ArtistChat.css";
import ArtistSidebar from "./sidebar/ArtistSidebar";
import ArtistHeader from "./header/ArtistHeader";

const ArtistChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isCustomerTyping, setIsCustomerTyping] = useState(false);
  const [activeChatMenu, setActiveChatMenu] = useState(null);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(null);
  const messagesEndRef = useRef(null);
  const chatMenuRef = useRef(null);
  const auth = getAuth();

  const location = useLocation();

  useEffect(() => {
    const fetchChats = async () => {
      const artistId = auth.currentUser?.uid; // Get current artist ID
      const chatsCollection = collection(db, "chats");

      if (!artistId) {
        console.error("Artist ID not found");
        return;
      }

      const unsubscribe = onSnapshot(chatsCollection, (snapshot) => {
        const fetchedChats = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (chat) =>
              chat.artist?.id === artistId && chat.deletedByArtist === false
          ); // Match artist ID and ensure chat is not deleted by the artist

        setChats(fetchedChats);
      });

      return unsubscribe;
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (!currentChat) {
      setMessages([]);
      return;
    }

    const chatDocRef = doc(db, "chats", currentChat);

    const unsubscribe = onSnapshot(chatDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const chatData = docSnapshot.data();
        setMessages(chatData.artistMessages || []);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [currentChat]);

  useEffect(() => {
    if (!location.state?.client) return;

    const initChatWithClient = async () => {
      const client = location.state.client;
      const artistId = auth.currentUser?.uid;
      const chatId = `${client.id}_${artistId}`;

      try {
        // Prevent overwriting if currentChat is already set
        if (currentChat && currentChat !== chatId) {
          console.log("currentChat already set:", currentChat);
          return;
        }

        // Check if the chat already exists in the current state
        if (chats.some((chat) => chat.id === chatId)) {
          setCurrentChat(chatId);
          return;
        }

        
      } catch (error) {
        console.error("Error initializing chat with client:", error);
      }
    };

    initChatWithClient();
  }, [location.state, chats, currentChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentChat) return;

    const newMessageData = {
      id: Date.now().toString(),
      sender: "Artist",
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };

    const chatDoc = doc(db, "chats", currentChat);

    try {
      await updateDoc(chatDoc, {
        artistMessages: arrayUnion(newMessageData),
        clientMessages: arrayUnion(newMessageData),
        deletedByClient: false,
      });

      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewConversation = (chatId) => {
    setCurrentChat(chatId);
  };

  const toggleChatMenu = (chatId) => {
    setActiveChatMenu(activeChatMenu === chatId ? null : chatId);
  };

  const deleteChat = async (chatId) => {
    try {
      setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
      setCurrentChat(null);

      const chatDoc = doc(db, "chats", chatId);
      await updateDoc(chatDoc, {
        artistMessages: [],
        deletedByArtist: true,
      });
      setCurrentChat(null);

      console.log(`${currentChat}`);
      console.log(`Chat with ID ${chatId} successfully deleted.`);
    } catch (error) {
      console.error(`Error deleting chat with ID ${chatId}:`, error);
    }
  };

  const showProfilePicture = (avatar) => {
    setSelectedProfilePicture(avatar);
  };

  const closeProfilePopup = () => {
    setSelectedProfilePicture(null);
  };

  return (
    <div className="artist-dashboard">
      <ArtistSidebar />

      <div className="artist-main-dashboard">
        <ArtistHeader />

        <div className="artist-chat-container">
          <div className="artist-chat-chats">
            <div className="chats-header">
              <h4>Chats</h4>
            </div>
            <br />
            <ul className="chat-list">
              {chats.map((chat) => (
                <li
                  key={chat.id}
                  className={`chat-item ${
                    currentChat === chat.id ? "active-chat" : ""
                  }`}
                  onClick={() => handleNewConversation(chat.id)}
                >
                  <div className="chat-info">
                    <img
                      src={chat.client?.avatar || "default-avatar.png"}
                      alt={chat.client?.name || "Client"}
                      className="chat-avatar"
                    />
                    <div className="chat-name-status">
                      <span className="chat-name">
                        {chat.client?.name || "Client"}
                      </span>
                      <span
                        className={`status-dot ${
                          chat.status === "Online"
                            ? "online-dot"
                            : "offline-dot"
                        }`}
                      ></span>
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
                      <p onClick={() => setActiveChatMenu(null)}>Cancel</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="chats-box">
            {currentChat ? (
              <>
                <div className="chat-header">
                  <div className="chat-header-content">
                    <img
                      src={
                        chats.find((c) => c.id === currentChat)?.client
                          ?.avatar || "default-avatar.png"
                      }
                      alt={
                        chats.find((c) => c.id === currentChat)?.client?.name ||
                        "Client"
                      }
                      className="header-avatar"
                    />
                    <div className="header-text">
                      <h4>
                        {chats.find((c) => c.id === currentChat)?.client
                          ?.name || "Client"}
                      </h4>
                      <span className="online-status">
                        {chats.find((c) => c.id === currentChat)?.status ===
                        "Online"
                          ? "Online"
                          : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="chats-messages">
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`chats-message ${
                          msg.sender === "Artist"
                            ? "chats-sent"
                            : "chats-received"
                        }`}
                      >
                        <div className="chats-message-content">
                          <p>{msg.message}</p>
                          <small>{msg.timestamp}</small>&nbsp;
                          {msg.read && (
                            <FaCheck className="read-receipt-icon" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-messages-placeholder">No messages yet</p>
                  )}
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
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  onClick={handleSendMessage}
                  className="send-message-btn"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedProfilePicture && (
        <div className="profile-popups" onClick={closeProfilePopup}>
          <div className="popups-content">
            <img
              src={selectedProfilePicture}
              alt="Profile"
              className="popups-avatar"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistChat; 