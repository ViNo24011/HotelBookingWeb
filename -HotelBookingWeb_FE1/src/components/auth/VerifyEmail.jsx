import React, { useState } from "react"
import { verifyEmail } from "../utils/ApiFunctions"
import { useNavigate, useLocation } from "react-router-dom"

const VerifyEmail = () => {
	const [code, setCode] = useState("")
	const [message, setMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const navigate = useNavigate()
	const location = useLocation()
	const email = location.state?.email

	const handleVerify = async (e) => {
		e.preventDefault()
		if (!email) {
			setErrorMessage("Email not found. Please try registering again.")
			return
		}
		try {
			const result = await verifyEmail(email, code)
			const successMessage = typeof result === "string" ? result : (result?.message || "Email verified successfully! Redirecting to home...")
			setMessage(successMessage)
			setErrorMessage("")
			setTimeout(() => {
				navigate("/login")
			}, 2000)
		} catch (error) {
			const errorMessage = error.response?.data?.message || error.message || "An error occurred during verification."
			setErrorMessage(errorMessage)
		}
	}

	return (
		<section className="container col-6 mt-5 mb-5">
			<div className="card p-5 mt-5 shadow" style={{ backgroundColor: "whitesmoke" }}>
				{errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
				{message && <p className="alert alert-success">{message}</p>}

				<h2 className="text-center mb-4">Email Verification</h2>
				<p className="text-center text-info mb-4">
					A verification code has been sent to <strong>{email}</strong>
				</p>
				<form onSubmit={handleVerify}>
					<div className="mb-3">
						<label htmlFor="code" className="form-label">
							Enter Verification Code
						</label>
						<input
							required
							type="text"
							className="form-control"
							id="code"
							name="code"
							value={code}
							onChange={(e) => setCode(e.target.value)}
							placeholder="Enter the code sent to your email"
						/>
					</div>

					<div className="d-grid gap-2">
						<button type="submit" className="btn btn-hotel">
							Verify Email
						</button>
					</div>
				</form>
			</div>
		</section>
	)
}

export default VerifyEmail
