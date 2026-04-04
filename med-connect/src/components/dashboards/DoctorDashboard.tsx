"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
  reason?: string;
  notes?: string;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  dateOfBirth?: string | null;
  bloodGroup?: string | null;
}

interface DoctorDashboardProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
  pending: { bg: "bg-amber-100", text: "text-amber-700", icon: "⏳" },
  confirmed: { bg: "bg-blue-100", text: "text-blue-700", icon: "✓" },
  completed: { bg: "bg-emerald-100", text: "text-emerald-700", icon: "✓✓" },
  cancelled: { bg: "bg-red-100", text: "text-red-700", icon: "✗" },
};

export function DoctorDashboard({ user }: DoctorDashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"appointments" | "patients">("appointments");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    today: 0,
    upcoming: 0,
    completed: 0,
    totalPatients: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/appointments?userId=${user.id}&role=doctor`);
      const data = await res.json();
      if (data.appointments) {
        setAppointments(data.appointments);
        updateStats(data.appointments);
      }
      if (data.patients) {
        setPatients(data.patients);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (appts: Appointment[]) => {
    const today = new Date().toISOString().split("T")[0];
    const uniquePatientIds = new Set(appts.map(a => a.patientId));
    setStats({
      today: appts.filter((apt) => apt.date === today).length,
      upcoming: appts.filter((apt) => apt.date >= today && (apt.status === "confirmed" || apt.status === "pending")).length,
      completed: appts.filter((apt) => apt.status === "completed").length,
      totalPatients: uniquePatientIds.size,
    });
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    setUpdatingId(appointmentId);
    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = appointments.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        );
        setAppointments(updated);
        updateStats(updated);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab === "appointments") return true;
    return false;
  });

  const getStatusBadge = (status: string) => {
    const colors = statusColors[status] || statusColors.pending;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
        <span className="mr-1">{colors.icon}</span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-teal-500 via-cyan-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-teal-500/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Good day, Dr. {user.name}!
            </h2>
            <p className="text-teal-100 text-lg">
              Manage your appointments and patient schedule
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-teal-100">Access Level</p>
              <p className="font-bold">Doctor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Profile Button */}
      <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300 flex items-center justify-center space-x-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span>Complete Your Profile as a Doctor</span>
      </button>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-linear-to-br from-teal-500 to-teal-600 text-white border-0 shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium">Today</p>
              <p className="text-4xl font-bold mt-1">{stats.today}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-cyan-500 to-cyan-600 text-white border-0 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm font-medium">Upcoming</p>
              <p className="text-4xl font-bold mt-1">{stats.upcoming}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Completed</p>
              <p className="text-4xl font-bold mt-1">{stats.completed}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Patients</p>
              <p className="text-4xl font-bold mt-1">{stats.totalPatients}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab("appointments")}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === "appointments"
              ? "bg-teal-600 text-white shadow-lg"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Appointments
        </button>
        <button
          onClick={() => setActiveTab("patients")}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === "patients"
              ? "bg-teal-600 text-white shadow-lg"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          My Patients
        </button>
      </div>

      {/* Appointments Section */}
      {activeTab === "appointments" && (
        <Card className="overflow-hidden shadow-lg border-0">
          <div className="bg-linear-to-r from-teal-600 to-cyan-700 px-6 py-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">Your Appointments</h3>
                <p className="text-teal-100 text-sm">View and manage patient appointments</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-slate-500">Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No appointments found</h3>
              <p className="text-slate-500">You don&apos;t have any appointments yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-linear-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-teal-500/30">
                        {apt.patientName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-lg">{apt.patientName}</p>
                        <p className="text-slate-500 text-sm">{apt.patientEmail}</p>
                        {apt.reason && (
                          <p className="text-slate-600 text-sm mt-1">
                            <span className="font-medium">Reason:</span> {apt.reason}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end space-y-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-slate-100 rounded-lg px-3 py-1.5">
                          <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium text-slate-700">{apt.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-slate-100 rounded-lg px-3 py-1.5">
                          <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-slate-700">{apt.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(apt.status)}
                        {apt.status === "pending" && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleStatusUpdate(apt.id, "confirmed")}
                              disabled={updatingId === apt.id}
                              className="px-3 py-1 bg-emerald-500 text-white text-xs rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors font-medium"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(apt.id, "cancelled")}
                              disabled={updatingId === apt.id}
                              className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {apt.status === "confirmed" && (
                          <button
                            onClick={() => handleStatusUpdate(apt.id, "completed")}
                            disabled={updatingId === apt.id}
                            className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors font-medium"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Patients Section */}
      {activeTab === "patients" && (
        <Card className="overflow-hidden shadow-lg border-0">
          <div className="bg-linear-to-r from-purple-600 to-purple-700 px-6 py-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">Your Patients</h3>
                <p className="text-purple-100 text-sm">Patients assigned to you</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-slate-500">Loading patients...</p>
            </div>
          ) : patients.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No patients found</h3>
              <p className="text-slate-500">You don&apos;t have any patients yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Patient</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date of Birth</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Blood Group</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-linear-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {patient.name?.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-semibold text-slate-800">{patient.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-600">{patient.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-600">{patient.dateOfBirth || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          {patient.bloodGroup || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
