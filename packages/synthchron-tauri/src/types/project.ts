import { ProcessModel } from '@synthchron/simulator'

export type Project = {
  // Name of the project
  projectName: string

  // Description of the project
  projectDescription: string

  // The process model, also containing the model type
  projectModel: ProcessModel

  // When the project was created.
  created: string

  // When the data has last been saved
  lastEdited: string
}
