"use client";
import React, { useState } from 'react';
import { saveDoctorProfile } from '@/actions/doctorAction'; 

export default function DoctorProfileForm() {
  const [loading, setLoading] = useState(false);
  const [frmDta, setfrmDta] = useState({
    specialization: '',
    qualifications: '',
    experience: '',
    fee: '',
    isAvailable: true
  });

  const hndlechnge = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setfrmDta({ ...frmDta, [e.target.name]: value });
  };

  const hndlesbmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await saveDoctorProfile(frmDta);

    if (result.success) {
      alert("Profile saved successfully!");
    } else {
      alert("Error saving profile");
    }
    setLoading(false);
  };

  const specializations = [
    "General Physician", "Cardiologist", "Dermatologist", 
    "Neurologist", "Pediatrician", "Psychiatrist", 
    "Orthopedic", "Gynecologist"
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-10 px-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">Doctor Profile</h2>
          <p className="text-blue-100 text-sm opacity-90 font-medium">Enter your professional details for your profile</p>
        </div>

        <form onSubmit={hndlesbmit} className="p-8 space-y-5">
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Specialization</label>
            <select 
              name="specialization" 
              value={frmDta.specialization} 
              onChange={hndlechnge} 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all duration-200 text-slate-700"
              required
            >
              <option value="">Select Specialization</option>
              {specializations.map((spec) => (<option key={spec} value={spec}>{spec}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Qualifications</label>
            <input 
              type="text" 
              name="qualifications" 
              placeholder="e.g. MBBS, FCPS"
              value={frmDta.qualifications} 
              onChange={hndlechnge} 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all duration-200 text-slate-700" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Experience (Years)</label>
              <input 
                type="number" 
                name="experience" 
                placeholder="Years"
                value={frmDta.experience} 
                onChange={hndlechnge} 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all duration-200 text-slate-700" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Fee (PKR)</label>
              <input 
                type="number" 
                name="fee" 
                placeholder="Rs."
                value={frmDta.fee} 
                onChange={hndlechnge} 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all duration-200 text-slate-700" 
                required 
              />
            </div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
            <input 
              type="checkbox" 
              name="isAvailable" 
              id="isAvailable"
              checked={frmDta.isAvailable} 
              onChange={hndlechnge} 
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
            />
            <label htmlFor="isAvailable" className="ml-3 block text-sm font-medium text-blue-800 cursor-pointer">
              I am available for appointments
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-xl font-bold shadow-lg mt-2 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Profile Details"}
          </button>
        </form>
      </div>
    </div>
  );
}