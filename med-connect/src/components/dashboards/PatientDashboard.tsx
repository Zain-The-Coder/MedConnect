"use client";

import { useState, useEffect } from "react";
import { Card, Button } from "@/components";
import PatientForm from "../PatientForm";

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
}

interface Doctor {
  id: string;
  username: string;
  email: string;
  role: string;
  specialization?: string;
  fee?: number;
  isAvailable?: boolean;
}

interface PatientDashboardProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
  pending: { bg: "bg-amber-100", text: "text-amber-700", icon: "⏳" },
  confirmed: { bg: "bg-emerald-100", text: "text-emerald-700", icon: "✓" },
  completed: { bg: "bg-blue-100", text: "text-blue-700", icon: "✓✓" },
  cancelled: { bg: "bg-red-100", text: "text-red-700", icon: "✗" },
};

export function PatientDashboard({ user }: PatientDashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentForm, setAppointmentForm] = useState({
    date: "",
    time: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    pending: 0,
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`/api/appointments?userId=${user.id}&role=patient`);
      const data = await res.json();
      if (data.appointments) {
        setAppointments(data.appointments);
        
        const today = new Date().toISOString().split("T")[0];
        setStats({
          upcoming: data.appointments.filter((apt: Appointment) => apt.date >= today && apt.status === "confirmed").length,
          completed: data.appointments.filter((apt: Appointment) => apt.status === "completed").length,
          pending: data.appointments.filter((apt: Appointment) => apt.status === "pending").length,
        });
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/appointments?type=doctors");
      const data = await res.json();
      if (data.doctors) {
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleNewAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !appointmentForm.date || !appointmentForm.time) return;

    const doctor = doctors.find((d) => d.id === selectedDoctor);
    if (!doctor) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: user.id,
          doctorId: selectedDoctor,
          date: appointmentForm.date,
          time: appointmentForm.time,
          reason: appointmentForm.reason,
        }),
      });

      if (res.ok) {
        setShowNewAppointment(false);
        setAppointmentForm({ date: "", time: "", reason: "" });
        setSelectedDoctor("");
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
    } finally {
      setSubmitting(false);
    }
  };

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
      <div className="bg-linear-to-r from-blue-500 via-blue-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome, {user.name}!
            </h2>
            <p className="text-blue-100 text-lg">
              Manage your health appointments and records
            </p>
          </div>
          <button
            onClick={() => setShowNewAppointment(true)}
            className="flex items-center justify-center space-x-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-linear-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Upcoming</p>
              <p className="text-4xl font-bold mt-1">{stats.upcoming}</p>
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
              <p className="text-cyan-100 text-sm font-medium">Pending</p>
              <p className="text-4xl font-bold mt-1">{stats.pending}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-blue-400 to-blue-500 text-white border-0 shadow-lg shadow-blue-400/20 hover:shadow-xl hover:shadow-blue-400/30 transition-all duration-300 hover:-translate-y-1">
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
      </div>

      {/* Available Doctors Section */}
      <Card className="overflow-hidden shadow-lg border-0">
        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold">Available Doctors</h3>
              <p className="text-blue-100 text-sm">Book an appointment with our specialists</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {doctors.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-slate-500">No doctors available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors border border-slate-100 hover:border-blue-200"
                >
                  <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {doctor.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">Dr. {doctor.username}</p>
                    <p className="text-sm text-slate-500">{doctor.specialization || "General"}</p>
                    <p className="text-xs text-slate-400">{doctor.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* My Appointments Section */}
      <Card className="overflow-hidden shadow-lg border-0">
        <div className="bg-linear-to-r from-blue-600 to-cyan-700 px-6 py-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold">My Appointments</h3>
              <p className="text-blue-100 text-sm">View and track your appointments</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-500">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No appointments yet</h3>
            <p className="text-slate-500 mb-4">Book your first appointment to get started.</p>
            <Button
              onClick={() => setShowNewAppointment(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Book Appointment
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-linear-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-lg">Dr. {apt.doctorName}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1 text-slate-600">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">{apt.date}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-600">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm">{apt.time}</span>
                        </div>
                      </div>
                      {apt.reason && (
                        <p className="text-slate-600 text-sm mt-1">
                          <span className="font-medium">Reason:</span> {apt.reason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getStatusBadge(apt.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Patient Profile Section */}
      <PatientForm />

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-0 overflow-hidden">
            <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold">Book New Appointment</h3>
                </div>
                <button
                  onClick={() => setShowNewAppointment(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleNewAppointment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Doctor</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.username} {doctor.specialization ? `- ${doctor.specialization}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={appointmentForm.time}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason (Optional)</label>
                <textarea
                  value={appointmentForm.reason}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                  rows={3}
                  placeholder="Describe the reason for your visit..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewAppointment(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? "Booking..." : "Book Appointment"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
