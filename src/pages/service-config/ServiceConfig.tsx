import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getDigilockerProviderConfig, updateDigilockerProviderConfig } from '../../services/ApiService';

type Provider = 'TENACIO' | 'SUREPASS';

const PROVIDERS: { value: Provider; label: string; description: string; color: string }[] = [
    {
        value: 'TENACIO',
        label: 'Tenacio',
        description: "Original KYC provider. DigiLocker sessions are handled via Tenacio's API. This is the default.",
        color: '#001476',
    },
    {
        value: 'SUREPASS',
        label: 'SurePass',
        description: "Alternate KYC provider. DigiLocker sessions are handled via SurePass's API. Response is normalised to the same shape mobile expects.",
        color: '#0a6640',
    },
];

const ServiceConfig: React.FC = () => {
    const [activeProvider, setActiveProvider] = useState<Provider | null>(null);
    const [selected, setSelected] = useState<Provider | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        setLoading(true);
        setFetchError(null);
        try {
            const res = await getDigilockerProviderConfig();
            const provider: Provider = res?.data?.data?.activeProvider ?? 'TENACIO';
            setActiveProvider(provider);
            setSelected(provider);
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Unable to load service configuration. Please check your connection and try again.';
            setFetchError(msg);
            toast.error('Failed to load service configuration.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selected || selected === activeProvider) return;
        setSaving(true);
        setSaveError(null);
        try {
            await updateDigilockerProviderConfig(selected);
            setActiveProvider(selected);
            toast.success(`DigiLocker KYC provider switched to ${selected}`);
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Failed to update service configuration. Please try again.';
            setSaveError(msg);
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const isDirty = selected !== null && selected !== activeProvider;

    return (
        /* Full-page centered layout */
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f6fa] py-12 px-4">
            <div className="w-full max-w-2xl">

                {/* Page Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Service Configuration</h1>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                        Control which third-party provider handles DigiLocker Aadhaar KYC requests
                        from the mobile app. Changes take effect on the very next request — no server
                        restart or app release required.
                    </p>
                </div>

                {/* ── Fetch error state ─────────────────────────────────── */}
                {!loading && fetchError && (
                    <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8 mb-6 text-center">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h2 className="text-base font-semibold text-gray-800 mb-2">
                            Failed to load configuration
                        </h2>
                        <p className="text-sm text-red-600 mb-6 leading-relaxed">{fetchError}</p>
                        <button
                            id="service-config-retry-btn"
                            type="button"
                            onClick={fetchConfig}
                            className="px-6 py-2.5 text-sm font-semibold rounded-lg text-white transition-colors"
                            style={{ background: '#001476' }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* ── Main toggle card ──────────────────────────────────── */}
                {!fetchError && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 mb-6">

                        {/* Card header */}
                        <div className="flex items-start gap-4 pb-5 border-b border-gray-100 mb-6">
                            <div className="text-2xl leading-none mt-0.5">🔀</div>
                            <div>
                                <h2 className="text-base font-semibold text-gray-800">
                                    DigiLocker Aadhaar Provider
                                </h2>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                    Currently active:&nbsp;
                                    {loading ? (
                                        <span className="bg-gray-300 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full animate-pulse">
                                            Loading…
                                        </span>
                                    ) : (
                                        <span
                                            className="text-white text-xs font-semibold px-2.5 py-0.5 rounded-full"
                                            style={{
                                                background:
                                                    activeProvider === 'TENACIO' ? '#001476' : '#0a6640',
                                            }}
                                        >
                                            {activeProvider}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Loading skeleton */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <div
                                    className="w-9 h-9 rounded-full border-4 border-blue-100"
                                    style={{
                                        borderTopColor: '#001476',
                                        animation: 'spin 0.8s linear infinite',
                                    }}
                                />
                                <p className="text-sm text-gray-400">Loading configuration…</p>
                            </div>
                        ) : (
                            <>
                                {/* Provider selector cards */}
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    {PROVIDERS.map((p) => {
                                        const isSelected = selected === p.value;
                                        const isCurrent = activeProvider === p.value;
                                        return (
                                            <button
                                                key={p.value}
                                                id={`service-config-provider-${p.value.toLowerCase()}`}
                                                type="button"
                                                aria-pressed={isSelected}
                                                onClick={() => {
                                                    setSelected(p.value);
                                                    setSaveError(null);
                                                }}
                                                className="text-left p-5 rounded-xl border-2 transition-all duration-150"
                                                style={{
                                                    borderColor: isSelected ? p.color : '#e5e7eb',
                                                    background: isSelected ? `${p.color}08` : '#fafafa',
                                                    boxShadow: isSelected
                                                        ? `0 0 0 4px ${p.color}14`
                                                        : 'none',
                                                }}
                                            >
                                                <div className="flex items-center gap-2.5 mb-2.5">
                                                    {/* Radio dot */}
                                                    <div
                                                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                                                        style={{
                                                            borderColor: isSelected ? p.color : '#aaa',
                                                        }}
                                                    >
                                                        {isSelected && (
                                                            <div
                                                                className="w-2 h-2 rounded-full"
                                                                style={{ background: p.color }}
                                                            />
                                                        )}
                                                    </div>
                                                    <span
                                                        className="text-sm font-semibold"
                                                        style={{
                                                            color: isSelected ? p.color : '#374151',
                                                        }}
                                                    >
                                                        {p.label}
                                                    </span>
                                                    {isCurrent && (
                                                        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 leading-relaxed">
                                                    {p.description}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Switch warning */}
                                {isDirty && (
                                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-sm text-amber-800">
                                        <span className="text-lg leading-none flex-shrink-0">⚠️</span>
                                        <span>
                                            You are about to switch the live KYC provider from{' '}
                                            <strong>{activeProvider}</strong> to{' '}
                                            <strong>{selected}</strong>. This affects all mobile
                                            users immediately.
                                        </span>
                                    </div>
                                )}

                                {/* Inline save error */}
                                {saveError && (
                                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700">
                                        <span className="text-lg leading-none flex-shrink-0">❌</span>
                                        <div className="flex-1">
                                            <p className="font-semibold mb-0.5">Save failed</p>
                                            <p className="text-xs text-red-600 leading-relaxed">
                                                {saveError}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSaveError(null)}
                                            className="text-red-400 hover:text-red-600 transition-colors text-lg leading-none flex-shrink-0"
                                            aria-label="Dismiss error"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
                                    <button
                                        id="service-config-cancel-btn"
                                        type="button"
                                        disabled={!isDirty || saving}
                                        onClick={() => {
                                            setSelected(activeProvider);
                                            setSaveError(null);
                                        }}
                                        className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        id="service-config-save-btn"
                                        type="button"
                                        disabled={!isDirty || saving}
                                        onClick={handleSave}
                                        className="px-6 py-2.5 text-sm font-semibold rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            background: isDirty && !saving ? '#001476' : '#8fa3d4',
                                        }}
                                    >
                                        {saving ? (
                                            <span className="flex items-center gap-2">
                                                <span
                                                    className="w-4 h-4 rounded-full border-2 border-white/40"
                                                    style={{
                                                        borderTopColor: '#fff',
                                                        animation: 'spin 0.7s linear infinite',
                                                    }}
                                                />
                                                Saving…
                                            </span>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* ── Info box ─────────────────────────────────────────── */}
                {!fetchError && !loading && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-5">
                        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                            How the toggle works
                        </h3>
                        <ul className="space-y-2 text-xs text-gray-500 list-disc list-inside leading-relaxed">
                            <li>
                                Mobile always calls{' '}
                                <code className="bg-gray-100 px-1 rounded">
                                    /kyc/initiate-digilocker
                                </code>{' '}
                                and{' '}
                                <code className="bg-gray-100 px-1 rounded">
                                    /kyc/validate-digilocker-session
                                </code>{' '}
                                — URLs and payload shape never change.
                            </li>
                            <li>
                                The backend reads this setting on every request and routes to the
                                selected provider transparently.
                            </li>
                            <li>
                                Switching providers is the recommended recovery action if one
                                provider is experiencing an outage.
                            </li>
                            <li>
                                Only <strong>Evolve Admin</strong> users can change this setting.
                            </li>
                        </ul>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ServiceConfig;
