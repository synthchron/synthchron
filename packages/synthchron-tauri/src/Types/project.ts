import {ProcessModel} from "@synthchron/simulator/dist/src";

export type Project = {
	// Name of the project
	projectName: string,

	// The process model, also containing the model type
	projectModel: ProcessModel,

	// When the project was created.
	created: Date,

	// When the data has last been saved
	lastEdited: Date
}