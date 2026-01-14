
import { Project, User, UserRole, SkillTrack } from '../types';

const STORAGE_KEY_PROJECTS = 'more_v2_projects';
const STORAGE_KEY_USER = 'more_v2_user';

export class StorageService {
  static getProjects(): Project[] {
    const data = localStorage.getItem(STORAGE_KEY_PROJECTS);
    return data ? JSON.parse(data) : [
        { id: '1', title: 'Smart Garden System', description: 'IoT based automated watering system', track: SkillTrack.TECH, status: 'GRADED', grade: 'A', imageUrl: 'https://picsum.photos/seed/garden/400/300', timestamp: Date.now() - 172800000 },
        { id: '2', title: 'Modern Bookshelf', description: 'White oak bookshelf with hidden joints', track: SkillTrack.TRADES, status: 'SUBMITTED', imageUrl: 'https://picsum.photos/seed/shelf/400/300', timestamp: Date.now() - 18000000 }
    ];
  }

  static saveProject(project: Project) {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index > -1) {
      projects[index] = project;
    } else {
      projects.push(project);
    }
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  }

  static deleteProject(id: string) {
    const projects = this.getProjects().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  }

  static getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEY_USER);
    return data ? JSON.parse(data) : null;
  }

  static login(email: string, role: UserRole): User {
    const user: User = {
      id: 'u1',
      name: email.split('@')[0],
      email,
      role,
      track: SkillTrack.TECH,
      skills: [
        { name: 'Logic & Circuits', level: 82, track: SkillTrack.TECH },
        { name: 'Carpentry Basics', level: 45, track: SkillTrack.TRADES },
        { name: 'Visual Theory', level: 60, track: SkillTrack.CREATIVE }
      ]
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    return user;
  }

  static logout() {
    localStorage.removeItem(STORAGE_KEY_USER);
  }
}
