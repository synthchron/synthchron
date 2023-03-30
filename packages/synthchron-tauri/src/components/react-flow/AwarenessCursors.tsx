import { useStore } from 'reactflow'
import { AwarenessState, useEditorStore } from './flowStore/flowStore'
import GpsFixedIcon from '@mui/icons-material/GpsFixed'

// This component is responsible for drawing the awareness cursors for each user in the editor.
// These cursors are drawn by creating a div for each user and setting the style of the div
// to position the cursor at the user's location in the editor.

export const AwarenessCursors = () => {
  const collaboratorStates = useEditorStore((state) => state.collaboratorStates)

  const transform = useStore((store) => store.transform)

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        // The cursors should not be interactable/clickable
        pointerEvents: 'none',
        // The cursors are on top of everything else in the editor
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
                  // Calculations for the absolute shared position of the cursor (independent of zoom and pan)
                  top: state.user.y * transform[2] + transform[1],
                  left: state.user.x * transform[2] + transform[0],
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* We're using a GPS icon for remote cursors. Feel free to change to something different. */}
                <GpsFixedIcon htmlColor={state.user.color} />
              </div>
            )
          })}
    </div>
  )
}
