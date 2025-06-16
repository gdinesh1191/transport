import React from "react";
import { validateForm } from "@/app/utils/formValidations";

export default function Login() {
  return (
    <div className="bg-gray-100 flex flex-col justify-center min-h-screen">
      <div className="flex justify-center px-4">
        <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Login</h2>
          <form className="space-y-5">
            <div>
              <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                autoComplete="username"
                className="form-control"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                className="form-control"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-sm btn-primary w-full mt-4"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 mt-6 px-4">
        <p className="mb-1">
          © 2023, Infogreen Cloud Solutions. All Rights Reserved.
        </p>
        <p>
          By continuing, you agree to the{" "}
          <a href="#" className="underline hover:text-blue-600">Infogreen Customer Agreement</a> or other agreement
          for Infogreen services, and the{" "}
          <a href="#" className="underline hover:text-blue-600">Privacy Notice</a>.
          This site uses essential cookies. See our{" "}
          <a href="#" className="underline hover:text-blue-600">Cookie Notice</a> for more information.
        </p>
      </footer>
    </div>
  );
}
