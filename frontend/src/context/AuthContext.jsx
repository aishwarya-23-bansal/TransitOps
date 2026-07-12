import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('transitops_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = ({ email, role }) => {
    const nextUser = { email, role, name: email.split('@')[0] }
    setUser(nextUser)
    sessionStorage.setItem('transitops_user', JSON.stringify(nextUser))
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('transitops_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
