export interface PlaqueModel {
  id?: number;
  identifier?: number;
  donorFirstName: string;
  donorLastName: string;
  honoreeFirstName: string;
  honoreeLastName: string;
  plaqueText: string;
  plaqueHtmlText?: string;
  projectId?: number;
  projectName?: string;
}
