import Button from '../Button';
import { useLanguage } from '../../context/LanguageContext';

const WelcomeModal = ({ data, onClose }) => {
    const { t } = useLanguage();
    if (!data) return null;

    const hasProduction = Object.keys(data.produced || {}).length > 0;
    const hasRaids = (data.raids?.attempted || 0) > 0;
    const totalNet = (data.earnings + data.cleanEarnings) - data.salaryPaid - (data.raids?.moneyLost || 0);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-zinc-900 border border-zinc-700 p-0 rounded-sm max-w-md w-full shadow-2xl overflow-hidden relative">

                {/* RECEIPT TOP EDGE (Visual) */}
                <div className="h-2 bg-zinc-800 bg-[linear-gradient(45deg,transparent_75%,#000_75%),linear-gradient(-45deg,transparent_75%,#000_75%)] bg-[length:10px_10px]"></div>

                <div className="p-6 font-mono text-sm text-zinc-300">
                    <div className="text-center mb-6 border-b border-zinc-700 pb-4 border-dashed">
                        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-1">{t('offline_report.title')}</h2>
                        <p className="text-xs text-zinc-500">{new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}</p>
                        <p className="text-xs text-zinc-500 mt-1">{t('offline_report.time', { minutes: data.time })}</p>
                    </div>

                    {/* SECTION: PRODUCTION */}
                    {hasProduction && (
                        <div className="mb-4 text-xs">
                            <div className="uppercase font-bold text-zinc-500 mb-1 border-b border-zinc-700 border-dashed">{t('offline_report.production_title')}</div>
                            {Object.entries(data.produced).map(([item, count]) => (
                                <div key={item} className="flex justify-between py-0.5">
                                    <span>{t(`items.${item}.name`)}</span>
                                    <span>x{count.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* SECTION: SECURITY */}
                    {hasRaids && (
                        <div className="mb-4 text-xs">
                            <div className="uppercase font-bold text-zinc-500 mb-1 border-b border-zinc-700 border-dashed">{t('offline_report.security_title')}</div>
                            <div className="flex justify-between py-0.5 text-zinc-400">
                                <span>{t('offline_report.raids')}</span>
                                <span>{data.raids.attempted}</span>
                            </div>
                            <div className="flex justify-between py-0.5 text-emerald-400">
                                <span>{t('offline_report.defended')}</span>
                                <span>{data.raids.defended}</span>
                            </div>
                            {data.raids.lost > 0 && (
                                <div className="flex justify-between py-0.5 text-red-500 font-bold">
                                    <span>{t('offline_report.failed')}</span>
                                    <span>{data.raids.lost} (-{data.raids.moneyLost.toLocaleString()} kr)</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SECTION: FINANCIALS */}
                    <div className="mb-6">
                        <div className="uppercase font-bold text-zinc-500 mb-1 border-b border-zinc-700 border-dashed">{t('offline_report.finance_title')}</div>

                        <div className="flex justify-between py-0.5 mt-1 text-zinc-400">
                            <span>{t('offline_report.dirty_income')}</span>
                            <span>+{Math.floor(data.earnings).toLocaleString()} kr</span>
                        </div>
                        <div className="flex justify-between py-0.5 text-zinc-400">
                            <span>{t('offline_report.clean_income')}</span>
                            <span>+{Math.floor(data.cleanEarnings).toLocaleString()} kr</span>
                        </div>

                        {data.laundered > 0 && (
                            <div className="flex justify-between py-0.5 text-blue-400 text-[10px] italic">
                                <span>{t('offline_report.laundered_sub')}</span>
                                <span>{Math.floor(data.laundered).toLocaleString()} kr</span>
                            </div>
                        )}

                        {data.salaryPaid > 0 && (
                            <div className="flex justify-between py-0.5 text-red-400">
                                <span>{t('offline_report.salaries')}</span>
                                <span>-{Math.floor(data.salaryPaid).toLocaleString()} kr</span>
                            </div>
                        )}

                        {data.interest > 0 && (
                            <div className="flex justify-between py-0.5 text-red-400">
                                <span>{t('offline_report.interest')}</span>
                                <span>-{Math.floor(data.interest).toLocaleString()} kr</span>
                            </div>
                        )}

                        <div className="border-t border-zinc-500 border-dashed my-2"></div>

                        <div className="flex justify-between py-1 text-lg font-bold text-white">
                            <span>{t('offline_report.net')}</span>
                            <span className={totalNet >= 0 ? 'text-emerald-400' : 'text-red-500'}>
                                {totalNet > 0 ? '+' : ''}{Math.floor(totalNet).toLocaleString()} kr
                            </span>
                        </div>
                    </div>

                    <Button onClick={onClose} className="w-full py-3" variant="neutral">
                        {t('offline_report.close_btn')}
                    </Button>

                    <div className="text-center mt-4 text-[10px] text-zinc-600 font-serif italic">
                        {t('offline_report.quote')}
                    </div>
                </div>

                {/* RECEIPT BOTTOM EDGE */}
                <div className="h-2 bg-zinc-900 bg-[linear-gradient(135deg,transparent_75%,#000_75%),linear-gradient(-135deg,transparent_75%,#000_75%)] bg-[length:10px_10px] rotate-180"></div>
            </div>
        </div>
    );
};

export default WelcomeModal;
