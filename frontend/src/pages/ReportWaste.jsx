import React, { useState } from 'react';
import { 
  PlusCircle, MapPin, Camera, Image as ImageIcon, Send, 
  Sparkles, CheckCircle, AlertCircle, RefreshCw 
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const WASTE_TYPES = [
  { id: 'Plastic', label: 'Plastic', icon: '🥤', desc: 'Bottles, bags, food containers' },
  { id: 'Organic', label: 'Organic', icon: '🍎', desc: 'Food waste, vegetable peels, leaves' },
  { id: 'Electronic', label: 'Electronic', icon: '💻', desc: 'Cables, phones, old appliances' },
  { id: 'Metal', label: 'Metal', icon: '🥫', desc: 'Aluminium cans, tins, scrap metal' },
  { id: 'Glass', label: 'Glass', icon: '🍾', desc: 'Bottles, jars, broken glassware' },
  { id: 'Hazardous', label: 'Hazardous', icon: '⚠️', desc: 'Batteries, chemicals, paint cans' },
];

const SAMPLE_IMAGES = [
  { label: 'Plastic Bottles', url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80' },
  { label: 'E-Waste Monitor', url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80' },
  { label: 'Organic Pile', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80' },
  { label: 'Discarded Cans', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80' }
];

export default function ReportWaste({ setActiveTab, onReportCreated }) {
  const { user, refreshProfile } = useAuth();
  
  const [wasteType, setWasteType] = useState('Plastic');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGES[0].url);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  // Auto-detect location simulation / GPS
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`Civic Sector 4, GPS (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        },
        () => {
          setLocation('Main Green Boulevard, Ward 7 (Detected)');
        }
      );
    } else {
      setLocation('Main Green Boulevard, Ward 7 (Detected)');
    }
  };

  // Handle local image file upload -> Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!location.trim()) {
      setError('Please provide the location of the waste.');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a brief description.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        wasteType,
        location: location.trim(),
        description: description.trim(),
        image: imageUrl || SAMPLE_IMAGES[0].url,
        status: 'Pending'
      };

      const res = await api.reports.create(payload);
      setSubmittedData(res.data);
      refreshProfile();

      if (onReportCreated) {
        onReportCreated(res.data.report);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit waste report.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedData(null);
    setDescription('');
    setLocation('');
    setImageUrl(SAMPLE_IMAGES[0].url);
  };

  if (submittedData) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 animate-in zoom-in-95 duration-200">
        <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              +50 EcoPoints Earned!
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900">
              Report Submitted Successfully!
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              Your report has been queued for municipal dispatch. You can track progress in real-time under History.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-left border border-gray-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Report ID:</span>
              <span className="font-mono font-bold text-gray-900">{submittedData.report.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Waste Category:</span>
              <span className="font-semibold text-gray-900">{submittedData.report.wasteType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Location:</span>
              <span className="font-medium text-gray-700">{submittedData.report.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Initial Status:</span>
              <span className="font-bold text-amber-600">Pending</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('history')}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Track in History
            </button>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-all"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Report Waste
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Spot illegal dumping, overflowing bins, or street litter? Fill the details below to notify clean-up teams.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
        
        {/* Step 1: Waste Type Selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-3">
            1. Select Waste Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {WASTE_TYPES.map((type) => {
              const isSelected = wasteType === type.id;
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setWasteType(type.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-gray-900'}`}>
                    {type.label}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                    {type.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Location Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
              2. Waste Location
            </label>
            <button
              type="button"
              onClick={handleDetectLocation}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              Use Current GPS
            </button>
          </div>
          <div className="relative">
            <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              placeholder="e.g. Corner of Elm St & 5th Ave, near Public Park"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Step 3: Photo / Image */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">
            3. Photo Evidence (Optional URL / Upload)
          </label>

          {/* Preset image selector for easy testing */}
          <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-gray-400 shrink-0 font-medium text-[11px]">Presets:</span>
            {SAMPLE_IMAGES.map((img) => (
              <button
                key={img.label}
                type="button"
                onClick={() => setImageUrl(img.url)}
                className={`px-2.5 py-1 rounded-lg border shrink-0 text-[11px] font-medium transition-colors ${
                  imageUrl === img.url
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {img.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Image Preview */}
            <div className="relative aspect-video sm:aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Waste Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                  <span className="text-[11px] text-gray-400 block">No preview</span>
                </div>
              )}
            </div>

            {/* Input controls */}
            <div className="sm:col-span-2 space-y-3">
              <div>
                <label className="text-[11px] text-gray-500 block mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-500 block mb-1">Or Upload from Device</label>
                <label className="flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-xl text-xs text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>Choose file from camera/gallery</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Description */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">
            4. Description of Issue
          </label>
          <textarea
            required
            rows={3}
            placeholder="Please detail the approximate size of waste, hazards, or accessibility notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3.5 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
          />
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Waste Report (+50 EcoPoints)
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
