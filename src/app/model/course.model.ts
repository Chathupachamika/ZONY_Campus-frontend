export interface Course {
  courseId: number;
  courseName: string;
  subjects: string;
  courseFee: number;
  fulDetails: string;
  description: string;
  courseImageName: string;
  courseImageType: string;
  courseImageData: Blob | null;
  isEditing?: boolean;
}