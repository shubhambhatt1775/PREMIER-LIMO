import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import socket from '../services/socket';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const LocationTracker = () => {
    const { user } = useAuth();
    const watchIdRef = useRef();
    const activeTripIdRef = useRef();

    // Poll for active trip (specifically 'picked_up' status)
    const { data: activeTrip } = useQuery({
        queryKey: ['active-trip', user?._id],
        queryFn: async () => {
            const res = await api.get(`/handover/active-trip/${user._id}`);
            return res.data;
        },
        enabled: !!user && user.role === 'user',
        refetchInterval: 10000,
    });

    useEffect(() => {
        if (!user || user.role !== 'user') return;

        const handleConnect = () => {
            console.log('LocationTracker: Socket connected');
            socket.emit('join', user._id);
            // Re-emit location if we have one (on reconnection)
        };

        socket.on('connect', handleConnect);
        if (socket.connected) handleConnect();

        return () => {
            socket.off('connect', handleConnect);
            if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
        };
    }, [user?._id]);

    useEffect(() => {
        if (!user) return;

        const isPickedUp = activeTrip && activeTrip.status === 'picked_up';

        if (isPickedUp) {
            // Check if we already have this trip tracking or if it's a new one
            if (!watchIdRef.current || activeTripIdRef.current !== activeTrip._id) {

                // If it's a new trip, clear the old watch first
                if (watchIdRef.current) {
                    navigator.geolocation.clearWatch(watchIdRef.current);
                }

                console.log('LocationTracker: Starting GPS tracking for trip:', activeTrip._id);
                activeTripIdRef.current = activeTrip._id;

                const sendLocation = (pos) => {
                    const { latitude, longitude } = pos.coords;
                    console.log('LocationTracker: Sending Update ->', latitude, longitude);

                    socket.emit('updateLocation', {
                        bookingId: activeTrip.booking?._id || activeTrip.booking,
                        carId: activeTrip.car,
                        userId: user._id,
                        carName: activeTrip.booking?.carName || 'Rental Car',
                        userName: user.name,
                        latitude,
                        longitude
                    });
                };

                // Get initial position immediately
                navigator.geolocation.getCurrentPosition(sendLocation, (err) => {
                    console.error('LocationTracker: Initial position error ->', err.message);
                });

                // Start watching
                watchIdRef.current = navigator.geolocation.watchPosition(
                    sendLocation,
                    (error) => {
                        console.error('LocationTracker: watchPosition error ->', error.message);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 5000
                    }
                );
            }
        } else {
            if (watchIdRef.current) {
                console.log('LocationTracker: Stopping GPS tracking (no active trip)');
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
                activeTripIdRef.current = null;
            }
        }
    }, [activeTrip, user?._id]);

    return null;
};

export default LocationTracker;
