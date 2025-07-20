import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
export const SchedulePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({
    length: daysInMonth
  }, (_, i) => i + 1);
  const emptyCells = Array.from({
    length: firstDayOfMonth
  }, (_, i) => i);
  const events = [{
    date: 5,
    title: "Team Meeting",
    time: "10:00 AM"
  }, {
    date: 12,
    title: "Project Review",
    time: "2:00 PM"
  }, {
    date: 15,
    title: "Client Call",
    time: "11:30 AM"
  }];
  return <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Schedule</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Event</span>
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h2 className="text-lg font-medium">
              {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric"
            })}
            </h2>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => <div key={day} className="bg-gray-50 p-4 text-center text-sm font-medium">
              {day}
            </div>)}
          {emptyCells.map(i => <div key={`empty-${i}`} className="bg-white p-4 min-h-[120px]" />)}
          {days.map(day => <div key={day} className="bg-white p-4 min-h-[120px] hover:bg-gray-50">
              <div className="font-medium mb-2">{day}</div>
              {events.filter(event => event.date === day).map((event, i) => <div key={i} className="text-sm p-2 bg-blue-50 text-blue-700 rounded mb-1">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs text-blue-600">{event.time}</div>
                  </div>)}
            </div>)}
        </div>
      </div>
    </div>;
};