import { useStore } from 'reactflow'
import { useFlowStore } from './ydoc/flowStore'

export const AwarenessCursors = () => {
  const collaboratorStates = useFlowStore((state) => state.collaboratorStates)
  const awarenessState = useFlowStore((state) => state.awarenessState)

  const transform = useStore((store) => store.transform)

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {collaboratorStates &&
        Array.from(collaboratorStates.values())
          .filter((state) => state.user.y && state.user.x)
          .filter((state) => state.user.name !== awarenessState?.user?.name)
          .map((state: any, idx) => {
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  top: state.user.y * transform[2] + transform[1],
                  left: state.user.x * transform[2] + transform[0],
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: 'red',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            )
          })}
    </div>
  )
}
