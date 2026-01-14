
import React from 'react';
import { SkillTrack } from './types';

export const TRACK_COLORS = {
  [SkillTrack.TECH]: {
    primary: 'blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    accent: 'bg-blue-600'
  },
  [SkillTrack.TRADES]: {
    primary: 'orange-600',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    accent: 'bg-orange-600'
  },
  [SkillTrack.CREATIVE]: {
    primary: 'purple-600',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    accent: 'bg-purple-600'
  }
};

export const MOCK_STUDENT_DATA = {
  id: 's1',
  name: 'Alex Johnson',
  track: SkillTrack.TECH,
  skills: [
    { name: 'Web Development', level: 75, track: SkillTrack.TECH },
    { name: 'UI/UX Design', level: 40, track: SkillTrack.TECH },
    { name: 'Carpentry', level: 10, track: SkillTrack.TRADES },
    { name: 'Digital Art', level: 60, track: SkillTrack.CREATIVE },
  ]
};
