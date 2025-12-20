interface ColorPresetsProps {
    activeColor: string;
    onSelect: (color: string) => void;
    disabled?: boolean;
}

const PRESETS = [
    { color: '#ff0000', name: 'Red' },
    { color: '#ff6b00', name: 'Orange' },
    { color: '#ffd000', name: 'Yellow' },
    { color: '#00ff00', name: 'Green' },
    { color: '#00ffff', name: 'Cyan' },
    { color: '#0066ff', name: 'Blue' },
    { color: '#8b00ff', name: 'Purple' },
    { color: '#ff00ff', name: 'Magenta' },
    { color: '#ffffff', name: 'White' },
];

export function ColorPresets({ activeColor, onSelect, disabled }: ColorPresetsProps) {
    return (
        <div className={`flex flex-wrap justify-center gap-3 ${disabled ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
            {PRESETS.map(({ color, name }) => {
                const isActive = activeColor.toLowerCase() === color.toLowerCase();

                return (
                    <button
                        key={color}
                        onClick={() => onSelect(color)}
                        title={name}
                        disabled={disabled}
                        className={`
                            relative w-8 h-8 rounded-lg cursor-pointer
                            transition-transform duration-150 ease-out
                            hover:scale-110
                            ${isActive ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-bg' : ''}
                        `}
                        style={{
                            backgroundColor: color,
                            boxShadow: isActive ? `0 0 12px ${color}80` : undefined,
                        }}
                    >
                        {/* Active checkmark */}
                        {isActive && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg
                                    className={`w-4 h-4 drop-shadow-lg ${color === '#ffffff' ? 'text-black' : 'text-white'}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
