import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Printer,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ReportingEngine, ReportDefinition } from '../../services/reportingEngine';
import { Modal } from '../common/Modal';

export const ReportsModule: React.FC = () => {
  const { assets, vulnerabilities, controls, incidents, financialProfile } = useData();
  const reportCatalog = ReportingEngine.getReportCatalog();

  const [previewReport, setPreviewReport] = useState<ReportDefinition | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const executiveReportText = ReportingEngine.generateExecutiveSummaryText(
    assets,
    vulnerabilities,
    controls,
    incidents,
    financialProfile
  );

  const handleDownload = (report: ReportDefinition) => {
    // Create text blob and download
    const blob = new Blob([executiveReportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.id}_${report.title.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(report.id);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div id="reports-module-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Cybersecurity Governance & Executive Reporting Suite
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              6 AUDIT TEMPLATES
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Produce board-level briefings, actuarial financial VaR disclosures, technical vulnerability audit logs, and RBI/SEBI regulatory attestations.
          </p>
        </div>

        <button
          onClick={() => handleDownload(reportCatalog[0])}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Executive Risk Briefing</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Report package successfully generated and exported to file!</span>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reportCatalog.map((report) => (
          <div
            key={report.id}
            className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                  {report.category}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {report.frequency}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {report.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {report.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Target Audience:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 text-right truncate max-w-[170px]">
                    {report.targetAudience}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Last Generated:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {report.lastGenerated}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setPreviewReport(report)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => handleDownload(report)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-white transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Generate PDF/TXT</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Preview Modal */}
      <Modal
        isOpen={!!previewReport}
        onClose={() => setPreviewReport(null)}
        title={previewReport ? previewReport.title : 'Report Preview'}
        subtitle="Audit-ready structured briefing document"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-400 block text-[11px]">Organization:</span>
              <strong className="text-slate-900 dark:text-slate-100">
                Acme Financial Services (DEMO)
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Audience:</span>
              <strong className="text-slate-900 dark:text-slate-100">
                {previewReport?.targetAudience}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Estimated Length:</span>
              <strong className="text-slate-900 dark:text-slate-100">
                {previewReport?.estimatedPages} Pages
              </strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto border border-slate-800">
            {executiveReportText}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setPreviewReport(null)}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              Close
            </button>
            <button
              onClick={() => {
                if (previewReport) handleDownload(previewReport);
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Download Report
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
