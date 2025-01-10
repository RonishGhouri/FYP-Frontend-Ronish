import React, { useState, useEffect, useRef } from "react";
import { FaEllipsisV, FaCheck } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { db } from "../firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./ClientChat.css";
import ClientSidebar from "./sidebar/ClientSidebar";
import ClientHeader from "./header/ClientHeader";

const ClientChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isArtistTyping, setIsArtistTyping] = useState(false);
  const [activeChatMenu, setActiveChatMenu] = useState(null);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(null);
  const messagesEndRef = useRef(null);
  const [lockedChatId, setLockedChatId] = useState(null); // Lock for current chat
  const location = useLocation();
  const chatMenuRef = useRef(null);
  const auth = getAuth();

  const manageClientOnlineStatus = () => {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const clientId = user.uid;
        const clientDocRef = doc(db, "chats", clientId);

        try {
          // Set `clientOnline` to true when the user is authenticated
          await updateDoc(clientDocRef, {
            clientOnline: true,
          });

          // Set `clientOnline` to false when the user disconnects
          const onDisconnectRef = doc(db, "artists", clientId);
          window.addEventListener("beforeunload", async () => {
            await updateDoc(onDisconnectRef, { clientOnline: false });
          });
        } catch (error) {
          console.error("Error updating client online status:", error);
        }
      } else {
        console.log("User not authenticated.");
      }
    });
  };

  useEffect(() => {
    manageClientOnlineStatus();
  }, []);
  // Fetch chats from Firestore
  // Fetch chats from Firestore
  useEffect(() => {
    const fetchChats = async () => {
      const clientId = auth.currentUser?.uid; // Get current client ID
      const chatsCollection = collection(db, "chats");

      if (!clientId) {
        console.error("Client ID not found");
        return;
      }

      const unsubscribe = onSnapshot(chatsCollection, (snapshot) => {
        const fetchedChats = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (chat) =>
              chat.client?.id === clientId && chat.deletedByClient === false
          );

        setChats(fetchedChats);
      });

      return unsubscribe;
    };

    fetchChats();
  }, []);

  // Fetch messages for the current chat
  useEffect(() => {
    if (!currentChat) {
      setMessages([]);
      return;
    }

    const chatDocRef = doc(db, "chats", currentChat);

    const unsubscribe = onSnapshot(chatDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const chatData = docSnapshot.data();
        setMessages(chatData.clientMessages || []);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [currentChat]);

  useEffect(() => {
    if (!location.state?.artist) return;

    const initChatWithClient = async () => {
      const artistId = location.state.artist;
      const client = auth.currentUser?.uid;
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

    const chatId = lockedChatId || currentChat;
    const newMessageData = {
      id: Date.now().toString(),
      sender: "Client",
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };

    const chatDoc = doc(db, "chats", chatId);

    try {
      // Update the chat with the new message
      await updateDoc(chatDoc, {
        clientMessages: arrayUnion(newMessageData),
        artistMessages: arrayUnion(newMessageData),
        deletedByArtist: false,
        deletedByClient: false,
      });

      // Send a notification to the artist
      const artistId = chats.find((chat) => chat.id === currentChat)?.artist
        ?.id;
      if (artistId) {
        const notificationDoc = doc(collection(db, "notifications"));
        await setDoc(notificationDoc, {
          recipientId: artistId,
          type: "message",
          message: `You have a new message from.`,
          timestamp: new Date().toISOString(),
          chatId, // Include chat ID for navigation
          isRead: false,
        });
      }

      setNewMessage(""); // Clear the input field
      scrollToBottom(); // Scroll to the latest message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  useEffect(() => {
    if (!newMessage.trim()) {
      setLockedChatId(null); // Clear lock when no message is being typed
    }
  }, [newMessage]);

  useEffect(() => {
    console.log("Current Chat ID:", currentChat);
  }, [currentChat]);

  const handleNewConversation = (chatId) => {
    if (newMessage.trim()) {
      console.warn("Finish typing your message before switching chats.");
      return;
    }

    setCurrentChat(chatId);
    setLockedChatId(chatId); // Lock the chat to prevent switching
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChatMenu = (chatId) => {
    setActiveChatMenu(activeChatMenu === chatId ? null : chatId);
  };

  const deleteChat = async (chatId) => {
    try {
      // Optimistically remove the chat from the UI immediately
      setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
      setCurrentChat(null); // Clear the active chat

      // Perform the Firestore update
      const chatDoc = doc(db, "chats", chatId);
      await updateDoc(chatDoc, {
        clientMessages: [], // Clear client messages
        deletedByClient: true, // Mark the chat as deleted
      });

      setCurrentChat(null);
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
    <div className="client-dashboard">
      <ClientSidebar />
      <div className="client-main-dashboard">
        <ClientHeader />
        <div className="client-chat-container">
          <div className="client-chat-chats">
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
                      src={chat.artist?.avatar || "default-avatar.png"}
                      alt={chat.artist?.name || "Artist"}
                      className="chat-avatar"
                      onClick={selectedProfilePicture}
                    />
                    <div className="chat-name-status">
                      <span className="chat-name">
                        {chat.artist?.name || "Artist"}
                      </span>
                      <span
                        className={`status-dot ${
                          chat.artistOnline ? "online-dot" : "offline-dot"
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
                        chats.find((c) => c.id === currentChat)?.artist
                          ?.avatar || "default-avatar.png"
                      }
                      alt={
                        chats.find((c) => c.id === currentChat)?.artist?.name ||
                        "Artist"
                      }
                      className="header-avatar"
                      onClick={selectedProfilePicture}
                    />
                    <div className="header-text">
                      <h4>
                        {chats.find((c) => c.id === currentChat)?.artist
                          ?.name || "Artist"}
                      </h4>
                      <span className="online-status">
                        {chats.find((c) => c.id === currentChat)?.artistOnline
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
                          msg.sender === "Client"
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
                  {isArtistTyping && (
                    <div className="typing-indicator">typing...</div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </>
            ) : (
              <p className="select-chat-placeholder">
                {chats.length === 0 && "Select a chat to start messaging"}
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

export default ClientChat;
