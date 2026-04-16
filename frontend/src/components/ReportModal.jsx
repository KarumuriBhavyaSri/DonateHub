import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import api from '../api';

const ReportModal = ({ isOpen, onClose, reportedUserId, reporterId, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const reasons = [
    'Frustrated / Irritating behavior',
    'Misuse of platform',
    'Not responding for message calls',
    'Late delivery',
    'Inappropriate language',
    'Other'
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      setError('Please select a reason for reporting.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/reports', {
        reporterId,
        reportedUserId,
        reason,
        description
      });
      onSuccess();
      onClose();
      alert('Report submitted successfully. Thank you for helping us keep the platform safe.');
    } catch (err) {
      console.error('Failed to submit report:', err);
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-red-600 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <AlertTriangle size={24} />
            <h3 className="text-xl font-bold">Report Donor</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-gray-600 mb-6">
            Help us understand what happened. Your report will be sent to our team and the donor will be notified.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason for reporting <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none bg-gray-50"
              required
            >
              <option value="">Select a reason</option>
              {reasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Details (Recommended)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none bg-gray-50 h-32 resize-none"
              placeholder="Provide more context about the issue..."
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-sm">
              <AlertTriangle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-all shadow-lg shadow-red-200"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
