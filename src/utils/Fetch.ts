export const Fetch = async (url: string) => {
  const response = await fetch("http://localhost:4321" + url)
  const data = await response.json()

  return data
}
