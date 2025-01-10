export class Lecturer {
  lecturer_id: number = 0;
  lecturerName: string;
  lecturerExperience: string;
  lecturerDegrees: string;
  lecturerImageName?: string;
  lecturerImageType?: string;
  lecturerImageData?: string;
  facultyId?: number;

  constructor(
    lecturerName: string,
    lecturerExperience: string,
    lecturerDegrees: string,
    lecturerImageName?: string,
    lecturerImageType?: string,
    lecturerImageData?: string,
    facultyId?: number
  ) {
    this.lecturerName = lecturerName;
    this.lecturerExperience = lecturerExperience;
    this.lecturerDegrees = lecturerDegrees;
    this.lecturerImageName = lecturerImageName;
    this.lecturerImageType = lecturerImageType;
    this.lecturerImageData = lecturerImageData;
    this.facultyId = facultyId;
  }
}
