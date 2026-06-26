import React, { useState } from "react"
import { changePassword } from "../utils/ApiFunctions"
import { useNavigate } from "react-router-dom"

const ChangePassword = () => {
	const [passwords, setPasswords] = useState({
		oldPassword: "",
		newPassword: "",
		confirmNewPassword: ""
	})

	const [message, setMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const navigate = useNavigate()

	const userId = localStorage.getItem("userId")

	const handleInputChange = (e) => {
		setPasswords({ ...passwords, [e.target.name]: e.target.value })
	}

	const handleChangePassword = async (e) => {
		e.preventDefault()
		if (passwords.newPassword !== passwords.confirmNewPassword) {
			setErrorMessage("New passwords do not match")
			return
		}

		try {
			const result = await changePassword(userId, {
				oldPassword: passwords.oldPassword,
				newPassword: passwords.newPassword
			})
			setMessage(result)
			setErrorMessage("")
			setPasswords({ oldPassword: "", newPassword: "", confirmNewPassword: "" })
			setTimeout(() => {
				navigate("/profile")
			}, 3000)
		} catch (error) {
			setErrorMessage(error.message)
		}
	}

	return (
		<section className="container col-6 mt-5 mb-5">
			{errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
			{message && <p className="alert alert-success">{message}</p>}

			<h2>Change Password</h2>
			<form onSubmit={handleChangePassword}>
				<div className="mb-3">
					<label htmlFor="oldPassword" className="form-label">
						Current Password
					</label>
					<input
						required
						type="password"
						className="form-control"
						id="oldPassword"
						name="oldPassword"
						value={passwords.oldPassword}
						onChange={handleInputChange}
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="newPassword" className="form-label">
						New Password
					</label>
					<input
						required
						type="password"
						className="form-control"
						id="newPassword"
						name="newPassword"
						value={passwords.newPassword}
						onChange={handleInputChange}
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="confirmNewPassword" className="form-label">
						Confirm New Password
					</label>
					<input
						required
						type="password"
						className="form-control"
						id="confirmNewPassword"
						name="confirmNewPassword"
						value={passwords.confirmNewPassword}
						onChange={handleInputChange}
					/>
				</div>

				<button type="submit" className="btn btn-hotel">
					Change Password
				</button>
			</form>
		</section>
	)
}

export default ChangePassword
