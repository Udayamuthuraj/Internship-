import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const ChartCard = ({ title, data = [] }) => {
  const totalStats = useMemo(() => {
    const totalStudents = data.reduce((sum, item) => sum + (item.students || 0), 0);
    const totalAlumni = data.reduce((sum, item) => sum + (item.alumni || 0), 0);
    return { totalStudents, totalAlumni };
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.5 }}
      className="w-full p-5 rounded-2xl shadow-xl bg-[#FFE9D4] border border-[#EEC8B9] transition-transform duration-300"
      role="region"
      aria-label={`${title} Bar Chart`}
    >
      {/* Title */}
      <h3 className="text-xl font-bold text-[#930911] mb-5 text-center tracking-wide">
        {title}
      </h3>

      {/* Chart */}
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} barGap={8} barCategoryGap={20}>
            <defs>
              <linearGradient id="studentsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EEC8B9" />
                <stop offset="100%" stopColor="#E4A39D" />
              </linearGradient>
              <linearGradient id="alumniGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#930911" />
                <stop offset="100%" stopColor="#BA3D47" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#EEC8B9" vertical={false} />
            <XAxis
              dataKey="department"
              tick={{ fontSize: 13, fill: "#930911" }}
              axisLine={{ stroke: "#930911" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 13, fill: "#930911" }}
              axisLine={{ stroke: "#930911" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#930911",
                borderRadius: "8px",
                border: "1px solid #FFE9D4",
                fontSize: "13px",
                color: "#FFE9D4",
              }}
              labelStyle={{
                fontWeight: "bold",
                color: "#FFFFFF",
              }}
              formatter={(value, name) => [
                value,
                name === "students" ? "Students" : name === "alumni" ? "Alumni" : name,
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              iconType="circle"
              formatter={(value) => (
                <span style={{ color: "#930911", fontWeight: "500" }}>{value}</span>
              )}
            />
            <Bar
              dataKey="students"
              name="Students"
              radius={[6, 6, 0, 0]}
              barSize={40}
              fill="url(#studentsGradient)"
            />
            <Bar
              dataKey="alumni"
              name="Alumni"
              radius={[6, 6, 0, 0]}
              barSize={40}
              fill="url(#alumniGradient)"
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-sm text-gray-600 text-center mt-10">No data available</p>
      )}

      {/* Summary */}
      {data.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center items-center gap-6 text-sm font-medium text-[#930911]">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: "linear-gradient(#EEC8B9, #E4A39D)" }}
            />
            Students: {totalStats.totalStudents}
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: "linear-gradient(#930911, #BA3D47)" }}
            />
            Alumni: {totalStats.totalAlumni}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ChartCard;
