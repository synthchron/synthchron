import { useStore } from 'reactflow'
import { AwarenessState, useFlowStore } from './ydoc/flowStore'
import GpsFixedIcon from '@mui/icons-material/GpsFixed'

export const AwarenessCursors = () => {
  const collaboratorStates = useFlowStore((state) => state.collaboratorStates)

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
          .filter((state) => state.user && state.user.y && state.user.x)
          .map((state: AwarenessState, idx) => {
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
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <GpsFixedIcon htmlColor={state.user.color} />
              </div>
            )
          })}
    </div>
  )
}
