import { petriNetEngine } from "./process-engines/petrinet-engine"
import { Configuration, ProcessEngine, SimulationResult, TerminationStatus, Trace } from "./types/general"
import { ProcessModel } from "./types/processModel"


export const simulate = (processModel: ProcessModel, configuration: Configuration): SimulationResult => {
    switch (processModel.type) {
        case 'petri-net':
            return simulateWithEngine(processModel, configuration, petriNetEngine)
        case 'dcr-graph':
            throw new Error('Not implemented');
        case 'flowchart':
            throw new Error('Not implemented');
    }
}

const simulateWithEngine = (processModel: ProcessModel, configuration: Configuration, processEngine: ProcessEngine<any, any, any>): SimulationResult => {
    const trace: Trace = {
        events: []
    }
    
    let state = processEngine.resetActivity(processModel)

    let terminationReason = checkTermination(processModel, configuration, state, processEngine, trace)
    

    while (!terminationReason.termination) {
        const enabledActivities = processEngine.getEnabled(processModel, state)
        const activity = enabledActivities.keys().next().value[0] // TODO: Add random selection
        state = processEngine.executeActivity(processModel, state, activity)
        trace.events.push({
            name: activity,
            meta: {}
        })
        terminationReason = checkTermination(processModel, configuration, state, processEngine, trace)
    }

    return {
        trace,
        exitReason: terminationReason.reason
    }

}

const checkTermination = (processModel: ProcessModel, configuration: Configuration, state: any, processEngine: ProcessEngine<any, any, any>, trace: Trace): TerminationStatus => {

    // Check if the process is accepting (and the minimum number of events has been reached)
    if (configuration.endOnAcceptingState && (configuration.minEvents === undefined || configuration.minEvents <= trace.events.length) && processEngine.isAccepting(processModel, state)) return {
        termination: true,
        reason: 'acceptingStateReached'
    }

    // Check if the maximum number of events has been reached
    if (configuration.maxEvents !== undefined && trace.events.length >= configuration.maxEvents) return {
        termination: true,
        reason: 'maxStepsReached'
    }

    // Check if there are no enabled activities
    if (processEngine.getEnabled(processModel, state).size === 0) return {
        termination: true,
        reason: 'noEnabledActivities'
    }

    // Otherwise, continue
    return {
        termination: false
    }

}

