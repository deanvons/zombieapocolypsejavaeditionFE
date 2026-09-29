import { useEffect, useRef } from 'react'
import keycloak from '../../keycloak'

// Resolves to .env.development in `npm run dev` and .env.production in `npm run build`
const API_URL = import.meta.env.VITE_API_URL

export default function CreateSurvivor() {
  // StrictMode runs effects twice in dev; this ref stops a duplicate POST
  const hasCreatedProfile = useRef(false)

  useEffect(() => {
    if (hasCreatedProfile.current) return
    hasCreatedProfile.current = true

    async function createProfile() {
      try {
        // Refresh the token if it expires within 30 seconds
        await keycloak.updateToken(30)

        const response = await fetch(`${API_URL}/api/profiles/me`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${keycloak.token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Create profile failed: ${response.status}`)
        }

        console.log('Profile created:', response.status)
      } catch (error) {
        console.error(error)
      }
    }

    createProfile()
  }, [])

  return (
    <div>
      
    </div>
  )
}
