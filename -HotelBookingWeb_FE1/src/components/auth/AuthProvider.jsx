import React, { createContext, useState, useContext } from "react"
import jwt_decode from "jwt-decode"

export const AuthContext = createContext({
	user: null,
	handleLogin: (token) => {},
	handleLogout: () => {}
})

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)

	const handleLogin = (token, id, email, firstName, lastName) => {
		const decodedUser = jwt_decode(token)
		localStorage.setItem("userId", id || decodedUser.sub)
		localStorage.setItem("userEmail", email || decodedUser.sub)
		localStorage.setItem("userRole", decodedUser.roles)
		localStorage.setItem("firstName", firstName || "")
		localStorage.setItem("lastName", lastName || "")
		localStorage.setItem("token", token)
		setUser(decodedUser)
	}

	const handleLogout = () => {
		localStorage.removeItem("userId")
		localStorage.removeItem("userEmail")
		localStorage.removeItem("userRole")
		localStorage.removeItem("firstName")
		localStorage.removeItem("lastName")
		localStorage.removeItem("token")
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)
}

