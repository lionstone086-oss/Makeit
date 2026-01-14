
import React from 'react';
import SkillPassport from './SkillPassport';
import { MOCK_STUDENT_DATA, TRACK_COLORS } from '../constants';
import { Project, SkillTrack } from '../types';
import { Eye, TrendingUp, Calendar, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

const ParentPortal: React.FC = () => {
  const recentProjects: Project[] = [
    // Fix: Timestamps must be numbers to align with the Project interface
    { id: '1', title: 'Smart Garden System', description: 'IoT based automated watering system', track: SkillTrack.TECH, status: 'GRADED', grade: 'A', imageUrl: 'https://picsum.photos/seed/garden/400/300', timestamp: Date.now() - 172800000 },
    { id: '2', title: 'Modern Bookshelf', description: 'White oak bookshelf with hidden joints', track: SkillTrack.TRADES, status: 'SUBMITTED', imageUrl: 'https://picsum.photos/seed/shelf/400/300', timestamp: Date.now() - 18000000 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Parent Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
            <h2 className="text-3xl font-bold">Hello, Parent! 👋</h2>
            <p className="text-blue-100 text-lg">Alex is doing great in the <span className="font-bold">Tech & IoT Track</span> this week.</p>
            <div className="flex gap-4 pt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-300" />
                    <div>
                        <p className="text-[10px] uppercase font-bold text-blue-200">Skill Growth</p>
                        <p className="font-bold">+12% this month</p>
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-300" />
                    <div>
                        <p className="text-[10px] uppercase font-bold text-blue-200">Attendance</p>
                        <p className="font-bold">98.5%</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="w-full md:w-auto bg-white/20 p-6 rounded-2xl backdrop-blur-lg border border-white/30 text-center">
            <p className="text-sm font-medium mb-1">Upcoming Session</p>
            <p className="text-2xl font-black">Tomorrow, 4 PM</p>
            <p className="text-sm opacity-80">Robotics Lab #4</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <SkillPassport skills={MOCK_STUDENT_DATA.skills} />
        </div>

        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Alex's Recent Work</h3>
                <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">
                    View Full Portfolio <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4">
                {recentProjects.map(project => (
                    <div key={project.id} className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-shadow">
                        <img src={project.imageUrl} className="w-full md:w-48 h-32 object-cover rounded-xl" alt={project.title} />
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${TRACK_COLORS[project.track].bg} ${TRACK_COLORS[project.track].text} uppercase tracking-widest`}>
                                    {project.track}
                                </span>
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {new Date(project.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                            <h4 className="text-lg font-bold text-slate-900">{project.title}</h4>
                            <p className="text-sm text-slate-500 line-clamp-1">{project.description}</p>
                            <div className="flex items-center gap-3 pt-2">
                                {project.status === 'GRADED' ? (
                                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                                        Grade: {project.grade}
                                    </div>
                                ) : (
                                    <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-100 italic">
                                        Review in progress
                                    </div>
                                )}
                                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                    <Eye className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Insights for Parents */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                        ✨
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">AI Parent Report</h3>
                        <p className="text-xs text-slate-500">Personalized insight for Alex Johnson</p>
                    </div>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">
                    Alex has shown exceptional progress in "Web Development" logic this month. We recommend encouraging more "Hands-on Woodworking" as a creative break, as it seems to refresh their focus for tech sessions.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Strength</p>
                        <p className="font-bold text-slate-800 text-sm">System Logic</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Opportunity</p>
                        <p className="font-bold text-slate-800 text-sm">Public Speaking</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ParentPortal;
