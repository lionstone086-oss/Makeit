
import React from 'react';
import { Skill, SkillTrack } from '../types';
import { TRACK_COLORS } from '../constants';
import { Award } from 'lucide-react';

interface SkillPassportProps {
  skills: Skill[];
}

const SkillPassport: React.FC<SkillPassportProps> = ({ skills }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">Skills Passport</h2>
        <Award className="w-5 h-5 text-blue-600" />
      </div>
      <div className="space-y-6">
        {skills.map((skill, index) => {
          const colors = TRACK_COLORS[skill.track];
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">{skill.name}</span>
                <span className={`${colors.text} font-bold`}>{skill.level}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${colors.accent} transition-all duration-1000 ease-out`}
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3">
        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
            <p className="text-xs text-blue-600 font-bold uppercase">Tracks</p>
            <p className="text-xl font-bold text-blue-700">Tech</p>
        </div>
        <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
            <p className="text-xs text-indigo-600 font-bold uppercase">Badges</p>
            <p className="text-xl font-bold text-indigo-700">12</p>
        </div>
      </div>
    </div>
  );
};

export default SkillPassport;
