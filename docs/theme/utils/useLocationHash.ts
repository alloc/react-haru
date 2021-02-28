import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

export function useLocationHash(onHash: (hash: string) => void) {
  const history = useHistory()
  useEffect(() => {
    onHash(history.location.hash)
    return history.listen(location => {
      onHash(location.hash)
    })
  }, [])
}
