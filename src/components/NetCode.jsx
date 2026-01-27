import React, { useState } from 'react';
import usePeerHost from '../hooks/usePeerHost';
import usePeerClient from '../hooks/usePeerClient';
import useMultiplayerSync from '../hooks/useMultiplayerSync';
import { formatCurrency } from '../utils/gameMath';

const NetCode = ({ gameState }) => {
    const [mode, setMode] = useState(null); // 'HOST' or 'JOIN'
    const [joinId, setJoinId] = useState('');

    // Hooks (Always mounted, logic handled internally)
    const host = usePeerHost();
    const client = usePeerClient();

    // Determine active peer interface
    const activePeer = mode === 'HOST' ? host : client;

    // Activate Sync Loop (Broadcasts local stats)
    useMultiplayerSync(gameState, activePeer);

    // Get Rival Stats (if available)
    const rivalStats = activePeer.lastPeerData?.stats;

    // ----- RENDER: MAIN MENU -----
    if (!mode) {
        return (
            <div className="flex gap-4 p-4 border border-theme-border-default bg-theme-surface-elevated rounded-lg">
                <button
                    onClick={() => setMode('HOST')}
                    className="flex-1 py-4 bg-theme-primary/10 hover:bg-theme-primary/20 text-theme-primary border border-theme-primary/50 text-xl font-bold rounded uppercase transition-all"
                >
                    <i className="fa-solid fa-server mr-2"></i> Host Syndicate
                </button>
                <button
                    onClick={() => setMode('JOIN')}
                    className="flex-1 py-4 bg-theme-secondary/10 hover:bg-theme-secondary/20 text-theme-secondary border border-theme-secondary/50 text-xl font-bold rounded uppercase transition-all"
                >
                    <i className="fa-solid fa-users mr-2"></i> Join Syndicate
                </button>
            </div>
        );
    }

    // ----- RENDER: HOST LOBBY -----
    if (mode === 'HOST') {
        return (
            <div className="space-y-6">
                <div className="p-6 border border-theme-primary bg-theme-surface-elevated rounded-lg space-y-4 text-center">
                    <h2 className="text-2xl text-theme-primary font-black uppercase tracking-wider">Lobby Created</h2>

                    {!host.isConnected ? (
                        <>
                            <div className="bg-black p-4 rounded border border-theme-border-subtle">
                                <p className="text-theme-text-muted mb-2">Share this code with your rival:</p>
                                <div className="text-3xl text-theme-primary font-mono select-all cursor-pointer hover:text-white" onClick={() => navigator.clipboard.writeText(host.peerId)}>
                                    {host.peerId || 'Generating...'}
                                </div>
                            </div>
                            <div className="text-theme-warning animate-pulse">
                                <i className="fa-solid fa-spinner fa-spin mr-2"></i> Waiting for connections...
                            </div>
                        </>
                    ) : (
                        <div className="text-theme-success font-bold text-xl animate-pulse">
                            <i className="fa-solid fa-link mr-2"></i> RIVAL CONNECTED
                        </div>
                    )}
                </div>

                {/* DASHBOARD */}
                {host.isConnected && rivalStats && (
                    <RivalDashboard stats={rivalStats} isHost={true} />
                )}

                <button onClick={() => setMode(null)} className="text-sm underline text-theme-text-muted hover:text-white w-full text-center">Cancel Session</button>
            </div>
        );
    }

    // ----- RENDER: CLIENT JOIN -----
    if (mode === 'JOIN') {
        return (
            <div className="space-y-6">
                {!client.isConnected ? (
                    <div className="p-6 border border-theme-secondary bg-theme-surface-elevated rounded-lg space-y-4 text-center">
                        <h2 className="text-2xl text-theme-secondary font-black uppercase tracking-wider">Join Lobby</h2>
                        <input
                            type="text"
                            placeholder="Paste Lobby Code..."
                            value={joinId}
                            onChange={(e) => setJoinId(e.target.value)}
                            className="w-full text-center bg-black border border-theme-border-default p-3 text-xl font-mono text-white focus:border-theme-secondary outline-none"
                        />

                        <button
                            onClick={() => client.connectToHost(joinId)}
                            disabled={!joinId}
                            className={`w-full py-3 font-bold rounded uppercase transition-colors bg-theme-secondary text-black hover:bg-white`}
                        >
                            Connect
                        </button>
                        {client.error && <p className="text-theme-danger font-mono text-sm">{client.error}</p>}
                    </div>
                ) : (
                    <div className="p-4 border border-theme-success bg-theme-surface-elevated rounded text-center">
                        <div className="text-theme-success font-bold text-xl animate-pulse">
                            <i className="fa-solid fa-link mr-2"></i> CONNECTED TO HOST
                        </div>
                    </div>
                )}

                {/* DASHBOARD */}
                {client.isConnected && rivalStats && (
                    <RivalDashboard stats={rivalStats} isHost={false} />
                )}

                <button onClick={() => setMode(null)} className="text-sm underline text-theme-text-muted hover:text-white w-full text-center">Disconnect</button>
            </div>
        );
    }
};

// ----- SUB-COMPONENT: RIVAL DASHBOARD -----
const RivalDashboard = ({ stats, isHost }) => {
    return (
        <div className="border border-theme-border-default bg-black/50 p-4 rounded-lg animate-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-theme-text-secondary uppercase text-xs font-bold mb-3 tracking-widest border-b border-theme-border-subtle pb-1">
                Target Intel ({isHost ? 'Client' : 'Host'})
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {/* ID Card */}
                <div className="col-span-2 flex items-center gap-3 bg-theme-bg-primary p-2 rounded border border-theme-border-subtle">
                    <div className="w-10 h-10 bg-theme-border-subtle rounded-full flex items-center justify-center text-xl">👤</div>
                    <div>
                        <div className="text-lg font-black text-white leading-none">{stats.title}</div>
                        <div className="text-xs text-theme-text-muted">Level {stats.level} Boss</div>
                    </div>
                </div>

                {/* Stats */}
                <StatBox label="Net Worth" value={formatCurrency(stats.netWorth)} color="text-theme-accent" />
                <StatBox label="Liquid Cash" value={formatCurrency(stats.cash)} color="text-theme-success" />
                <StatBox label="Heat" value={`${stats.heat}%`} color={stats.heat > 50 ? 'text-theme-danger' : 'text-theme-primary'} />
                <StatBox label="Dirty Cash" value={formatCurrency(stats.dirtyCash)} color="text-zinc-500" />
            </div>

            {/* Interaction (Siphon Demo) */}
            <div className="mt-4 pt-4 border-t border-theme-border-subtle">
                <button className="w-full py-2 bg-theme-danger/20 hover:bg-theme-danger/40 border border-theme-danger text-theme-danger font-mono text-sm rounded uppercase transition-colors opacity-50 cursor-not-allowed" title="Coming in Phase 2.1">
                    <i className="fa-solid fa-microchip mr-2"></i> SIPHON FUNDS (LOCKED)
                </button>
            </div>
        </div>
    );
};

const StatBox = ({ label, value, color }) => (
    <div className="bg-theme-bg-primary p-2 rounded border border-theme-border-subtle text-center">
        <div className="text-[10px] text-theme-text-muted uppercase">{label}</div>
        <div className={`font-mono font-bold ${color}`}>{value}</div>
    </div>
);

export default NetCode;
