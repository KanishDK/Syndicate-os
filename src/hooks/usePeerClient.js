import { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';

/**
 * usePeerClient Hook
 * 
 * Manages the "Client" side of a P2P connection.
 * 1. Connects to PeerJS cloud.
 * 2. Connects to a specific Host ID.
 * 3. UI helpers for joining lobbies.
 */
const usePeerClient = () => {
    const [myId, setMyId] = useState(null);
    const [connection, setConnection] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [lastPeerData, setLastPeerData] = useState(null); // NEW
    const peerRef = useRef(null);

    // Initialize Peer instance (Need an ID to connect outgoing)
    useEffect(() => {
        const peer = new Peer();

        peer.on('open', (id) => {
            console.log('[Client] My Peer ID is:', id);
            setMyId(id);
        });

        peer.on('error', (err) => {
            console.error('[Client] Peer Error:', err);
            setError(err.type);
        });

        peerRef.current = peer;

        return () => {
            if (peerRef.current) peerRef.current.destroy();
        };
    }, []);

    const connectToHost = (hostId) => {
        if (!peerRef.current) return;

        console.log('[Client] Connecting to Host:', hostId);
        const conn = peerRef.current.connect(hostId);

        conn.on('open', () => {
            console.log('[Client] Connected to Host!');
            setConnection(conn);
            setIsConnected(true);
        });

        conn.on('data', (data) => {
            console.log('[Client] Received:', data);
            setLastPeerData(data); // UPDATE STATE
        });

        conn.on('close', () => {
            console.log('[Client] Disconnected');
            setIsConnected(false);
            setConnection(null);
            setLastPeerData(null);
        });

        conn.on('error', (err) => {
            console.error('[Client] Connection Error:', err);
            setError('CONNECTION_FAILED');
        });
    };

    const sendData = (data) => {
        if (connection && isConnected) {
            connection.send(data);
        }
    };

    return {
        myId,
        connectToHost,
        isConnected,
        error,
        sendData,
        lastPeerData // EXPORT
    };
};

export default usePeerClient;
