import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, User as UserIcon, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import socket from '../../services/socket';
import styles from './AdminMessages.module.css';

const AdminMessages = () => {
    const { user: admin } = useAuth();
    const [chatUsers, setChatUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchChatUsers = async () => {
            try {
                const response = await api.get(`/chat/users/${admin._id}`);
                setChatUsers(response.data);
            } catch (error) {
                console.error('Error fetching chat users:', error);
            }
        };

        if (admin) {
            fetchChatUsers();

            if (!socket.connected) {
                socket.connect();
            }

            const handleConnect = () => {
                console.log('Socket connected');
                socket.emit('join', admin._id);
            };

            const handleConnectError = (error) => {
                console.error('Socket connection error:', error);
            };

            const handleReceiveMessage = (data) => {
                // If the message is for the currently selected chat, add it to messages
                if (selectedUser && (data.sender === selectedUser._id || data.receiver === selectedUser._id)) {
                    setMessages((prev) => [...prev, data]);
                }

                // Update chat list to show last message and update order
                setChatUsers((prev) => {
                    const newUserList = [...prev];
                    const senderId = data.sender === admin._id ? data.receiver : data.sender;
                    const userIndex = newUserList.findIndex(u => u._id === senderId);

                    if (userIndex !== -1) {
                        newUserList[userIndex].lastMessage = data.text;
                        newUserList[userIndex].lastMessageTime = data.timestamp;
                        if (data.sender !== admin._id && (!selectedUser || selectedUser._id !== data.sender)) {
                            newUserList[userIndex].unreadCount = (newUserList[userIndex].unreadCount || 0) + 1;
                        }
                        // Re-sort
                        return newUserList.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
                    } else {
                        // If it's a new user, we might need to fetch their info, or just refresh list
                        fetchChatUsers();
                        return prev;
                    }
                });
            };

            socket.on('connect', handleConnect);
            socket.on('connect_error', handleConnectError);
            socket.on('receiveMessage', handleReceiveMessage);

            // If already connected, manually call join
            if (socket.connected) {
                socket.emit('join', admin._id);
            }

            return () => {
                socket.off('connect', handleConnect);
                socket.off('connect_error', handleConnectError);
                socket.off('receiveMessage', handleReceiveMessage);
            };
        }
    }, [admin, selectedUser]);

    useEffect(() => {
        if (selectedUser && admin) {
            const fetchMessages = async () => {
                try {
                    const response = await api.get(`/chat/messages/${admin._id}/${selectedUser._id}`);
                    setMessages(response.data);

                    // Mark as read
                    await api.put('/chat/mark-read', {
                        senderId: selectedUser._id,
                        receiverId: admin._id
                    });

                    // Update user count in list locally
                    setChatUsers(prev => prev.map(u =>
                        u._id === selectedUser._id ? { ...u, unreadCount: 0 } : u
                    ));
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };

            fetchMessages();
        }
    }, [selectedUser, admin]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !admin || !selectedUser) return;

        const messageData = {
            sender: admin._id,
            receiver: selectedUser._id,
            text: newMessage,
            timestamp: new Date()
        };

        try {
            await api.post('/chat/send', messageData);
            socket.emit('sendMessage', messageData);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const filteredUsers = chatUsers.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.messagesContainer}>
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h3>Messages</h3>
                    <div className={styles.searchBox}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className={styles.userList}>
                    {filteredUsers.length === 0 ? (
                        <div className={styles.emptyState}>No chats found</div>
                    ) : (
                        filteredUsers.map((chat) => (
                            <div
                                key={chat._id}
                                className={`${styles.userItem} ${selectedUser?._id === chat._id ? styles.selected : ''}`}
                                onClick={() => setSelectedUser(chat)}
                            >
                                <div className={styles.avatar}>
                                    {chat.image ? <img src={chat.image} alt={chat.name} /> : <UserIcon size={24} />}
                                    {chat.unreadCount > 0 && <span className={styles.unreadBadge}>{chat.unreadCount}</span>}
                                </div>
                                <div className={styles.userDetails}>
                                    <div className={styles.userName}>{chat.name}</div>
                                    <div className={styles.lastMsg}>{chat.lastMessage}</div>
                                </div>
                                <div className={styles.time}>
                                    {chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className={styles.chatArea}>
                {selectedUser ? (
                    <>
                        <div className={styles.chatHeader}>
                            <div className={styles.activeUser}>
                                <div className={styles.avatar}>
                                    {selectedUser.image ? <img src={selectedUser.image} alt={selectedUser.name} /> : <UserIcon size={20} />}
                                </div>
                                <div>
                                    <div className={styles.activeName}>{selectedUser.name}</div>
                                    <div className={styles.activeStatus}>{selectedUser.email}</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.messageList}>
                            {messages.map((msg, index) => (
                                <div key={index} className={`${styles.messageWrapper} ${msg.sender === admin._id ? styles.sent : styles.received}`}>
                                    <div className={styles.messageBubble}>
                                        <div className={styles.text}>{msg.text}</div>
                                        <div className={styles.messageTime}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className={styles.inputArea} onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                placeholder="Write a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit" disabled={!newMessage.trim()}>
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className={styles.noChatSelected}>
                        <MessageSquare size={64} />
                        <h3>Select a conversation to start chatting</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMessages;
