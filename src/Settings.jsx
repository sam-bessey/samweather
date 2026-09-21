import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import Card from "./Ui.jsx";
import { User, X } from "lucide-react";

function PersonalityCard() {
    // Get initial value from localstorage
    const [selectedValue, setSelectedValue] = useState(() => {
        const saved = localStorage.getItem("personality");
        return saved !== null ? saved : "Default";
    });

    // Save to localStorage whenever selectedValue changes
    useEffect(() => {
        localStorage.setItem("personality", selectedValue);
    }, [selectedValue]);

    return (
        <Card
            title="Personality"
            titleIcon={<User />}
            cardClass="backdrop-blur-3xl!"
        >
            <select
                onChange={(e) => setSelectedValue(e.target.value)}
                value={selectedValue}
            >
                <option>Default</option>
                <option>Conscise</option>
            </select>
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
            <PersonalityCard />{" "}
        </div>
    );
}
