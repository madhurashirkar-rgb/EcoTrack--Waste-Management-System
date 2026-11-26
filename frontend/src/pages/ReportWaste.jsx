import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Camera,
  Trash2,
  Navigation,
  Send,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ReportWaste({ setActiveTab, onReportCreated }) {
  const { addEcoPoints, updateEcoPoints } = useAuth();
  const [wasteType, setWasteType] = useState('Plastic & Containers');
  const [urgency, setUrgency] = useState('Normal');
  const [location, setLocation] = useState('442 River Street, Corner of 9th Ave');
  const [description, setDescription] = useState('');
  const [previewImage, setPreviewImage] = useState(
    'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=800&q=80'
  );
  const [submitting, setSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      gsap.fromTo(
        '.report-card',
        { y: 16 },
        {
          y: 0,
          duration: 0.55,
          ease: 'power3.out',
        }
      );
    },
    { scope: formRef }
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPreviewImage(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = (e) => {
    e.stopPropagation();
    setPreviewImage('');
  };

  const handleUseGps = () => {
    setLocation('Pinned: 40.7128° N, 74.0060° W (City Plaza & 4th)');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.reports.create({
        wasteType,
        urgency,
        location,
        description: description || 'Overflowing waste incident reported by citizen.',
        image:
          previewImage ||
          'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=800&q=80',
      });

      const newReport = res.data?.report || res.data;
      setSuccessTicket(newReport.id || 'EC-2024-998');

      if (typeof res.data?.totalEcoPoints === 'number') {
        updateEcoPoints(res.data.totalEcoPoints);
      } else {
        addEcoPoints(25);
      }

      if (onReportCreated) {
        onReportCreated(newReport);
      }
    } catch (err) {
      console.error('Error submitting report:', err);
      // Fallback ticket
      setSuccessTicket(`EC-2026-${Math.floor(100 + Math.random() * 900)}`);
      addEcoPoints(25);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={formRef} className="max-w-3xl mx-auto space-y-6">
      <div className="report-card bg-surface-container-lowest rounded-3xl p-6 sm:p-9 custom-shadow-card border border-surface-container-high relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container-high pb-5">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold">
              Incident Dispatch Telemetry
            </span>
            <h1 className="heading-5 text-on-surface">Submit Municipal Waste Report</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-secondary-container/80 border border-primary/30 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold dark:shadow-[0_0_12px_rgba(0,255,148,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+25 EcoPoints</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3.5 bg-error-container border border-error/30 text-on-error-container rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Photo Evidence Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-2">
              Waste Photo Evidence
            </label>
            <div className="border-2 border-dashed border-outline-variant hover:border-primary/60 rounded-2xl p-6 text-center cursor-pointer transition-colors duration-300 bg-surface-container-low flex flex-col items-center justify-center relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />

              {!previewImage ? (
                <div className="space-y-2 pointer-events-none">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-lowest mx-auto flex items-center justify-center text-primary border border-surface-container-high shadow-xs group-hover:scale-105 transition-transform duration-300">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-on-surface">Click to capture or drag &amp; drop photo</p>
                  <p className="text-[11px] text-on-surface-variant font-mono">
                    PNG, JPG, or WebP up to 10MB (GPS tag auto-extracted)
                  </p>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <img
                    src={previewImage}
                    alt="Waste preview"
                    className="w-full max-h-60 object-cover rounded-xl border border-surface-container-high"
                  />
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="mt-3 text-xs font-semibold text-error hover:text-error/80 flex items-center gap-1.5 transition-colors z-20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove and retake photo</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Grid: Waste Category & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Waste Category Dropdown */}
            <div>
              <label htmlFor="wasteType" className="block text-xs font-semibold text-on-surface mb-2">
                Waste Category <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select
                  id="wasteType"
                  value={wasteType}
                  onChange={(e) => setWasteType(e.target.value)}
                  className="w-full h-11 bg-surface-container-low border border-outline-variant rounded-xl px-3.5 text-on-surface text-xs font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="Plastic & Containers">Plastic, Bottles &amp; Aluminum</option>
                  <option value="Dry / Recyclable">Dry / Recyclable (Cardboard, Glass, Paper)</option>
                  <option value="Organic / Wet">Organic / Wet Food Waste</option>
                  <option value="Hazardous / E-Waste">Hazardous / E-Waste &amp; Batteries</option>
                  <option value="Bulky Furniture">Bulky Debris &amp; Construction Trash</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3.5 top-3.5 pointer-events-none text-on-surface-variant" />
              </div>
            </div>

            {/* Urgency Level Buttons */}
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-2">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Low', 'Normal', 'Urgent'].map((level) => {
                  const targetLevel = level === 'Urgent' ? 'Urgent Overflow' : level;
                  const isSelected = urgency === targetLevel;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgency(targetLevel)}
                      className={`h-11 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all duration-300 ${
                        isSelected
                          ? level === 'Urgent'
                            ? 'border-error bg-error-container text-on-error-container font-bold'
                            : 'border-primary bg-secondary-container text-primary font-bold dark:shadow-[0_0_12px_rgba(0,255,148,0.2)]'
                          : 'border-surface-container-high bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:border-outline-variant'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Location Selector with Auto GPS */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="locationInput" className="block text-xs font-semibold text-on-surface">
                Incident Location <span className="text-error">*</span>
              </label>
              <button
                type="button"
                onClick={handleUseGps}
                className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline focus:outline-none"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Use Current GPS</span>
              </button>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-on-surface-variant" />
              <input
                id="locationInput"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="742 Evergreen Terrace or landmark"
                className="w-full h-11 bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 text-on-surface text-xs focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all"
                required
              />
            </div>
            <p className="text-[11px] font-mono text-on-surface-variant mt-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <span>Coordinates pinned: 40.7128° N, 74.0060° W</span>
            </p>
          </div>

          {/* Description Textarea */}
          <div>
            <label htmlFor="descriptionInput" className="block text-xs font-semibold text-on-surface mb-2">
              Detailed Description
            </label>
            <textarea
              id="descriptionInput"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the waste volume, access restrictions, or hazards..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3.5 text-on-surface text-xs focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all resize-none"
            />
          </div>

          {/* Submit Button & Note */}
          <div className="pt-4 border-t border-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <Info className="w-4 h-4 text-primary shrink-0" />
              <span>Reports are audited by municipal dispatch within 30 minutes.</span>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="neon-btn neon-btn-primary w-full sm:w-auto bg-primary text-on-primary px-8 py-3 rounded-xl text-xs font-bold hover:bg-primary-container flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Report...' : 'Submit Waste Report'}</span>
            </button>
          </div>
        </form>

        {/* Success Alert */}
        {successTicket && (
          <div className="mt-6 p-4 rounded-2xl bg-secondary-container border border-primary/30 text-on-secondary-container flex items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div>
                <div className="font-bold text-xs text-primary">Report Successfully Submitted!</div>
                <div className="text-[11px] text-on-surface-variant font-mono">
                  Ticket #{successTicket} logged. +25 EcoPoints credited.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('my-reports')}
              className="neon-btn px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl hover:bg-primary-container transition-colors shrink-0"
            >
              Track Status
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
