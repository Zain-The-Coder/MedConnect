"use client";
import React, { useState } from 'react';

export default function PatientForm() {
  const [formData, setFormData] = useState({ dateOfBirth: '', bloodGroup: '', allergies: '', medicalHistory: '' });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Patient Data submitted:", formData);
    alert("Form saved locally, Now Pull request send.");
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="max-w-xl mx-auto my-10 p-5">
      <div className="bg-white border rounded-lg p-6 shadow-md text-black">
        <h2 className="text-xl font-bold mb-1">Patient Profile</h2>
        <p className="text-gray-500 text-sm mb-6">Please fill in your medical details accurately.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth </label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Blood Group </label>
            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required>
              <option value="">Select Blood Group</option>
              {bloodGroups.map((bg) => (<option key={bg} value={bg}>{bg}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Allergies (if any)</label>
            <input type="text" name="allergies" placeholder="e.g., Peanuts, Dust" value={formData.allergies} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Medical History</label>
            <textarea name="medicalHistory" placeholder="Describe past conditions..." value={formData.medicalHistory} onChange={handleChange} rows={3} className="w-full mt-1 p-2 border rounded-md"></textarea>
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 font-medium mt-2">Save Profile Details</button>
        </form>
      </div>
    </div>
  );
}