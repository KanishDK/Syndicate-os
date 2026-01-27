import { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';

/**
 * usePeerHost Hook
 * 
 * Manages the "Host" side of a P2P connection.
 * 1. Connects to PeerJS cloud to get a Public ID.
 * 2. Listens for incoming connections from clients.
 * 3. Manages data transmission.
 */
const usePeerHost = () => {
    const [peerId, setPeerId] = useState(null);
    const [connection, setConnection] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [lastPeerData, setLastPeerData] = useState(null); // NEW
    const peerRef = useRef(null);

    // Initialize Peer on Mount
    useEffect(() => {
        // Create a new Peer with a random ID
        // Debug: We can force an ID if needed, but random is safer for public cloud
        const peer = new Peer();

        peer.on('open', (id) => {
            console.log('[Host] My Peer ID is:', id);
            setPeerId(id);
        });

        peer.on('connection', (conn) => {
            console.log('[Host] Incoming connection from:', conn.peer);

            conn.on('open', () => {
                console.log('[Host] Connection established!');
                setConnection(conn);
                setIsConnected(true);

                // Send initial handshake
                conn.send({ type: 'HANDSHAKE', message: 'Welcome to the Syndicate.' });
            });

            conn.on('data', (data) => {
                console.log('[Host] Received data:', data);
                setLastPeerData(data); // UPDATE STATE
            });

            conn.on('close', () => {
                console.log('[Host] Connection closed');
                setIsConnected(false);
                setConnection(null);
                setLastPeerData(null);
            });
        });

        peer.on('error', (err) => {
            console.error('[Host] Peer Error:', err);
            setError(err.type);
        });

        peerRef.current = peer;

        // Cleanup
        return () => {
            if (peerRef.current) {
                peerRef.current.destroy();
            }
        };
    }, []);

    const sendData = (data) => {
        if (connection && isConnected) {
            connection.send(data);
        }
    };

    return {
        peerId,
        isConnected,
        error,
        sendData,
        lastPeerData // EXPORT
    };
};

export default usePeerHost;
