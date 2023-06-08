export const exportStringAsFile = (str: string, filename: string) => {
  const element = document.createElement('a')
  const file = new Blob([str], {
    type: 'text/plain',
  })
  element.href = URL.createObjectURL(file)
  element.download = filename
  document.body.appendChild(element) // Required for this to work in FireFox
  element.click()
}
