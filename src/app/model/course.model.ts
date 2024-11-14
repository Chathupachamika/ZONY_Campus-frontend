export interface Course {
    courseId: number;
    courseName: string;
    subjects: string;
    courseFee: number;
    description: string;
    courseImageName: string;
    courseImageType: string;
    courseImageData: Blob | null;
  }