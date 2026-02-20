import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import socket from '../../services/socket';
import { Navigation, User, Car, Clock } from 'lucide-react';
import api from '../../services/api';
import styles from './LiveTracking.module.css';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Car Icon
const carIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/744/744465.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const LiveTracking = () => {
    const [locations, setLocations] = useState([]);

    // Fetch initial locations
    const { data: initialData } = useQuery({
        queryKey: ['live-locations'],
        queryFn: () => api.get('/admin/live-locations'),
    });

    useEffect(() => {
        if (initialData?.data) {
            setLocations(initialData.data);
        }
    }, [initialData]);

    useEffect(() => {
        const handleConnect = () => {
            console.log('Admin: Tracking socket connected');
            socket.emit('joinAdmin');
        };

        const handleLocationUpdate = (data) => {
            console.log('Admin: Received location update for:', data.carName);
            setLocations(prev => {
                const index = prev.findIndex(loc => (loc.booking?._id || loc.booking) === data.bookingId);
                if (index !== -1) {
                    const newLocations = [...prev];
                    newLocations[index] = {
                        ...newLocations[index],
                        latitude: data.latitude,
                        longitude: data.longitude,
                        lastUpdated: data.timestamp
                    };
                    return newLocations;
                } else {
                    return [...prev, {
                        booking: { _id: data.bookingId, carName: data.carName, userName: data.userName },
                        latitude: data.latitude,
                        longitude: data.longitude,
                        lastUpdated: data.timestamp
                    }];
                }
            });
        };

        socket.on('connect', handleConnect);
        socket.on('locationUpdate', handleLocationUpdate);

        if (socket.connected) {
            handleConnect();
        }

        return () => {
            socket.off('connect', handleConnect);
            socket.off('locationUpdate', handleLocationUpdate);
        };
    }, []);

    const center = [20.5937, 78.9629]; // Default center (India)

    return (
        <div className={styles.trackingContainer}>
            <div className={styles.trackingHeader}>
                <div className={styles.headerTitle}>
                    <Navigation size={20} color="#3b82f6" />
                    <h3>Live Fleet Tracking</h3>
                </div>
                <div className={styles.onlineBadge}>
                    {locations.length} Vehicles Online
                </div>
            </div>

            <div className={styles.contentWrapper}>
                {/* Sidebar List */}
                <div className={styles.sidebar}>
                    {locations.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Car size={32} />
                            <p>No vehicles currently being tracked.</p>
                        </div>
                    ) : (
                        locations.map(loc => (
                            <div
                                key={loc._id || loc.booking?._id || loc.booking}
                                className={styles.locationCard}
                            >
                                <div className={styles.cardHeader}>
                                    <span className={styles.carName}>{loc.booking?.carName || 'Rental Car'}</span>
                                    <span className={styles.liveBadge}>Live</span>
                                </div>
                                <div className={styles.cardDetail}>
                                    <User size={14} />
                                    <span>{loc.booking?.userName || loc.user?.name || 'Customer'}</span>
                                </div>
                                <div className={styles.cardDetail}>
                                    <Clock size={14} />
                                    <span>Last updated: {new Date(loc.lastUpdated).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Map */}
                <div className={styles.mapWrapper}>
                    <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {locations.map(loc => (
                            <Marker
                                key={loc._id || loc.booking?._id || loc.booking}
                                position={[loc.latitude, loc.longitude]}
                                icon={carIcon}
                            >
                                <Popup>
                                    <div style={{ minWidth: '150px' }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0' }}>{loc.booking?.carName}</h4>
                                        <p style={{ margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <User size={14} /> {loc.booking?.userName}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#6b7280' }}>
                                            Updated: {new Date(loc.lastUpdated).toLocaleString()}
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                        <MapResizer locations={locations} />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

const MapResizer = ({ locations }) => {
    const map = useMap();
    useEffect(() => {
        if (locations.length > 0) {
            const validLocations = locations.filter(l => l.latitude && l.longitude);
            if (validLocations.length > 0) {
                const bounds = L.latLngBounds(validLocations.map(l => [l.latitude, l.longitude]));
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
            }
        }
    }, [locations.length, map]);
    return null;
};

export default LiveTracking;
