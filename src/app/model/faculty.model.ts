import { Lecturer } from '../model/lecturers.model';

export interface Faculty {
  faculty_id: number;
  name: string;
  description: string;
  specializations: string;
  icon: string;
  facImageData: string;
  subjects?: string[];
  lecturers?: Lecturer[];
}
