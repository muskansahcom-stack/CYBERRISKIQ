/**
 * Engine 8: Reporting & Export Engine
 * Generates audit-ready executive and technical cybersecurity reports.
 */

import { Asset, Vulnerability, SecurityControl, SecurityIncident, FinancialExposureProfile } from '../types/cyberrisk';
import { formatINR } from '../utils/formatters';

export interface ReportDefinition {
  id: string;
  title: string;
  category: 'Executive' | 'Technical' | 'Financial' | 'Compliance' | 'Operations';
  description: string;
  targetAudience: string;
  frequency: 'Quarterly' | 'Monthly' | 'On-Demand';
  lastGenerated: string;
  estimatedPages: number;
}

export class ReportingEngine {
  public static getReportCatalog(): ReportDefinition[] {
    return [
      {
        id: 'rep-exec-01',
        title: 'Executive Board Risk Briefing',
        category: 'Executive',
        description: 'High-level financial cyber risk posture, top 5 business loss vectors, and ROSI summary for the Board of Directors & Risk Committee.',
        targetAudience: 'Board of Directors, CEO, CRO, CISO',
        frequency: 'Quarterly',
        lastGenerated: '2024-04-15',
        estimatedPages: 6
      },
      {
        id: 'rep-tech-02',
        title: 'Technical Security & Posture Audit',
        category: 'Technical',
        description: 'Comprehensive vulnerability backlog, critical CVE burn-down, control effectiveness metrics, and endpoint coverage telemetry.',
        targetAudience: 'Security Operations, SecOps Lead, System Owners',
        frequency: 'Monthly',
        lastGenerated: '2024-04-22',
        estimatedPages: 18
      },
      {
        id: 'rep-fin-03',
        title: 'Financial Cyber Exposure & VaR Report',
        category: 'Financial',
        description: 'Actuarial quantification of Expected Annual Loss (ALE), single loss expectancies, downtime impact, and DPDP regulatory penalty exposures.',
        targetAudience: 'CFO, Enterprise Risk Management, Cyber Underwriters',
        frequency: 'Quarterly',
        lastGenerated: '2024-04-10',
        estimatedPages: 12
      },
      {
        id: 'rep-vuln-04',
        title: 'Vulnerability Prioritization & Patch SLA Audit',
        category: 'Technical',
        description: 'Full inventory of open and in-progress CVEs ranked strictly by business financial risk contribution and active weaponization status.',
        targetAudience: 'DevSecOps, Infrastructure Engineering, IT Operations',
        frequency: 'Monthly',
        lastGenerated: '2024-04-20',
        estimatedPages: 14
      },
      {
        id: 'rep-comp-05',
        title: 'Regulatory & Framework Compliance Attestation',
        category: 'Compliance',
        description: 'Gap analysis and audit evidence mappings across RBI Cybersecurity Guidelines, SEBI CSCRF, ISO 27001, and NIST CSF 2.0.',
        targetAudience: 'Internal Audit, External Regulators, Compliance Officer',
        frequency: 'Quarterly',
        lastGenerated: '2024-03-31',
        estimatedPages: 24
      },
      {
        id: 'rep-opt-06',
        title: 'Cyber Investment Optimization & ROI Allocation',
        category: 'Executive',
        description: 'Recommended security control budget allocation under varying fiscal constraints, with projected risk reduction curves and ROSI.',
        targetAudience: 'CISO, CFO, Capital Budgeting Committee',
        frequency: 'On-Demand',
        lastGenerated: '2024-04-18',
        estimatedPages: 8
      }
    ];
  }

  public static generateExecutiveSummaryText(
    assets: Asset[],
    vulnerabilities: Vulnerability[],
    controls: SecurityControl[],
    incidents: SecurityIncident[],
    financial: FinancialExposureProfile
  ): string {
    const totalAssets = assets.length;
    const criticalAssets = assets.filter(a => a.criticality === 'Critical').length;
    const openVulns = vulnerabilities.filter(v => v.remediationStatus !== 'Mitigated').length;
    const criticalVulns = vulnerabilities.filter(v => v.severity === 'Critical' && v.remediationStatus !== 'Mitigated').length;

    return `
CYBERRISKIQ EXECUTIVE RISK REPORT
Organization: Acme Financial Services (DEMO DATA)
Generated on: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
Jurisdiction: Mumbai / Bangalore, India (RBI / SEBI Regulated Entity)
--------------------------------------------------------------------------------

1. EXECUTIVE POSTURE SUMMARY:
- Enterprise Cyber Risk Score: 68 / 100 (Status: HIGH RISK / MONITORED)
- Total Financial Cyber Exposure: ${formatINR(financial.totalEstimatedImpact)}
- Modeled Expected Annual Loss (ALE): ${formatINR(financial.expectedAnnualLoss)}
- Current Annual Security Investment: ₹75 Lakh
- Estimated Prevented Risk / Loss: ₹1.1 Crore
- Return on Security Investment (ROSI): 47%

2. ASSET SCOPE & PERIMETER:
- Total Scoped Business Assets: ${totalAssets}
- Tier-1 Critical Systems: ${criticalAssets} (${Math.round((criticalAssets / totalAssets) * 100)}% of portfolio)
- Top Risk Asset: Payment Gateway Server Cluster (EAL: ₹32 Lakh, Risk Score: 89)

3. THREAT & VULNERABILITY STATUS:
- Open Unmitigated Vulnerabilities: ${openVulns}
- Critical In-the-Wild Exploits: ${criticalVulns} (Highest Priority: CVE-2024-3400, Log4Shell)
- Recent Security Incidents (Trailing 12 Mo): ${incidents.length} events (Total historical impact: ${formatINR(incidents.reduce((s, i) => s + i.totalFinancialImpact, 0))})

4. STRATEGIC RECOMMENDATIONS:
- Immediate Action: Authorize ₹22 Lakh for Network Micro-segmentation between Web tier and Core Database.
- High Priority: Mandate FIDO2 hardware token enforcement on all 3,000 endpoint fleets to neutralize active credential ring campaigns.
- Regulatory Assurance: RBI and SEBI baseline compliance scores currently stand at 80% and 83% respectively.
    `.trim();
  }
}
