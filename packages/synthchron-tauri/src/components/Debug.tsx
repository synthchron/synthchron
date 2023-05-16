import { usePersistentStore } from './common/persistentStore'

export const Debug = () => {
  const projects = usePersistentStore((state) => state.projects)
  const removeProject = usePersistentStore((state) => state.removeProject)

  return (
    <>
      <div>This is the first div</div>
      <div>This is the second div</div>
      <div>This is the third div</div>
      This is the fourth but not a div!
    </>
  )
}
