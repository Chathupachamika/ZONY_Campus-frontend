export class Program {
    programId: number;
    programName: string;
    programMission: string;
    programDetails: string;
    programVenue: string;
    programDateTime: Date;
    programImageName: string;
    programImageType: string;
    programImageData: string; 
  
    constructor(
      programId: number,
      programName: string,
      programMission: string,
      programDetails: string,
      programVenue: string,
      programDateTime: Date,
      programImageName: string,
      programImageType: string,
      programImageData: string
    ) {
      this.programId = programId;
      this.programName = programName;
      this.programMission = programMission;
      this.programDetails = programDetails;
      this.programVenue = programVenue;
      this.programDateTime = programDateTime;
      this.programImageName = programImageName;
      this.programImageType = programImageType;
      this.programImageData = programImageData;
    }
  }
  