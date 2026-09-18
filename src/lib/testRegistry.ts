export interface TestInfo {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: "mouse" | "keyboard" | "display" | "audio" | "gamepad" | "display-test";
  icon: string;
  popular?: boolean;
}

export const TEST_CATEGORIES = {
  mouse: { label: "Mouse Tests", color: "accent" },
  keyboard: { label: "Keyboard Tests", color: "success" },
  display: { label: "Display Tests", color: "warning" },
  "display-test": { label: "Display Tests", color: "warning" },
  audio: { label: "Audio Tests", color: "danger" },
  gamepad: { label: "Gamepad Tests", color: "muted" },
} as const;

export const ALL_TESTS: TestInfo[] = [
  // Mouse
  { slug: "cps-test", title: "CPS Test — Clicks Per Second", shortTitle: "CPS Test", description: "Measure your clicking speed in clicks per second. Test with 1s, 5s, 10s, or 60s timers.", category: "mouse", icon: "🖱️", popular: true },
  { slug: "spacebar-speed", title: "Spacebar Speed Test", shortTitle: "Spacebar Speed", description: "Measure how fast you can press the spacebar. Tracks spacebar clicks per second.", category: "keyboard", icon: "⌨️", popular: true },
  { slug: "jitter-click", title: "Jitter Click Test", shortTitle: "Jitter Click", description: "Test your jitter clicking speed. Measures rapid involuntary clicking technique.", category: "mouse", icon: "⚡" },
  { slug: "butterfly-click", title: "Butterfly Click Test", shortTitle: "Butterfly Click", description: "Test butterfly clicking technique using two fingers alternating on mouse button.", category: "mouse", icon: "🦋" },
  { slug: "kohi-click", title: "Kohi Click Test", shortTitle: "Kohi Click", description: "Kohi-style click test measuring sustained rapid clicking performance.", category: "mouse", icon: "🎮" },
  { slug: "mouse-polling-rate", title: "Mouse Polling Rate Test", shortTitle: "Polling Rate", description: "Estimate your mouse polling rate (Hz). Browser-based measurement — results are approximate.", category: "mouse", icon: "📡" },
  { slug: "mouse-button-test", title: "Mouse Button Test", shortTitle: "Mouse Buttons", description: "Test all mouse buttons — left, right, middle, and side buttons. Detect double-click speed.", category: "mouse", icon: "🔘" },
  { slug: "mouse-latency", title: "Mouse Latency Test", shortTitle: "Mouse Latency", description: "Estimate mouse input latency. Browser-based measurement — results are approximate.", category: "mouse", icon: "⏱️" },

  // Keyboard
  { slug: "keyboard-tester", title: "Keyboard Tester", shortTitle: "Keyboard", description: "Test every key on your keyboard. Visual keyboard layout shows working and broken keys.", category: "keyboard", icon: "⌨️", popular: true },
  { slug: "wpm-typing-speed", title: "Typing Speed Test — WPM", shortTitle: "WPM Test", description: "Measure your words per minute typing speed with accuracy tracking.", category: "keyboard", icon: "✍️", popular: true },
  { slug: "keyboard-latency", title: "Keyboard Latency Test", shortTitle: "KB Latency", description: "Estimate keyboard input latency. Browser-based measurement — results are approximate.", category: "keyboard", icon: "⏱️" },

  // Display
  { slug: "reaction-time", title: "Reaction Time Test", shortTitle: "Reaction Time", description: "Test your visual reaction time. Measures how quickly you respond to visual stimuli.", category: "display", icon: "⚡", popular: true },
  { slug: "aim-click-reaction", title: "Aim & Click Reaction Test", shortTitle: "Aim Reaction", description: "Test your aiming and clicking reaction time. Click moving targets accurately.", category: "display", icon: "🎯" },
  { slug: "refresh-rate", title: "Refresh Rate Test", shortTitle: "Refresh Rate", description: "Detect your monitor refresh rate. Uses browser APIs for detection — results may vary.", category: "display", icon: "🔄" },
  { slug: "fps-test", title: "FPS Test — Frames Per Second", shortTitle: "FPS Test", description: "Measure browser rendering FPS in real-time. Tests actual frame rate performance.", category: "display", icon: "📊", popular: true },
  { slug: "dead-pixel-test", title: "Dead Pixel Test", shortTitle: "Dead Pixel", description: "Full-screen color test to identify dead, stuck, or hot pixels on your display.", category: "display-test", icon: "🔍" },
  { slug: "screen-resolution", title: "Screen Resolution Test", shortTitle: "Resolution", description: "Detect your screen resolution, DPI, color depth, and display information.", category: "display", icon: "🖥️" },

  // Audio
  { slug: "microphone-test", title: "Microphone Test", shortTitle: "Microphone", description: "Test your microphone with real-time audio visualization and recording.", category: "audio", icon: "🎤", popular: true },
  { slug: "speaker-test", title: "Speaker Test", shortTitle: "Speakers", description: "Test your speakers with stereo audio output and volume detection.", category: "audio", icon: "🔊" },
  { slug: "headphone-test", title: "Headphone Test", shortTitle: "Headphones", description: "Test headphones with channel detection, balance, and audio quality check.", category: "audio", icon: "🎧" },

  // Gamepad
  { slug: "controller-test", title: "Controller/Gamepad Test", shortTitle: "Controller", description: "Test your gamepad or controller connection and basic input detection.", category: "gamepad", icon: "🎮" },
  { slug: "gamepad-buttons", title: "Gamepad Buttons Test", shortTitle: "GP Buttons", description: "Test all gamepad buttons with real-time visual feedback.", category: "gamepad", icon: "🎮" },
  { slug: "analog-stick-test", title: "Analog Stick Test", shortTitle: "Analog Sticks", description: "Test analog stick drift, dead zones, and full range of motion.", category: "gamepad", icon: "🕹️" },
  { slug: "trigger-test", title: "Trigger Test", shortTitle: "Triggers", description: "Test analog trigger pressure sensitivity and range.", category: "gamepad", icon: "🎯" },
];

export function getTestBySlug(slug: string): TestInfo | undefined {
  return ALL_TESTS.find((t) => t.slug === slug);
}

export function getRelatedTests(slug: string, limit = 4): TestInfo[] {
  const test = getTestBySlug(slug);
  if (!test) return ALL_TESTS.slice(0, limit);
  return ALL_TESTS.filter((t) => t.slug !== slug && t.category === test.category).slice(0, limit);
}

export function getTestsByCategory(category: TestInfo["category"]): TestInfo[] {
  return ALL_TESTS.filter((t) => t.category === category);
}
