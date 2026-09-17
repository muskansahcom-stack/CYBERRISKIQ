import React, { useState, useEffect } from 'react';
import { Asset } from '../../types/cyberrisk';
import { Modal } from '../common/Modal';

interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assetData: any) => void;
  initialAsset?: Asset | null;
}

export const AssetFormModal: React.FC<AssetFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAsset,
}) => {
  const isEditing = !!initialAsset;

  const [name, setName] = useState('');
  const [type, setType] = useState('Server / Workload');
  const [businessUnit, setBusinessUnit] = useState('Digital Banking');
  const [owner, setOwner] = useState('');
  const [businessValue, setBusinessValue] = useState<number>(50000000);
  const [criticality, setCriticality] = useState<Asset['criticality']>('High');
  const [internetExposure, setInternetExposure] = useState<boolean>(false);
  const [dataSensitivity, setDataSensitivity] = useState('High PII & Financial');
  const [ipOrLocation, setIpOrLocation] = useState('');
  const [dependencies, setDependencies] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialAsset) {
      setName(initialAsset.name);
      setType(initialAsset.type);
      setBusinessUnit(initialAsset.businessUnit);
      setOwner(initialAsset.owner);
      setBusinessValue(initialAsset.businessValue);
      setCriticality(initialAsset.criticality);
      setInternetExposure(initialAsset.internetExposure);
      setDataSensitivity(initialAsset.dataSensitivity);
      setIpOrLocation(initialAsset.ipOrLocation);
      setDependencies(initialAsset.dependencies.join(', '));
      setNotes(initialAsset.notes || '');
    } else {
      setName('');
      setType('Server / Workload');
      setBusinessUnit('Digital Banking');
      setOwner('SecOps Infrastructure Lead');
      setBusinessValue(25000000);
      setCriticality('High');
      setInternetExposure(false);
      setDataSensitivity('High PII & Financial');
      setIpOrLocation('10.140.20.0/24 (VPC Production)');
      setDependencies('Core Network Switch, Identity Provider');
      setNotes('');
    }
  }, [initialAsset, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      type,
      businessUnit,
      owner,
      businessValue: Number(businessValue),
      criticality,
      internetExposure,
      dataSensitivity,
      ipOrLocation,
      dependencies: dependencies
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean),
      notes,
      currentRiskScore: initialAsset ? initialAsset.currentRiskScore : 65,
      financialExposure: initialAsset ? initialAsset.financialExposure : Math.round(businessValue * 0.15),
      expectedAnnualLoss: initialAsset ? initialAsset.expectedAnnualLoss : Math.round(businessValue * 0.03),
    };

    onSave(payload);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Asset: ${initialAsset?.name}` : 'Add New Enterprise Asset'}
      subtitle="Register or adjust business asset parameters to recalculate FAIR exposure."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Asset Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Core Settlement Switch or Microservices Gateway"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Asset Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            >
              <option value="Server / Workload">Server / Workload</option>
              <option value="Database Cluster">Database Cluster</option>
              <option value="Cloud Workload">Cloud Workload</option>
              <option value="API Gateway">API Gateway</option>
              <option value="Endpoint Fleet">Endpoint Fleet</option>
              <option value="Web Application">Web Application</option>
              <option value="Network Infrastructure">Network Infrastructure</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Business Unit *
            </label>
            <select
              value={businessUnit}
              onChange={(e) => setBusinessUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            >
              <option value="Payments & Settlement">Payments & Settlement</option>
              <option value="Digital Banking">Digital Banking</option>
              <option value="Corporate HR & Operations">Corporate HR & Operations</option>
              <option value="Wealth & Capital Markets">Wealth & Capital Markets</option>
              <option value="Treasury & International">Treasury & International</option>
              <option value="Customer Experience">Customer Experience</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Asset Owner / Custodian *
            </label>
            <input
              type="text"
              required
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="e.g. Payments Engineering Lead"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Business Value (in INR ₹) *
            </label>
            <input
              type="number"
              min="100000"
              step="100000"
              required
              value={businessValue}
              onChange={(e) => setBusinessValue(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Criticality Tier *
            </label>
            <select
              value={criticality}
              onChange={(e) => setCriticality(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            >
              <option value="Critical">Critical (Tier-1 Core Financial)</option>
              <option value="High">High (Tier-2 Production)</option>
              <option value="Medium">Medium (Internal Operations)</option>
              <option value="Low">Low (Support / Sandbox)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Data Sensitivity *
            </label>
            <select
              value={dataSensitivity}
              onChange={(e) => setDataSensitivity(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            >
              <option value="High PII & Financial (PCI-DSS, DPDP)">High PII & Financial (PCI-DSS, DPDP)</option>
              <option value="Regulated Financial Records (RBI)">Regulated Financial Records (RBI)</option>
              <option value="Corporate Confidential & Payroll">Corporate Confidential & Payroll</option>
              <option value="Operational Logs & Metrics">Operational Logs & Metrics</option>
              <option value="Public Marketing Content">Public Marketing Content</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              IP / Network Location
            </label>
            <input
              type="text"
              value={ipOrLocation}
              onChange={(e) => setIpOrLocation(e.target.value)}
              placeholder="e.g. 10.100.4.0/24 or aws-ap-south-1"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="internetExposureCheckbox"
              checked={internetExposure}
              onChange={(e) => setInternetExposure(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="internetExposureCheckbox" className="font-semibold text-slate-700 dark:text-slate-300">
              Direct Internet Ingress Exposure
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Dependencies (comma separated)
            </label>
            <input
              type="text"
              value={dependencies}
              onChange={(e) => setDependencies(e.target.value)}
              placeholder="e.g. Identity Provider, Core Ledger Database, Cloud DNS"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Architecture & Risk Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional deployment and compliance context..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xs"
          >
            {isEditing ? 'Save Changes' : 'Create Asset'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
