import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import Card from "./Ui.jsx";
import { User, X } from "lucide-react";

function PersonalityCard() {
    // Get initial value from localstorage
    const [selectedPersonality, setSelectedPersonality] = useState(() => {
        const saved = localStorage.getItem("personality");
        return saved !== null ? saved : "Default";
    });

    // Save to localStorage whenever selectedValue changes
    useEffect(() => {
        localStorage.setItem("personality", selectedPersonality);
    }, [selectedPersonality]);

    return (
        <Card
            title="Personality"
            titleIcon={<User />}
            cardClass="backdrop-blur-3xl!"
        >
            <select
                onChange={(e) => setSelectedPersonality(e.target.value)}
                value={selectedPersonality}
            >
                <option>Default</option>
                <option>Conscise</option>
            </select>
        </Card>
    );
}

function ProCard() {
    // Get initial value from localstorage
    const [proEnabled, setProEnabled] = useState(() => {
        const saved = localStorage.getItem("pro");
        return saved !== null ? saved : "false";
    });

    // Save to localStorage whenever selectedValue changes
    useEffect(() => {
        localStorage.setItem("pro", proEnabled);
    }, [proEnabled]);

    return (
        <Card
            title="SamWeather Pro"
            titleIcon={<User />}
            cardClass="backdrop-blur-3xl!"
        >
            <p>Upgrade to SamWeather Pro for the best experience.</p>
            {proEnabled === "true" ? (
                <button
                    className="bg-gray-100/30 dark:bg-gray-900/30 m-2 p-2 rounded-xl"
                    onClick={() => setProEnabled("false")}
                >
                    Switch to normal version
                </button>
            ) : (
                <button
                    className="bg-linear-65 from-purple-400/40 to-pink-400/40 dark:from-purple-500/20 dark:to-pink-500/30 dark:bg-gray-900/30 m-2 p-2 rounded-xl"
                    onClick={() => setProEnabled("true")}
                >
                    Upgrade!
                </button>
            )}
        </Card>
    );
}

export default function SettingsPage({ setSettingsOpen }) {
    // This is the settings page
    // setSettingsOpen: To change state, used to close page
    return (
        <div className="w-full h-full backdrop-blur-3xl z-999 absolute">
            <div className="w-full flex items-center justify-between">
                <h1 className="p-5">Settings</h1>
                <X onClick={() => setSettingsOpen(false)} className="m-3" />
            </div>
            <PersonalityCard />
            <ProCard />
        </div>
    );
}
