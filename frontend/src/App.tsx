import { useState, useEffect, useRef } from 'react';
import {
    Connect,
    SetColor,
    Off,
    CheckDependencies,
    InstallDependencies,
    GetUSBDevices,
    LoadSettings,
    SaveColorSetting,
} from '../wailsjs/go/main/App';

type AppState = 'checking' | 'needsInstall' | 'needsHomebrew' | 'connecting' | 'connected' | 'error';

interface DependencyResult {
    installed: boolean;
    message: string;
}

const PRESET_COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];

export default function App() {
    const [state, setState] = useState<AppState>('checking');
    const [color, setColor] = useState('#ff0000');
    const [showDebug, setShowDebug] = useState(false);
    const [debugInfo, setDebugInfo] = useState('');

    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingColorRef = useRef<string | null>(null);

    useEffect(() => {
        checkDependencies();
    }, []);

    async function checkDependencies() {
        try {
            const result = (await CheckDependencies()) as DependencyResult;

            if (result.installed) {
                await connect();
            } else {
                if (result.message.includes('Homebrew')) {
                    setState('needsHomebrew');
                } else {
                    setState('needsInstall');
                }
            }
        } catch (err) {
            setState('error');
        }
    }

    async function installDeps() {
        try {
            setState('checking');
            await InstallDependencies();
            await checkDependencies();
        } catch (err) {
            setState('error');
        }
    }

    async function connect() {
        try {
            setState('connecting');
            await Connect();
            setState('connected');
            await loadSavedColor();
        } catch (err) {
            const errorMsg = String(err);
            setState('error');

            if (errorMsg.includes('not found')) {
                setShowDebug(true);
            } else {
                console.error('Connection error:', err);
            }
        }
    }

    async function loadSavedColor() {
        try {
            const settings = (await LoadSettings()) as { lastColor?: string };
            if (settings?.lastColor) {
                const hex = '#' + settings.lastColor;
                setColor(hex);
                await applyColor(hex, false);
            }
        } catch (err) {
            console.error('Error loading saved color:', err);
        }
    }

    async function applyColor(hex: string, save = true) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        try {
            await SetColor(r, g, b);

            if (save) {
                pendingColorRef.current = hex.slice(1);

                if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                }

                saveTimeoutRef.current = setTimeout(async () => {
                    if (pendingColorRef.current) {
                        await SaveColorSetting(pendingColorRef.current);
                    }
                }, 300);
            }
        } catch (err) {
            console.error('Error setting color:', err);
        }
    }

    function handleColorChange(hex: string) {
        setColor(hex);
        applyColor(hex);
    }

    async function turnOff() {
        try {
            await Off();
        } catch (err) {
            console.error('Error:', err);
        }
    }

    async function showDebugInfo() {
        try {
            const devices = await GetUSBDevices();
            setDebugInfo(devices);
        } catch (err) {
            setDebugInfo('Error: ' + String(err));
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-bg">
            {/* Drag region */}
            <div
                className="fixed top-0 z-10 flex items-center justify-center w-full border-b h-11 border-white/10 backdrop-blur-sm shrink-0"
                style={{ '--wails-draggable': 'drag' } as React.CSSProperties}
            >
                <h1 className="text-sm text-center text-white/60">HyperX QuadCast RGB Controller</h1>

                {/* Status message */}
                <div
                    className={`w-2 h-2 rounded-full absolute right-5 ${
                        state === 'connected'
                            ? 'bg-green-500/75'
                            : state === 'error'
                              ? 'bg-red-500/75'
                              : state === 'needsInstall' || state === 'needsHomebrew'
                                ? 'bg-yellow-500/75'
                                : 'bg-blue-500/75'
                    }`}
                >
                    <pre className="text-sm whitespace-pre-wrap"></pre>
                </div>
            </div>

            <div className="flex items-center justify-center flex-1 p-5">
                {/* Install button */}
                {state === 'needsInstall' && (
                    <button
                        onClick={installDeps}
                        className="w-full px-4 py-3 font-semibold transition-colors bg-yellow-500 rounded-lg cursor-pointer hover:bg-yellow-600"
                    >
                        Install Dependencies Automatically
                    </button>
                )}

                {/* Homebrew needed */}
                {state === 'needsHomebrew' && (
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full px-4 py-3 font-semibold transition-colors bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600"
                    >
                        I have installed the dependencies
                    </button>
                )}

                {/* Debug button */}
                {showDebug && state === 'error' && (
                    <button
                        onClick={showDebugInfo}
                        className="w-full px-4 py-3 font-semibold transition-colors bg-gray-500 rounded-lg cursor-pointer hover:bg-gray-600"
                    >
                        🔍 Show USB Devices (Debug)
                    </button>
                )}

                {/* Debug info modal */}
                {debugInfo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
                        <div className="bg-white text-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
                            <h2 className="mb-4 text-xl font-bold">USB Devices (for debugging)</h2>
                            <textarea readOnly value={debugInfo} className="w-full h-64 p-2 font-mono text-sm border rounded" />
                            <button onClick={() => setDebugInfo('')} className="px-4 py-2 mt-4 text-white bg-indigo-500 rounded-lg">
                                Close
                            </button>
                        </div>
                    </div>
                )}

                <div className="w-full p-4 text-white shadow-xl bg-white/10 backdrop-blur-lg rounded-2xl">
                    {/* Color controls */}
                    {state === 'connected' && (
                        <div className="space-y-4">
                            {/* Color picker */}
                            <div className="flex items-center gap-4">
                                <label>Choose color:</label>
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => handleColorChange(e.target.value)}
                                    className="w-20 h-8 border-0 rounded cursor-pointer"
                                />
                            </div>

                            {/* Preset colors */}
                            <div className="flex flex-wrap justify-center gap-3">
                                {PRESET_COLORS.map((presetColor) => (
                                    <button
                                        key={presetColor}
                                        onClick={() => handleColorChange(presetColor)}
                                        className="w-12 h-4 transition-transform rounded-sm cursor-pointer border-white/30 hover:scale-110"
                                        style={{ backgroundColor: presetColor }}
                                    />
                                ))}
                            </div>

                            {/* Turn off button */}
                            <button
                                onClick={turnOff}
                                className="w-full px-4 py-1 text-sm transition-colors rounded-lg cursor-pointer bg-black/80 hover:bg-black/50"
                            >
                                Turn Off LED
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
