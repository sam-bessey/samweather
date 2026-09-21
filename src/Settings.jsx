import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import Card from "./Ui.jsx";
import { User } from "lucide-react";
export default function SettingsPage() {
    return (
        <div className="w-full h-full backdrop-blur-3xl z-999 absolute">
            <h1 className="p-5">Settings</h1>
            <Card
                title="Personality"
                titleIcon={<User />}
                cardClass="backdrop-blur-3xl!"
            >
                hi
            </Card>
        </div>
    );
}
