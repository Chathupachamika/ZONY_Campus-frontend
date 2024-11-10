import { Lecturer } from '../model/lecturers.model'; // Ensure you import the Lecturer model

export interface Faculty {
  faculty_id: number;            // ID of the faculty
  name: string;                  // Faculty name
  description: string;           // Description of the faculty
  specializations: string;       // Specializations within the faculty
  icon: string;                  // Icon URL or icon class for the faculty
  facImageData: string;          // Image data for faculty representation
  subjects?: string[];           // Optional array of subjects offered
  lecturers?: Lecturer[];        // Optional array of lecturers associated with the faculty
}
