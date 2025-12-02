import React from 'react';
import { Clock, BookOpen, ChevronRight, BarChart } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/10 group flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-md text-xs font-bold ${
            course.level === 'Beginner' ? 'bg-green-500/20 text-green-300' :
            course.level === 'Intermediate' ? 'bg-blue-500/20 text-blue-300' :
            'bg-purple-500/20 text-purple-300'
          }`}>
            {course.level}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
          {course.title}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-700/50 pt-4 mt-auto">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {course.duration}
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {course.modules} Modules
          </div>
        </div>
        
        <button className="mt-4 w-full py-2 bg-slate-700 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 group-hover/btn:gap-2">
          View Curriculum <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
