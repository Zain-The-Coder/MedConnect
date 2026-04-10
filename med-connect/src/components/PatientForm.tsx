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
    <div className="w-full shadow-lg rounded-2xl overflow-hidden border-0 bg-white">
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold">Patient Profile</h3>
            <p className="text-blue-100 text-sm">Please fill in your medical details accurately</p>
          </div>
        </div>
      </div>

      <div className="p-6 text-black">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Blood Group</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required>
                <option value="">Select Blood Group</option>
                {bloodGroups.map((bg) => (<option key={bg} value={bg}>{bg}</option>))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Allergies (if any)</label>
            <input type="text" name="allergies" placeholder="e.g., Peanuts, Dust" value={formData.allergies} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Medical History</label>
            <textarea name="medicalHistory" placeholder="Describe past conditions..." value={formData.medicalHistory} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"></textarea>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 mt-2">
            Save Profile Details
          </button>
        </form>
      </div>
    </div>
  );
}