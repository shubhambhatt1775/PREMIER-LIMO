import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Minus, Maximize2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import socket from '../../services/socket';
import './ChatWidget.css';

const ChatWidget = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [admin, setAdmin] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await api.get('/chat/admin');
                setAdmin(response.data);
            } catch (error) {
                console.error('Error fetching admin:', error);
            }
        };

        fetchAdmin();
    }, []);

    useEffect(() => {
        if (user && admin) {
            const fetchMessages = async () => {
                try {
                    const response = await api.get(`/chat/messages/${user._id}/${admin._id}`);
                    setMessages(response.data);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };

            fetchMessages();

            const handleConnect = () => {
                console.log('ChatWidget: Socket connected');
                socket.emit('join', user._id);
            };

            const handleReceiveMessage = (data) => {
                if (data.sender === admin._id || data.sender === user._id) {
                    setMessages((prev) => [...prev, data]);
                }
            };

            socket.on('connect', handleConnect);
            socket.on('receiveMessage', handleReceiveMessage);

            if (socket.connected) {
                handleConnect();
            }

            return () => {
                socket.off('connect', handleConnect);
                socket.off('receiveMessage', handleReceiveMessage);
            };
        }
    }, [user, admin]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !admin) return;

        const messageData = {
            sender: user._id,
            receiver: admin._id,
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

    if (!user || user.role === 'admin') return null;

    return (
        <div className="chat-widget-container">
            {!isOpen ? (
                <button className="chat-bubble" onClick={() => setIsOpen(true)}>
                    <MessageCircle size={28} />
                    <span className="tooltip">Chat with us</span>
                </button>
            ) : (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="admin-info">
                            <div className="status-dot"></div>
                            <span>Support Admin</span>
                        </div>
                        <div className="header-actions">
                            <button onClick={() => setIsOpen(false)}><X size={18} /></button>
                        </div>
                    </div>

                    <div className="chat-messages">
                        {messages.length === 0 && (
                            <div className="empty-chat">
                                <p>Hi! How can we help you today?</p>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender === user._id ? 'sent' : 'received'}`}>
                                <div className="message-text">{msg.text}</div>
                                <div className="message-time">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button type="submit" disabled={!newMessage.trim()}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
