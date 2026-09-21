// This is some ui things I might want to use in multiple pages here

import { motion } from "motion/react";
import { useState } from "react";
import {
    ChevronRight,
    ChevronUp,
} from "lucide-react";
import "./styles.css";


export default function Card({
    title,
    titleIcon,
    cardClass = "",
    allowExpand = false,
    expandedContent = "",
    titleAction = "",
    children,
}) {
    /* Use this for cards in the UI
    title: Title of the card. For example, "Hourly"
    titleIcon: Icon for the title bar next to the card.
    cardClass: Optional, use to add a class to the content of the card itself (not card title). Consider adding ! to the end of the tailwind className if needed.
    allowExpand: Should there be more content in the card that can be expanded?
    expandedContent: If allowing expand, what content should be shown when card is expanded?
    titleAction: Optional, something like dropdown menu to put in the title of the Card, all the way to the right side.
    */
    const [expanded, setExpanded] = useState(false);
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5 },
                },
            }}
            className="flex flex-col bg-gray-200/10 dark:bg-gray-900/10 w-auto h-auto overflow-y-scroll rounded-3xl backdrop-blur-[10px] m-3"
        >
            <div className="flex w-full text-gray-800 dark:text-gray-300 pt-3 px-3 justify-between">
                <div className="flex">
                    <div className="scale-80 mt-0.5">{titleIcon}</div>
                    <h2 className="text-[1px] ml-2">{title}</h2>
                </div>
                <div>{titleAction}</div>
            </div>
            <div className={"mt-2 px-5 pb-5 " + cardClass}>{children}</div>
            <>
                {allowExpand && (
                    <div>
                        <button
                            className=" mx-5 text-left"
                            onClick={() => setExpanded((prev) => !prev)}
                        >
                            {expanded ? (
                                <div className="flex">
                                    <p className="mr-2">Less </p>
                                    <ChevronUp />
                                </div>
                            ) : (
                                <div className="flex">
                                    <p className="mr-2 mb-3">More </p>
                                    <ChevronRight />
                                </div>
                            )}
                        </button>
                        <div>
                            {expanded && (
                                <div className={"mt-2 px-5 pb-5 " + cardClass}>
                                    {expandedContent}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </>
        </motion.div>
    );
}