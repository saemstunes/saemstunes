import React from "react";
import { motion } from "framer-motion";

interface PillNavProps {
  items: { id: string; label: string }[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}

const PillNav = ({ items, activeId, onSelect, className = "" }: PillNavProps) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <motion.button
          key={item.id}
          className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeId === item.id
              ? "text-white"
              : "text-muted-foreground hover:text-brown"
          }`}
          onClick={() => onSelect(item.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {activeId === item.id && (
            <motion.div
              className="absolute inset-0 bg-gold rounded-full z-0"
              layoutId="pillNavActive"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            />
          )}
          <span className="relative z-10">{item.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default PillNav;
