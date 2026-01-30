import React, { useState } from 'react';
import usePeerHost from '../hooks/usePeerHost';
import usePeerClient from '../hooks/usePeerClient';
import useMultiplayerSync from '../hooks/useMultiplayerSync';
import { formatCurrency, formatNumber } from '../utils/gameMath';
import { useLanguage } from '../context/LanguageContext';

const NetCode = ({ gameState }) => {
    const { t } = useLanguage();
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
            <div className="flex flex-col sm:flex-row gap-4 p-4 border border-theme-border-default bg-theme-surface-elevated rounded-lg">
                <button
                    onClick={() => setMode('HOST')}
                    className="flex-1 py-4 bg-theme-primary/10 hover:bg-theme-primary/20 text-theme-primary border border-theme-primary/50 text-xl font-bold rounded uppercase transition-all flex items-center justify-center gap-2"
                >
                    <i className="fa-solid fa-server"></i> {t('rivals.network.host')}
                </button>
                <button
                    onClick={() => setMode('JOIN')}
                    className="flex-1 py-4 bg-theme-secondary/10 hover:bg-theme-secondary/20 text-theme-secondary border border-theme-secondary/50 text-xl font-bold rounded uppercase transition-all flex items-center justify-center gap-2"
                >
                    <i className="fa-solid fa-users"></i> {t('rivals.network.join')}
                </button>
            </div>
        );
    }

    // ----- RENDER: HOST LOBBY -----
    if (mode === 'HOST') {
        return (
            <div className="space-y-6">
                <div className="p-6 border border-theme-primary bg-theme-surface-elevated rounded-lg space-y-4 text-center">
                    <h2 className="text-2xl text-theme-primary font-black uppercase tracking-wider">{t('rivals.network.lobby_created')}</h2>

                    {!host.isConnected ? (
                        <>
                            <div className="bg-black p-4 rounded border border-theme-border-subtle">
                                <p className="text-theme-text-muted mb-2 text-sm">{t('rivals.network.share_code')}</p>
                                <div className="text-2xl text-theme-primary font-mono select-all cursor-pointer hover:text-white" onClick={() => navigator.clipboard.writeText(host.peerId)}>
                                    {host.peerId || t('rivals.network.generating')}
                                </div>
                            </div>
                            <div className="text-theme-warning animate-pulse text-sm">
                                <i className="fa-solid fa-spinner fa-spin mr-2"></i> {t('rivals.network.waiting')}
                            </div>
                        </>
                    ) : (
                        <div className="text-theme-success font-bold text-xl animate-pulse">
                            <i className="fa-solid fa-link mr-2"></i> {t('rivals.network.connected')}
                        </div>
                    )}
                </div>

                {/* DASHBOARD */}
                {host.isConnected && rivalStats && (
                    <RivalDashboard stats={rivalStats} label={t('rivals.network.client')} t={t} />
                )}

                <button onClick={() => setMode(null)} className="text-xs uppercase tracking-widest text-theme-text-muted hover:text-white w-full text-center py-2 opacity-50 hover:opacity-100">
                    [ {t('rivals.network.cancel')} ]
                </button>
            </div>
        );
    }

    // ----- RENDER: CLIENT JOIN -----
    if (mode === 'JOIN') {
        return (
            <div className="space-y-6">
                {!client.isConnected ? (
                    <div className="p-6 border border-theme-secondary bg-theme-surface-elevated rounded-lg space-y-4 text-center">
                        <h2 className="text-2xl text-theme-secondary font-black uppercase tracking-wider">{t('rivals.network.join_lobby')}</h2>
                        <input
                            type="text"
                            placeholder={t('rivals.network.paste_code')}
                            value={joinId}
                            onChange={(e) => setJoinId(e.target.value)}
                            className="w-full text-center bg-black border border-theme-border-default p-3 text-xl font-mono text-white focus:border-theme-secondary outline-none rounded"
                        />

                        <button
                            onClick={() => client.connectToHost(joinId)}
                            disabled={!joinId}
                            className={`w-full py-3 font-bold rounded uppercase transition-colors ${joinId ? 'bg-theme-secondary text-black hover:bg-white' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
                        >
                            {t('rivals.network.connect')}
                        </button>
                        {client.error && <p className="text-theme-danger font-mono text-xs">{client.error}</p>}
                    </div>
                ) : (
                    <div className="p-4 border border-theme-success bg-theme-surface-elevated rounded text-center">
                        <div className="text-theme-success font-bold text-xl animate-pulse">
                            <i className="fa-solid fa-link mr-2"></i> {t('rivals.network.connected_host')}
                        </div>
                    </div>
                )}

                {/* DASHBOARD */}
                {client.isConnected && rivalStats && (
                    <RivalDashboard stats={rivalStats} label={t('rivals.network.host_label')} t={t} />
                )}

                <button onClick={() => setMode(null)} className="text-xs uppercase tracking-widest text-theme-text-muted hover:text-white w-full text-center py-2 opacity-50 hover:opacity-100">
                    [ {t('rivals.network.disconnect')} ]
                </button>
            </div>
        );
    }
};

// ----- SUB-COMPONENT: RIVAL DASHBOARD -----
const RivalDashboard = ({ stats, label, t }) => {
    return (
        <div className="border border-theme-border-default bg-black/50 p-4 rounded-lg animate-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-theme-text-secondary uppercase text-[10px] font-black mb-3 tracking-[0.2em] border-b border-theme-border-subtle pb-1 flex justify-between">
                <span>{t('rivals.network.intel')}</span>
                <span className="text-theme-primary">{label}</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {/* ID Card */}
                <div className="col-span-2 flex items-center gap-3 bg-theme-bg-primary p-3 rounded border border-theme-border-subtle shadow-inner">
                    <div className="w-12 h-12 bg-theme-primary/10 rounded-full flex items-center justify-center text-2xl border border-theme-primary/30">👤</div>
                    <div>
                        <div className="text-lg font-black text-white leading-none uppercase italic">{stats.title}</div>
                        <div className="text-[10px] text-theme-text-muted font-mono mt-1">
                            {t('rivals.network.boss_level', { level: stats.level })}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <StatBox label={t('rivals.network.net_worth')} value={formatCurrency(stats.netWorth)} color="text-theme-accent" />
                <StatBox label={t('rivals.network.liquid_cash')} value={formatCurrency(stats.cash)} color="text-theme-success" />
                <StatBox label={t('rivals.network.heat')} value={`${Math.floor(stats.heat)}%`} color={stats.heat > 50 ? 'text-theme-danger' : 'text-theme-primary'} />
                <StatBox label={t('rivals.network.dirty_cash')} value={formatCurrency(stats.dirtyCash)} color="text-zinc-500" />
            </div>

            {/* Interaction (Siphon Demo) */}
            <div className="mt-4 pt-4 border-t border-theme-border-subtle">
                <button className="w-full py-2 bg-theme-danger/10 hover:bg-theme-danger/20 border border-theme-danger/30 text-theme-danger font-black text-xs rounded uppercase transition-colors opacity-40 cursor-not-allowed tracking-widest">
                    <i className="fa-solid fa-microchip mr-2"></i> {t('rivals.network.siphon')}
                </button>
            </div>
        </div>
    );
};

const StatBox = ({ label, value, color }) => (
    <div className="bg-theme-bg-primary p-2 rounded border border-theme-border-subtle text-center">
        <div className="text-[9px] text-theme-text-muted uppercase font-black tracking-wider mb-1">{label}</div>
        <div className={`font-mono text-sm font-bold ${color}`}>{value}</div>
    </div>
);

export default NetCode;
