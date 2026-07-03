import { motion } from "framer-motion";

// Dashboard summary card with an icon, label, value, and accent color.
const colorMap = {
  green: "bg-primary-50 text-primary-600",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  purple: "bg-pink-50 text-pink-600",
  red: "bg-red-50 text-red-600",
};

export default function StatCard({ icon: Icon, label, value, accent = "green", index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ink-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-ink-800">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[accent]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}
