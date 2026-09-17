/**
 * CYBERRISKIQ - Comprehensive Realistic Enterprise Demo Dataset
 * Organization: Acme Financial Services (DEMO DATA)
 */

import {
  Asset,
  Vulnerability,
  SecurityControl,
  ThreatIntelligence,
  SecurityIncident,
  ComplianceItem,
  FinancialExposureProfile,
  SimulationAction,
  InvestmentCandidate
} from '../types/cyberrisk';

export const DEMO_ORGANIZATION = {
  name: 'Acme Financial Services',
  tagline: 'Tier-1 Scheduled Commercial Bank & Digital Payments Institution',
  jurisdiction: 'Mumbai / Bangalore, India',
  regulator: 'Reserve Bank of India (RBI) & SEBI',
  isDemo: true,
};

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'AST-101',
    name: 'Payment Gateway Server Cluster',
    type: 'Server',
    businessUnit: 'Payments & Settlement',
    owner: 'Arjun Mehta (VP Payments Tech)',
    businessValue: 45000000, // ₹4.5 Crore
    criticality: 'Critical',
    internetExposure: true,
    dataSensitivity: 'High (PII & Financial)',
    dependencies: ['AST-102', 'AST-104', 'AST-107'],
    currentRiskScore: 89,
    financialExposure: 11000000, // ₹1.1 Crore
    expectedAnnualLoss: 3200000, // ₹32 Lakh
    ipOrLocation: '198.51.100.42 / Mumbai Primary DC',
    notes: 'Processes ₹120 Crore in daily UPI, IMPS, and credit card transit. Core tokenization service attached.'
  },
  {
    id: 'AST-102',
    name: 'Customer Core Database (PostgreSQL Cluster)',
    type: 'Database',
    businessUnit: 'Digital Banking',
    owner: 'Sneha Ranganathan (Head of Data Infrastructure)',
    businessValue: 80000000, // ₹8 Crore
    criticality: 'Critical',
    internetExposure: false,
    dataSensitivity: 'High (PII & Financial)',
    dependencies: ['AST-106', 'AST-114'],
    currentRiskScore: 81,
    financialExposure: 8500000, // ₹85 Lakh
    expectedAnnualLoss: 1800000, // ₹18 Lakh
    ipOrLocation: '10.240.12.15 / Mumbai Secure Tier-3 Zone',
    notes: 'Houses 4.8 million active bank customer KYC, account ledgers, and transaction credentials.'
  },
  {
    id: 'AST-103',
    name: 'HR & Payroll Enterprise Portal',
    type: 'Web Application',
    businessUnit: 'Corporate HR & Operations',
    owner: 'Vikram Joshi (Dir. Enterprise Systems)',
    businessValue: 12000000, // ₹1.2 Crore
    criticality: 'Medium',
    internetExposure: true,
    dataSensitivity: 'High (PII & Financial)',
    dependencies: ['AST-106', 'AST-109'],
    currentRiskScore: 64,
    financialExposure: 2400000, // ₹24 Lakh
    expectedAnnualLoss: 600000, // ₹6 Lakh
    ipOrLocation: '198.51.100.89 / Hyderabad Cloud Host',
    notes: 'Handles employee compensation, statutory tax filing, and PAN/Aadhaar employee records.'
  },
  {
    id: 'AST-104',
    name: 'API Banking Switch (Open Banking Engine)',
    type: 'API Gateway',
    businessUnit: 'Payments & Settlement',
    owner: 'Pooja Nair (Lead Fintech Integration)',
    businessValue: 35000000, // ₹3.5 Crore
    criticality: 'Critical',
    internetExposure: true,
    dataSensitivity: 'High (Financial Only)',
    dependencies: ['AST-101', 'AST-102'],
    currentRiskScore: 76,
    financialExposure: 5500000, // ₹55 Lakh
    expectedAnnualLoss: 1400000, // ₹14 Lakh
    ipOrLocation: '203.0.113.14 / AWS Asia-South-1 VPC',
    notes: 'Integrates corporate ERP clients, aggregators, and fintech micro-lenders.'
  },
  {
    id: 'AST-105',
    name: 'Wealth Management & Trading Platform',
    type: 'Web Application',
    businessUnit: 'Wealth & Capital Markets',
    owner: 'Rohan Deshmukh (Head of Brokerage Tech)',
    businessValue: 28000000, // ₹2.8 Crore
    criticality: 'High',
    internetExposure: true,
    dataSensitivity: 'High (PII & Financial)',
    dependencies: ['AST-102', 'AST-115'],
    currentRiskScore: 71,
    financialExposure: 3900000, // ₹39 Lakh
    expectedAnnualLoss: 950000, // ₹9.5 Lakh
    ipOrLocation: '198.51.100.112 / Mumbai FinTech Pop',
    notes: 'High net-worth portfolio management, mutual fund executions, and equity transactions.'
  },
  {
    id: 'AST-106',
    name: 'Active Directory Domain Controller (Hybrid)',
    type: 'Server',
    businessUnit: 'Information Technology',
    owner: 'Kiran Verma (Chief Systems Architect)',
    businessValue: 20000000, // ₹2 Crore
    criticality: 'Critical',
    internetExposure: false,
    dataSensitivity: 'Medium (Confidential)',
    dependencies: ['AST-109', 'AST-110'],
    currentRiskScore: 74,
    financialExposure: 4200000, // ₹42 Lakh
    expectedAnnualLoss: 1100000, // ₹11 Lakh
    ipOrLocation: '10.240.0.10 / Corporate Forest Primary DC',
    notes: 'Central authentication for 3,200 domain identities and privileged administrative groups.'
  },
  {
    id: 'AST-107',
    name: 'SWIFT & Interbank Messaging Hub',
    type: 'Server',
    businessUnit: 'Treasury & International Ops',
    owner: 'Meera Iyer (VP International Banking)',
    businessValue: 95000000, // ₹9.5 Crore
    criticality: 'Critical',
    internetExposure: false,
    dataSensitivity: 'High (Financial Only)',
    dependencies: ['AST-106', 'AST-108'],
    currentRiskScore: 58,
    financialExposure: 3500000, // ₹35 Lakh
    expectedAnnualLoss: 750000, // ₹7.5 Lakh
    ipOrLocation: '10.245.1.5 / Air-Gapped Secure Enclave',
    notes: 'Handles high-value cross-border wire transfers and central bank settlement pipelines.'
  },
  {
    id: 'AST-108',
    name: 'Customer Mobile Banking Backend (Microservices)',
    type: 'Cloud Workload',
    businessUnit: 'Digital Banking',
    owner: 'Anand Kulkarni (Head of Mobile App)',
    businessValue: 40000000, // ₹4 Crore
    criticality: 'Critical',
    internetExposure: true,
    dataSensitivity: 'High (PII & Financial)',
    dependencies: ['AST-101', 'AST-102', 'AST-111'],
    currentRiskScore: 78,
    financialExposure: 6200000, // ₹62 Lakh
    expectedAnnualLoss: 1600000, // ₹16 Lakh
    ipOrLocation: 'k8s-ingress.acmebank.internal / AWS Mumbai',
    notes: 'Backbone for Android & iOS retail banking app with 1.4 million monthly active users.'
  },
  {
    id: 'AST-109',
    name: 'Enterprise SAP / ERP Financial General Ledger',
    type: 'Server',
    businessUnit: 'Finance & Compliance',
    owner: 'Sanjay Chawla (CFO Operations)',
    businessValue: 30000000, // ₹3 Crore
    criticality: 'High',
    internetExposure: false,
    dataSensitivity: 'High (Financial Only)',
    dependencies: ['AST-102', 'AST-106'],
    currentRiskScore: 52,
    financialExposure: 2100000, // ₹21 Lakh
    expectedAnnualLoss: 450000, // ₹4.5 Lakh
    ipOrLocation: '10.240.50.21 / Primary DC ERP Cluster',
    notes: 'Reconciliation of statutory reporting, balance sheets, and audit trails.'
  },
  {
    id: 'AST-110',
    name: 'Employee Laptop & Workstation Fleet (3,000 devices)',
    type: 'Endpoint',
    businessUnit: 'Corporate Operations',
    owner: 'Deepak Patel (IT Workplace Operations)',
    businessValue: 18000000, // ₹1.8 Crore
    criticality: 'Medium',
    internetExposure: true,
    dataSensitivity: 'Medium (Confidential)',
    dependencies: ['AST-106', 'AST-113'],
    currentRiskScore: 69,
    financialExposure: 3100000, // ₹31 Lakh
    expectedAnnualLoss: 820000, // ₹8.2 Lakh
    ipOrLocation: 'Distributed / Hybrid Workplace nationwide',
    notes: 'Primary endpoint vector for credential phishing, malware payloads, and insider error.'
  },
  {
    id: 'AST-111',
    name: 'Cloud Kubernetes Production Cluster (EKS)',
    type: 'Cloud Workload',
    businessUnit: 'Digital Banking',
    owner: 'Pooja Nair (DevSecOps Lead)',
    businessValue: 25000000, // ₹2.5 Crore
    criticality: 'Critical',
    internetExposure: true,
    dataSensitivity: 'Medium (Confidential)',
    dependencies: ['AST-102', 'AST-108'],
    currentRiskScore: 66,
    financialExposure: 2900000, // ₹29 Lakh
    expectedAnnualLoss: 680000, // ₹6.8 Lakh
    ipOrLocation: 'eks.ap-south-1.amazonaws.com / VPC-Prod-01',
    notes: 'Hosts 64 containerized microservices including notifications, statement generation, and fraud rules.'
  },
  {
    id: 'AST-112',
    name: 'Customer Support CRM & Contact Center System',
    type: 'SaaS Service',
    businessUnit: 'Customer Service & Operations',
    owner: 'Priya Sundaram (Head of Support)',
    businessValue: 8000000, // ₹80 Lakh
    criticality: 'Medium',
    internetExposure: true,
    dataSensitivity: 'High (PII & Financial)',
    dependencies: ['AST-106'],
    currentRiskScore: 55,
    financialExposure: 1500000, // ₹15 Lakh
    expectedAnnualLoss: 330000, // ₹3.3 Lakh
    ipOrLocation: 'acmebank.crm-saas.com / Dedicated Cloud',
    notes: 'Handles 15,000 daily tickets, chat logs, card disputes, and KYC document attachments.'
  },
  {
    id: 'AST-113',
    name: 'Corporate Email & M365 Cloud Workspace',
    type: 'SaaS Service',
    businessUnit: 'Information Technology',
    owner: 'Kiran Verma (Chief Systems Architect)',
    businessValue: 15000000, // ₹1.5 Crore
    criticality: 'High',
    internetExposure: true,
    dataSensitivity: 'Medium (Confidential)',
    dependencies: ['AST-106'],
    currentRiskScore: 61,
    financialExposure: 2200000, // ₹22 Lakh
    expectedAnnualLoss: 520000, // ₹5.2 Lakh
    ipOrLocation: 'Exchange Online / tenant: acmefinancial.in',
    notes: 'Communication backbone subject to business email compromise (BEC) and phishing attempts.'
  },
  {
    id: 'AST-114',
    name: 'Document Storage & Customer KYC Vault (Ceph & S3)',
    type: 'Database',
    businessUnit: 'Compliance & Risk',
    owner: 'Sneha Ranganathan (Head of Data Infrastructure)',
    businessValue: 32000000, // ₹3.2 Crore
    criticality: 'High',
    internetExposure: false,
    dataSensitivity: 'High (PII & Financial)',
    dependencies: ['AST-102', 'AST-106'],
    currentRiskScore: 63,
    financialExposure: 2600000, // ₹26 Lakh
    expectedAnnualLoss: 590000, // ₹5.9 Lakh
    ipOrLocation: '10.240.18.90 / Dedicated Storage Array',
    notes: 'Stores 6.2 million encrypted scanned Aadhaar, PAN, and passport KYC document assets.'
  },
  {
    id: 'AST-115',
    name: 'Treasury Trading Terminal (BSE/NSE/Forex Gateway)',
    type: 'Server',
    businessUnit: 'Treasury & International Ops',
    owner: 'Meera Iyer (VP International Banking)',
    businessValue: 50000000, // ₹5 Crore
    criticality: 'Critical',
    internetExposure: false,
    dataSensitivity: 'High (Financial Only)',
    dependencies: ['AST-106', 'AST-107'],
    currentRiskScore: 56,
    financialExposure: 3200000, // ₹32 Lakh
    expectedAnnualLoss: 720000, // ₹7.2 Lakh
    ipOrLocation: '10.245.3.12 / Leased Line Direct Connect',
    notes: 'Algorithmic currency trading, repo window operations, and government bond auctions.'
  },
  {
    id: 'AST-116',
    name: 'Public Corporate Website & Investor Portal (CMS)',
    type: 'Web Application',
    businessUnit: 'Corporate Marketing & PR',
    owner: 'Alok Sharma (Head of Brand & Digital)',
    businessValue: 5000000, // ₹50 Lakh
    criticality: 'Low',
    internetExposure: true,
    dataSensitivity: 'Low (Internal)',
    dependencies: [],
    currentRiskScore: 42,
    financialExposure: 650000, // ₹6.5 Lakh
    expectedAnnualLoss: 120000, // ₹1.2 Lakh
    ipOrLocation: '203.0.113.88 / Cloudflare Protected Edge',
    notes: 'Public information, branch locators, interest rates, and press releases.'
  }
];

export const INITIAL_VULNERABILITIES: Vulnerability[] = [
  {
    id: 'VUL-201',
    cveId: 'CVE-2024-3400',
    name: 'Palo Alto PAN-OS GlobalProtect Command Injection',
    description: 'Arbitrary command execution with root privileges in GlobalProtect gateway feature allows unauthenticated remote attacker to compromise boundary firewall.',
    cvssScore: 10.0,
    severity: 'Critical',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-101',
    affectedAssetName: 'Payment Gateway Server Cluster',
    exposure: 'External',
    discoveryDate: '2024-04-12',
    remediationStatus: 'In Progress',
    remediationCost: 150000, // ₹1.5 Lakh
    riskContribution: 24.8,
    patchAvailable: true,
    mitigationSteps: 'Apply emergency hotfix hotfix-10.2.9-h1 and restrict telemetry interface access.'
  },
  {
    id: 'VUL-202',
    cveId: 'CVE-2021-44228',
    name: 'Apache Log4j JNDI Remote Code Execution (Log4Shell)',
    description: 'Unauthenticated JNDI injection via LDAP/RMI allows arbitrary code execution on backend transaction processors logging user-controlled headers.',
    cvssScore: 10.0,
    severity: 'Critical',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-104',
    affectedAssetName: 'API Banking Switch (Open Banking Engine)',
    exposure: 'External',
    discoveryDate: '2024-02-18',
    remediationStatus: 'Open',
    remediationCost: 200000, // ₹2 Lakh
    riskContribution: 22.4,
    patchAvailable: true,
    mitigationSteps: 'Upgrade legacy API parser microservice dependency to Log4j 2.17.1.'
  },
  {
    id: 'VUL-203',
    cveId: 'CVE-2024-21413',
    name: 'Microsoft Outlook MonikerLink Remote Code Execution',
    description: 'Vulnerability in Outlook bypassing Protected View when clicking maliciously crafted file:/// URLs, allowing NTLM relaying and arbitrary code execution.',
    cvssScore: 9.8,
    severity: 'Critical',
    exploitability: 'Public PoC Available',
    affectedAssetId: 'AST-110',
    affectedAssetName: 'Employee Laptop & Workstation Fleet (3,000 devices)',
    exposure: 'Internal',
    discoveryDate: '2024-03-05',
    remediationStatus: 'In Progress',
    remediationCost: 350000, // ₹3.5 Lakh
    riskContribution: 19.5,
    patchAvailable: true,
    mitigationSteps: 'Deploy February 2024 Office Security Rollout across all SCCM managed endpoints.'
  },
  {
    id: 'VUL-204',
    cveId: 'CVE-2023-44487',
    name: 'HTTP/2 Rapid Reset Distributed Denial of Service',
    description: 'Abuse of stream cancellation in HTTP/2 allows attackers to generate immense server CPU load with minimal client bandwidth, triggering service outage.',
    cvssScore: 7.5,
    severity: 'High',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-108',
    affectedAssetName: 'Customer Mobile Banking Backend (Microservices)',
    exposure: 'External',
    discoveryDate: '2024-01-20',
    remediationStatus: 'Mitigated',
    remediationCost: 120000,
    riskContribution: 12.1,
    patchAvailable: true,
    mitigationSteps: 'Implemented rate limiting on AWS ALB and enabled Cloudflare Rapid Reset mitigation filters.'
  },
  {
    id: 'VUL-205',
    cveId: 'CVE-2024-23897',
    name: 'Jenkins CLI Arbitrary File Read and Remote Code Execution',
    description: 'args4j command parser weakness permits unauthenticated attackers with overall/read permission to read arbitrary files from Jenkins controller file system.',
    cvssScore: 9.8,
    severity: 'Critical',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-111',
    affectedAssetName: 'Cloud Kubernetes Production Cluster (EKS)',
    exposure: 'Internal',
    discoveryDate: '2024-02-01',
    remediationStatus: 'Open',
    remediationCost: 90000,
    riskContribution: 18.2,
    patchAvailable: true,
    mitigationSteps: 'Disable CLI access in Jenkins system configuration and upgrade to Jenkins 2.442.'
  },
  {
    id: 'VUL-206',
    cveId: 'CVE-2024-1709',
    name: 'ConnectWise ScreenConnect Authentication Bypass',
    description: 'Path traversal flaw allows unauthenticated remote attackers to create administrator accounts and execute arbitrary administrative commands.',
    cvssScore: 10.0,
    severity: 'Critical',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-110',
    affectedAssetName: 'Employee Laptop & Workstation Fleet (3,000 devices)',
    exposure: 'External',
    discoveryDate: '2024-02-22',
    remediationStatus: 'Mitigated',
    remediationCost: 80000,
    riskContribution: 17.5,
    patchAvailable: true,
    mitigationSteps: 'Updated ScreenConnect client and revoked old API tokens.'
  },
  {
    id: 'VUL-207',
    cveId: 'CVE-2023-22515',
    name: 'Atlassian Confluence Server Broken Access Control',
    description: 'Vulnerability allows external unauthenticated attacker to reset system admin password and gain full root control of corporate documentation workspace.',
    cvssScore: 9.8,
    severity: 'Critical',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-103',
    affectedAssetName: 'HR & Payroll Enterprise Portal',
    exposure: 'External',
    discoveryDate: '2024-01-15',
    remediationStatus: 'Open',
    remediationCost: 180000,
    riskContribution: 16.3,
    patchAvailable: true,
    mitigationSteps: 'Upgrade Confluence server to 8.5.3 or isolate behind internal VPN gateway.'
  },
  {
    id: 'VUL-208',
    cveId: 'CVE-2024-27198',
    name: 'JetBrains TeamCity Authentication Bypass',
    description: 'Authentication bypass via alternative path execution in web component allows remote unauthenticated users to create admin token and deploy malicious agents.',
    cvssScore: 9.8,
    severity: 'Critical',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-111',
    affectedAssetName: 'Cloud Kubernetes Production Cluster (EKS)',
    exposure: 'Internal',
    discoveryDate: '2024-03-08',
    remediationStatus: 'In Progress',
    remediationCost: 110000,
    riskContribution: 15.9,
    patchAvailable: true,
    mitigationSteps: 'Apply JetBrains official patch plugin or upgrade CI/CD controller.'
  },
  {
    id: 'VUL-209',
    cveId: 'CVE-2023-46805',
    name: 'Ivanti Connect Secure Authentication Bypass',
    description: 'Control check bypass allows unauthenticated attackers to access restricted endpoints and chain with CVE-2024-21887 command injection.',
    cvssScore: 8.2,
    severity: 'High',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-106',
    affectedAssetName: 'Active Directory Domain Controller (Hybrid)',
    exposure: 'External',
    discoveryDate: '2024-01-28',
    remediationStatus: 'Open',
    remediationCost: 220000,
    riskContribution: 14.7,
    patchAvailable: true,
    mitigationSteps: 'Import vendor XML mitigation package and complete full certificate revocation.'
  },
  {
    id: 'VUL-210',
    cveId: 'CVE-2023-3519',
    name: 'Citrix NetScaler ADC / Gateway Unauthenticated Remote Code Execution',
    description: 'Buffer overflow in SAML handler allows unauthenticated remote attacker to execute arbitrary shell code on boundary appliances.',
    cvssScore: 9.8,
    severity: 'Critical',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-101',
    affectedAssetName: 'Payment Gateway Server Cluster',
    exposure: 'External',
    discoveryDate: '2024-02-14',
    remediationStatus: 'In Progress',
    remediationCost: 190000,
    riskContribution: 16.8,
    patchAvailable: true,
    mitigationSteps: 'Update NetScaler firmware to release 13.1-49.13.'
  },
  {
    id: 'VUL-211',
    cveId: 'CVE-2024-20931',
    name: 'Oracle WebLogic Server Deserialization Vulnerability (T3 Protocol)',
    description: 'Flaw in Core components allows unauthenticated attacker with network access via T3/IIOP to compromise Oracle WebLogic Server.',
    cvssScore: 7.5,
    severity: 'High',
    exploitability: 'Public PoC Available',
    affectedAssetId: 'AST-102',
    affectedAssetName: 'Customer Core Database (PostgreSQL Cluster)',
    exposure: 'Internal',
    discoveryDate: '2024-02-20',
    remediationStatus: 'Open',
    remediationCost: 140000,
    riskContribution: 11.4,
    patchAvailable: true,
    mitigationSteps: 'Block T3 and T3S traffic on internal ingress firewall routes.'
  },
  {
    id: 'VUL-212',
    cveId: 'CVE-2023-29357',
    name: 'Microsoft SharePoint Server Elevation of Privilege',
    description: 'Flaw allows remote unauthenticated attacker to spoof JWT authentication tokens and execute arbitrary administrative actions in SharePoint farms.',
    cvssScore: 9.8,
    severity: 'Critical',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-114',
    affectedAssetName: 'Document Storage & Customer KYC Vault (Ceph & S3)',
    exposure: 'Internal',
    discoveryDate: '2024-01-10',
    remediationStatus: 'In Progress',
    remediationCost: 160000,
    riskContribution: 15.2,
    patchAvailable: true,
    mitigationSteps: 'Apply SharePoint Subscription Edition patch and enable Antimalware Scan Interface (AMSI).'
  },
  {
    id: 'VUL-213',
    cveId: 'CVE-2024-28987',
    name: 'SolarWinds Web Help Desk Hardcoded Credential Vulnerability',
    description: 'Unauthenticated remote actor can access internal system components and modify sensitive ticket data via hardcoded credentials.',
    cvssScore: 9.1,
    severity: 'Critical',
    exploitability: 'Public PoC Available',
    affectedAssetId: 'AST-112',
    affectedAssetName: 'Customer Support CRM & Contact Center System',
    exposure: 'External',
    discoveryDate: '2024-03-12',
    remediationStatus: 'Open',
    remediationCost: 75000,
    riskContribution: 13.0,
    patchAvailable: true,
    mitigationSteps: 'Apply SolarWinds hotfix 12.8.3 HF2.'
  },
  {
    id: 'VUL-214',
    cveId: 'CVE-2024-38856',
    name: 'Apache OFBiz Pre-Authentication Remote Code Execution',
    description: 'Missing authorization check in ControlServlet request handling allows unauthenticated attacker to execute Groovy code directly.',
    cvssScore: 9.8,
    severity: 'Critical',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-109',
    affectedAssetName: 'Enterprise SAP / ERP Financial General Ledger',
    exposure: 'Internal',
    discoveryDate: '2024-04-05',
    remediationStatus: 'In Progress',
    remediationCost: 210000,
    riskContribution: 14.1,
    patchAvailable: true,
    mitigationSteps: 'Upgrade OFBiz to 18.12.15.'
  },
  {
    id: 'VUL-215',
    cveId: 'CVE-2023-36884',
    name: 'Windows MSHTML Platform Remote Code Execution',
    description: 'Specially crafted Office documents lure victims into opening attachments that trigger unauthenticated code execution via MSHTML browser engine.',
    cvssScore: 8.8,
    severity: 'High',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-110',
    affectedAssetName: 'Employee Laptop & Workstation Fleet (3,000 devices)',
    exposure: 'Internal',
    discoveryDate: '2024-01-08',
    remediationStatus: 'Mitigated',
    remediationCost: 50000,
    riskContribution: 8.9,
    patchAvailable: true,
    mitigationSteps: 'Configured Attack Surface Reduction (ASR) rule "Block all Office applications from creating child processes".'
  },
  {
    id: 'VUL-216',
    cveId: 'CVE-2024-21338',
    name: 'Windows Kernel AppLocker Elevation of Privilege',
    description: 'Flaw in appid.sys kernel driver exploited as zero-day by Lazarus ransomware group to disable endpoint security agents via Bring Your Own Vulnerable Driver (BYOVD).',
    cvssScore: 7.8,
    severity: 'High',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-106',
    affectedAssetName: 'Active Directory Domain Controller (Hybrid)',
    exposure: 'Internal',
    discoveryDate: '2024-02-29',
    remediationStatus: 'Open',
    remediationCost: 130000,
    riskContribution: 12.8,
    patchAvailable: true,
    mitigationSteps: 'Enable Microsoft Vulnerable Driver Blocklist in Windows Defender.'
  },
  {
    id: 'VUL-217',
    cveId: 'CVE-2023-20198',
    name: 'Cisco IOS XE Web UI Privilege Escalation',
    description: 'Web UI flaw allows remote unauthenticated attacker to create user account with level 15 privileges and install implant.',
    cvssScore: 10.0,
    severity: 'Critical',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-105',
    affectedAssetName: 'Wealth Management & Trading Platform',
    exposure: 'External',
    discoveryDate: '2024-01-18',
    remediationStatus: 'Mitigated',
    remediationCost: 60000,
    riskContribution: 10.5,
    patchAvailable: true,
    mitigationSteps: 'Disabled HTTP/HTTPS Server feature on edge access routers.'
  },
  {
    id: 'VUL-218',
    cveId: 'CVE-2024-30078',
    name: 'Windows Wi-Fi Driver Remote Code Execution',
    description: 'Unauthenticated attacker within Wi-Fi physical proximity can send malicious packets to an adapter to gain remote execution without user interaction.',
    cvssScore: 8.8,
    severity: 'High',
    exploitability: 'Public PoC Available',
    affectedAssetId: 'AST-110',
    affectedAssetName: 'Employee Laptop & Workstation Fleet (3,000 devices)',
    exposure: 'Internal',
    discoveryDate: '2024-03-22',
    remediationStatus: 'In Progress',
    remediationCost: 175000,
    riskContribution: 9.7,
    patchAvailable: true,
    mitigationSteps: 'Deploy June 2024 Cumulative Windows Update.'
  },
  {
    id: 'VUL-219',
    cveId: 'CVE-2023-48795',
    name: 'Terrapin SSH Protocol Prefix Truncation Vulnerability',
    description: 'Man-in-the-middle attacker can manipulate sequence numbers during the SSH handshake to downgrade connection security and disable keystroke timing obfuscation.',
    cvssScore: 5.9,
    severity: 'Medium',
    exploitability: 'Theoretical',
    affectedAssetId: 'AST-107',
    affectedAssetName: 'SWIFT & Interbank Messaging Hub',
    exposure: 'Internal',
    discoveryDate: '2024-01-22',
    remediationStatus: 'Risk Accepted',
    remediationCost: 40000,
    riskContribution: 4.2,
    patchAvailable: true,
    mitigationSteps: 'OpenSSH strict key exchange mode enabled; risk formally accepted by CISO for legacy terminal gateways.'
  },
  {
    id: 'VUL-220',
    cveId: 'CVE-2024-21762',
    name: 'Fortinet FortiOS SSL-VPN Out-of-Bounds Write',
    description: 'Critical flaw in FortiOS SSL-VPN web portal enables unauthenticated remote attacker to execute arbitrary code or commands via specially crafted HTTP requests.',
    cvssScore: 9.8,
    severity: 'Critical',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-105',
    affectedAssetName: 'Wealth Management & Trading Platform',
    exposure: 'External',
    discoveryDate: '2024-02-11',
    remediationStatus: 'Mitigated',
    remediationCost: 120000,
    riskContribution: 11.2,
    patchAvailable: true,
    mitigationSteps: 'FortiOS updated to version 7.4.3; SSL-VPN web mode disabled.'
  },
  {
    id: 'VUL-221',
    cveId: 'CVE-2023-24489',
    name: 'Citrix ShareFile StorageZones Controller Unauthenticated RCE',
    description: 'Cryptographic flaw in upload handling allows unauthenticated attacker to upload arbitrary shell files and take over enterprise file storage server.',
    cvssScore: 9.8,
    severity: 'Critical',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-114',
    affectedAssetName: 'Document Storage & Customer KYC Vault (Ceph & S3)',
    exposure: 'Internal',
    discoveryDate: '2024-01-30',
    remediationStatus: 'Open',
    remediationCost: 95000,
    riskContribution: 13.6,
    patchAvailable: true,
    mitigationSteps: 'Upgrade StorageZones controller to 5.11.24 or isolate within private VLAN.'
  },
  {
    id: 'VUL-222',
    cveId: 'CVE-2024-23222',
    name: 'Apple WebKit Memory Corruption Type Confusion',
    description: 'Processing maliciously crafted web content may lead to arbitrary code execution; targeted in iOS / macOS corporate mobile banking manager devices.',
    cvssScore: 8.8,
    severity: 'High',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-108',
    affectedAssetName: 'Customer Mobile Banking Backend (Microservices)',
    exposure: 'External',
    discoveryDate: '2024-02-04',
    remediationStatus: 'In Progress',
    remediationCost: 65000,
    riskContribution: 8.4,
    patchAvailable: true,
    mitigationSteps: 'Enforce minimum iOS 17.3 for all executive and administrator MDM registered devices.'
  },
  {
    id: 'VUL-223',
    cveId: 'CVE-2023-49103',
    name: 'ownCloud GraphAPI Information Disclosure (Admin Credentials Leak)',
    description: 'Vulnerable getPhpInfo() function exposes PHP environment variables including admin password, mail server credentials, and S3 encryption keys in plain text.',
    cvssScore: 10.0,
    severity: 'Critical',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-114',
    affectedAssetName: 'Document Storage & Customer KYC Vault (Ceph & S3)',
    exposure: 'Internal',
    discoveryDate: '2024-01-05',
    remediationStatus: 'Mitigated',
    remediationCost: 55000,
    riskContribution: 9.8,
    patchAvailable: true,
    mitigationSteps: 'Deleted vulnerable phpinfo file and rotated all cloud storage secret access keys.'
  },
  {
    id: 'VUL-224',
    cveId: 'CVE-2024-37085',
    name: 'VMware ESXi Authentication Bypass via Active Directory Integration',
    description: 'Attacker with domain administrator access to ESXi hypervisors can gain full administrative rights to all virtual machines without logging credentials.',
    cvssScore: 6.8,
    severity: 'Medium',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-102',
    affectedAssetName: 'Customer Core Database (PostgreSQL Cluster)',
    exposure: 'Internal',
    discoveryDate: '2024-04-18',
    remediationStatus: 'Open',
    remediationCost: 110000,
    riskContribution: 7.2,
    patchAvailable: true,
    mitigationSteps: 'Apply VMware ESXi 8.0 Update 3 and unlink generic "ESX Admins" AD group.'
  },
  {
    id: 'VUL-225',
    cveId: 'CVE-2023-34362',
    name: 'Progress MOVEit Transfer SQL Injection Remote Code Execution',
    description: 'Pre-auth SQL injection in MOVEit Transfer web application leads to unauthorized database access, privilege escalation, and exfiltration of corporate archives.',
    cvssScore: 9.8,
    severity: 'Critical',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-105',
    affectedAssetName: 'Wealth Management & Trading Platform',
    exposure: 'External',
    discoveryDate: '2024-01-12',
    remediationStatus: 'Mitigated',
    remediationCost: 180000,
    riskContribution: 10.2,
    patchAvailable: true,
    mitigationSteps: 'All external automated MFT pipelines transitioned to SFTP with strict IP whitelisting.'
  },
  {
    id: 'VUL-226',
    cveId: 'CVE-2024-21893',
    name: 'Ivanti Neurons Server-Side Request Forgery (SSRF)',
    description: 'SSRF in the SAML component of Ivanti Connect Secure allows remote attacker to access protected internal resources without authentication.',
    cvssScore: 8.2,
    severity: 'High',
    exploitability: 'Active Exploit in Wild',
    affectedAssetId: 'AST-103',
    affectedAssetName: 'HR & Payroll Enterprise Portal',
    exposure: 'External',
    discoveryDate: '2024-02-09',
    remediationStatus: 'Open',
    remediationCost: 125000,
    riskContribution: 11.8,
    patchAvailable: true,
    mitigationSteps: 'Enforce WAF rule blocking `/dana-ws/saml.ws` and apply patch.'
  }
];

export const INITIAL_CONTROLS: SecurityControl[] = [
  {
    id: 'SEC-01',
    name: 'Enterprise Multi-Factor Authentication (MFA & FIDO2)',
    category: 'Identity & Access',
    status: 'Active',
    effectivenessPercent: 88,
    annualCost: 1800000, // ₹18 Lakh
    affectedAssetIds: ['AST-101', 'AST-103', 'AST-105', 'AST-106', 'AST-110', 'AST-112', 'AST-113'],
    relatedRisks: ['Credential Stuffing', 'Phishing Account Takeover', 'Privilege Escalation'],
    owner: 'Gaurav Sen (Identity & Access Lead)',
    coveragePercent: 92,
    description: 'Hardware token & biometric MFA enforced across all internal and cloud enterprise portals.'
  },
  {
    id: 'SEC-02',
    name: 'Endpoint Detection and Response (EDR / XDR Agent)',
    category: 'Endpoint Security',
    status: 'Active',
    effectivenessPercent: 82,
    annualCost: 2400000, // ₹24 Lakh
    affectedAssetIds: ['AST-101', 'AST-106', 'AST-109', 'AST-110', 'AST-115'],
    relatedRisks: ['Ransomware Execution', 'Memory Injection', 'Lateral Movement'],
    owner: 'Pooja Bhatt (Endpoint Security Manager)',
    coveragePercent: 85,
    description: 'Real-time behavioral telemetry, automated isolation, and script containment on 3,100 endpoints.'
  },
  {
    id: 'SEC-03',
    name: 'Micro-Segmentation & Zero Trust Network Access (ZTNA)',
    category: 'Network Defense',
    status: 'Partially Implemented',
    effectivenessPercent: 62,
    annualCost: 1500000, // ₹15 Lakh
    affectedAssetIds: ['AST-101', 'AST-102', 'AST-104', 'AST-107'],
    relatedRisks: ['Inter-VPC Lateral Movement', 'Database Scraping', 'Internal Sniffing'],
    owner: 'Kiran Verma (Chief Systems Architect)',
    coveragePercent: 54,
    description: 'Restricts East-West traffic between web tier, application tier, and core database clusters.'
  },
  {
    id: 'SEC-04',
    name: 'Immutable Air-Gapped Backups & DR Automation',
    category: 'Resilience',
    status: 'Active',
    effectivenessPercent: 86,
    annualCost: 1200000, // ₹12 Lakh
    affectedAssetIds: ['AST-101', 'AST-102', 'AST-107', 'AST-109', 'AST-114'],
    relatedRisks: ['Ransomware Encryption', 'Wiper Malware', 'Catastrophic Data Loss'],
    owner: 'Sneha Ranganathan (Head of Data Infrastructure)',
    coveragePercent: 90,
    description: 'WORM (Write Once Read Many) snapshot retention across isolated secondary data center in Hyderabad.'
  },
  {
    id: 'SEC-05',
    name: 'Automated Vulnerability & Patch Management Pipeline',
    category: 'Endpoint Security',
    status: 'Partially Implemented',
    effectivenessPercent: 58,
    annualCost: 950000, // ₹9.5 Lakh
    affectedAssetIds: ['AST-101', 'AST-103', 'AST-104', 'AST-108', 'AST-110', 'AST-111'],
    relatedRisks: ['Zero-Day Exploitation', 'Known CVE Exploits', 'Public Gateway Compromise'],
    owner: 'Deepak Patel (IT Workplace Operations)',
    coveragePercent: 68,
    description: 'Weekly automated vulnerability scans with SLA-governed 14-day critical patch deployment window.'
  },
  {
    id: 'SEC-06',
    name: 'Privileged Access Management (PAM & Just-In-Time Access)',
    category: 'Identity & Access',
    status: 'Active',
    effectivenessPercent: 84,
    annualCost: 1400000, // ₹14 Lakh
    affectedAssetIds: ['AST-102', 'AST-106', 'AST-107', 'AST-109', 'AST-111'],
    relatedRisks: ['Rogue Administrator', 'Credential Theft', 'Golden Ticket Attack'],
    owner: 'Gaurav Sen (Identity & Access Lead)',
    coveragePercent: 88,
    description: 'Vaulted root/admin credentials, session recording, and dual-authorization approvals for production.'
  },
  {
    id: 'SEC-07',
    name: '24/7 Managed Security Operations Center (SIEM/SOC)',
    category: 'Threat Detection',
    status: 'Active',
    effectivenessPercent: 79,
    annualCost: 3200000, // ₹32 Lakh
    affectedAssetIds: ['AST-101', 'AST-102', 'AST-104', 'AST-105', 'AST-106', 'AST-108', 'AST-111'],
    relatedRisks: ['Undetected Breach', 'DDoS Extortion', 'Data Exfiltration in Progress'],
    owner: 'Tanya Banerjee (Head of Threat Intelligence & SOC)',
    coveragePercent: 91,
    description: '15-minute mean time to acknowledge (MTTA) for high-severity alerts with SOAR playbooks.'
  },
  {
    id: 'SEC-08',
    name: 'Next-Generation Web Application Firewall (WAF) & DDoS Shield',
    category: 'Network Defense',
    status: 'Active',
    effectivenessPercent: 85,
    annualCost: 1600000, // ₹16 Lakh
    affectedAssetIds: ['AST-101', 'AST-103', 'AST-104', 'AST-105', 'AST-108', 'AST-116'],
    relatedRisks: ['SQL Injection', 'HTTP/2 Rapid Reset', 'Automated Scraping & Credential Stuffing'],
    owner: 'Arjun Mehta (VP Payments Tech)',
    coveragePercent: 94,
    description: 'Cloud edge inspection filtering OWASP Top 10 vulnerabilities, bot mitigation, and rate limiting.'
  },
  {
    id: 'SEC-09',
    name: 'Data Loss Prevention (DLP) & Field-Level Encryption',
    category: 'Data Protection',
    status: 'Partially Implemented',
    effectivenessPercent: 60,
    annualCost: 1100000, // ₹11 Lakh
    affectedAssetIds: ['AST-102', 'AST-103', 'AST-112', 'AST-114'],
    relatedRisks: ['Customer KYC Data Leak', 'Regulatory DPDP Act Fines', 'Exfiltration via USB/Email'],
    owner: 'Sneha Ranganathan (Head of Data Infrastructure)',
    coveragePercent: 62,
    description: 'AES-256 GCM tokenization for PAN/Aadhaar fields and endpoint DLP monitoring on removable media.'
  },
  {
    id: 'SEC-10',
    name: 'Security Awareness Training & Anti-Phishing Simulations',
    category: 'Identity & Access',
    status: 'Active',
    effectivenessPercent: 68,
    annualCost: 450000, // ₹4.5 Lakh
    affectedAssetIds: ['AST-110', 'AST-113'],
    relatedRisks: ['Spear-Phishing', 'CEO Fraud / Wire Fraud', 'Malicious Attachment Downloads'],
    owner: 'Vikram Joshi (Dir. Enterprise Systems)',
    coveragePercent: 96,
    description: 'Monthly randomized phishing simulations with mandatory refresher courses for repeat clickers.'
  },
  {
    id: 'SEC-11',
    name: 'API Security Gateway & Behavioral Token Validation',
    category: 'Network Defense',
    status: 'Planned',
    effectivenessPercent: 45,
    annualCost: 800000, // ₹8 Lakh
    affectedAssetIds: ['AST-101', 'AST-104', 'AST-108'],
    relatedRisks: ['Broken Object Level Authorization (BOLA)', 'API Parameter Tampering'],
    owner: 'Pooja Nair (Lead Fintech Integration)',
    coveragePercent: 40,
    description: 'Inspection of JSON payload structures, OAuth 2.0 MTLS validation, and third-party rate bounds.'
  }
];

export const INITIAL_THREATS: ThreatIntelligence[] = [
  {
    id: 'THR-301',
    name: 'LockBit 3.0 / BlackCat Ransomware Syndicate',
    category: 'Ransomware Syndicate',
    likelihood: 'High',
    severity: 'Critical',
    targetAssets: ['Payment Gateway Server Cluster', 'Customer Core Database', 'HR & Payroll Enterprise Portal'],
    source: 'CERT-In Advisory / Sectoral Fin-ISAC',
    firstObserved: '2023-11-04',
    lastObserved: '2024-04-19',
    trend: 'Increasing',
    tactics: ['Initial access via unpatched VPN', 'BYOVD driver disabling', 'Double extortion data leak'],
    mitigationAdvice: 'Audit GlobalProtect VPN gateways, enforce immutable backups, and test DR failover within 4 hours.'
  },
  {
    id: 'THR-302',
    name: 'Lazarus Group / APT38 (Financially Motivated State Actor)',
    category: 'Nation-State APT',
    likelihood: 'Medium',
    severity: 'Critical',
    targetAssets: ['SWIFT & Interbank Messaging Hub', 'Treasury Trading Terminal', 'API Banking Switch'],
    source: 'Financial Sector Intelligence Exchange (FSIE)',
    firstObserved: '2023-08-14',
    lastObserved: '2024-03-30',
    trend: 'Stable',
    tactics: ['Supply chain watering holes', 'Targeted LinkedIn spear-phishing', 'Fast-cash fraudulent SWIFT wire commands'],
    mitigationAdvice: 'Strict four-eye verification on high-value wire transfers above ₹50 Lakh and segregated SWIFT air-gap.'
  },
  {
    id: 'THR-303',
    name: 'Scattered Spider / Star Blizzard Credential Ring',
    category: 'Financial Cybercrime',
    likelihood: 'High',
    severity: 'High',
    targetAssets: ['Active Directory Domain Controller', 'Customer Support CRM', 'Corporate Email'],
    source: 'Dark Web Threat Feed & Cloud Telemetry',
    firstObserved: '2024-01-09',
    lastObserved: '2024-04-22',
    trend: 'Increasing',
    tactics: ['Helpdesk vishing social engineering', 'MFA push fatigue bombardment', 'SIM swapping telecom relays'],
    mitigationAdvice: 'Transition all support staff and sysadmins from push notification MFA to FIDO2 hardware YubiKeys.'
  },
  {
    id: 'THR-304',
    name: 'HTTP/2 Rapid Reset & Terabit DDoS Extortionists',
    category: 'DDoS Extortion',
    likelihood: 'Very High',
    severity: 'High',
    targetAssets: ['Payment Gateway Server Cluster', 'Customer Mobile Banking Backend', 'API Banking Switch'],
    source: 'Global Tier-1 Transit Telemetry',
    firstObserved: '2023-10-10',
    lastObserved: '2024-04-15',
    trend: 'Increasing',
    tactics: ['HTTP/2 stream multiplex reset loops', 'NTP/SSDP UDP amplification', 'Ransom extortion notes demanding Bitcoin'],
    mitigationAdvice: 'Keep edge DDoS scrubbing always-on and contract automated BGP rerouting mitigation.'
  },
  {
    id: 'THR-305',
    name: 'Rogue Employee / Collusive Insider Access',
    category: 'Insider Threat',
    likelihood: 'Low',
    severity: 'Critical',
    targetAssets: ['Customer Core Database', 'Document Storage & Customer KYC Vault', 'Enterprise SAP ERP'],
    source: 'Internal Audit & Fraud Risk Cell',
    firstObserved: '2023-06-20',
    lastObserved: '2024-02-14',
    trend: 'Stable',
    tactics: ['Bulk database exfiltration to personal cloud', 'Privileged token forging', 'Customer data resale to loan brokers'],
    mitigationAdvice: 'Enforce database query DLP thresholds (max 200 records/hr) and dual-custody access for KYC bulk export.'
  },
  {
    id: 'THR-306',
    name: 'Third-Party Open Banking FinTech SDK Vulnerability',
    category: 'Supply Chain Hijack',
    likelihood: 'Medium',
    severity: 'High',
    targetAssets: ['Customer Mobile Banking Backend', 'API Banking Switch'],
    source: 'OpenSSF & CVE National Database',
    firstObserved: '2024-02-02',
    lastObserved: '2024-04-10',
    trend: 'Increasing',
    tactics: ['Malicious npm/PyPI package version poisoning', 'Typosquatting banking utilities', 'Unauthenticated telemetry exfiltration'],
    mitigationAdvice: 'Implement Software Bill of Materials (SBOM) scanner in CI/CD pipeline and pin cryptographic hashes.'
  },
  {
    id: 'THR-307',
    name: 'Automated Account Takeover (ATO) & Credential Stuffing Bots',
    category: 'Financial Cybercrime',
    likelihood: 'Very High',
    severity: 'Medium',
    targetAssets: ['Customer Mobile Banking Backend', 'Wealth Management Platform'],
    source: 'Darknet Leaked Combo Lists Feed',
    firstObserved: '2023-04-15',
    lastObserved: '2024-04-24',
    trend: 'Increasing',
    tactics: ['Rotating residential proxy infrastructure', 'Bypassing CAPTCHA via headless browser farms', 'Low-and-slow login attempts'],
    mitigationAdvice: 'Deploy behavioral biometrics on login screens (mouse velocity, typing cadence) and IP reputation scoring.'
  },
  {
    id: 'THR-308',
    name: 'Business Email Compromise (BEC) & Invoice Redirection Fraud',
    category: 'Financial Cybercrime',
    likelihood: 'Medium',
    severity: 'High',
    targetAssets: ['Corporate Email & M365 Workspace', 'Enterprise SAP ERP'],
    source: 'Banking Vigilance Advisory Circular',
    firstObserved: '2023-09-12',
    lastObserved: '2024-03-18',
    trend: 'Decreasing',
    tactics: ['Executive impersonation', 'Mailbox forwarding rule injection', 'Altered vendor bank account IFSC details'],
    mitigationAdvice: 'Out-of-band telephone verification for vendor bank detail modifications above ₹2 Lakh.'
  },
  {
    id: 'THR-309',
    name: 'Public Cloud Storage Misconfiguration Crawlers',
    category: 'Supply Chain Hijack',
    likelihood: 'High',
    severity: 'High',
    targetAssets: ['Document Storage & Customer KYC Vault', 'Cloud Kubernetes Cluster'],
    source: 'Automated Cloud Security Posture Management (CSPM)',
    firstObserved: '2023-05-18',
    lastObserved: '2024-04-02',
    trend: 'Decreasing',
    tactics: ['Public S3 bucket enumeration', 'Unauthenticated Elasticsearch clusters', 'Exposed .env configuration dumps'],
    mitigationAdvice: 'Enable AWS S3 Block Public Access at the organization root level and run continuous drift detection.'
  },
  {
    id: 'THR-310',
    name: 'SIM Swap & Telecom SMS OTP Interception Network',
    category: 'Financial Cybercrime',
    likelihood: 'Medium',
    severity: 'High',
    targetAssets: ['Customer Mobile Banking Backend', 'Payment Gateway Server Cluster'],
    source: 'Telecom Regulatory Authority / Cyber Police Bulletin',
    firstObserved: '2023-12-01',
    lastObserved: '2024-04-16',
    trend: 'Stable',
    tactics: ['Collusive retail SIM store fraudulent re-issue', 'SS7 signaling protocol manipulation', 'Rapid fund drain via UPI handles'],
    mitigationAdvice: 'Implement SIM binding API check before completing high-value UPI or password reset transactions.'
  }
];

export const INITIAL_INCIDENTS: SecurityIncident[] = [
  {
    id: 'INC-2024-089',
    title: 'Distributed Denial of Service on NetBanking Gateway',
    incidentType: 'DDoS Interruption',
    affectedAssetId: 'AST-101',
    affectedAssetName: 'Payment Gateway Server Cluster',
    date: '2024-03-28',
    severity: 'High',
    downtimeHours: 2.5,
    dataAffected: 'Zero customer records lost. Payment gateway timeout for 45,000 requests.',
    recoveryCost: 350000, // ₹3.5 Lakh
    businessLoss: 1200000, // ₹12 Lakh
    regulatoryCost: 0,
    totalFinancialImpact: 1550000, // ₹15.5 Lakh
    status: 'Resolved',
    rootCause: '480 Gbps UDP reflection flood saturated boundary router before automated BGP scrubbing triggered.'
  },
  {
    id: 'INC-2024-074',
    title: 'Ransomware Stage-1 Execution Attempt on Backup Staging Node',
    incidentType: 'Ransomware Attack',
    affectedAssetId: 'AST-104',
    affectedAssetName: 'API Banking Switch (Open Banking Engine)',
    date: '2024-02-14',
    severity: 'Critical',
    downtimeHours: 0.8,
    dataAffected: 'Test environment staging files encrypted; production database untouched.',
    recoveryCost: 850000, // ₹8.5 Lakh
    businessLoss: 400000, // ₹4 Lakh
    regulatoryCost: 250000, // ₹2.5 Lakh (Audit & forensic compliance)
    totalFinancialImpact: 1500000, // ₹15 Lakh
    status: 'Remediated',
    rootCause: 'Phishing email compromised developer laptop credentials; attacker reached unsegmented staging server.'
  },
  {
    id: 'INC-2024-061',
    title: 'Mass Credential Stuffing Wave on Retail Customer Portal',
    incidentType: 'Credential Stuffing',
    affectedAssetId: 'AST-108',
    affectedAssetName: 'Customer Mobile Banking Backend (Microservices)',
    date: '2024-01-29',
    severity: 'Medium',
    downtimeHours: 0,
    dataAffected: '34 accounts compromised via password reuse; locked automatically before transactions cleared.',
    recoveryCost: 200000, // ₹2 Lakh
    businessLoss: 150000, // ₹1.5 Lakh
    regulatoryCost: 0,
    totalFinancialImpact: 350000, // ₹3.5 Lakh
    status: 'Resolved',
    rootCause: 'Dark web credential dump used in automated dictionary assault; rate limiting rule tightened.'
  },
  {
    id: 'INC-2024-055',
    title: 'Unauthorized API Key Access from Unknown Overseas IP',
    incidentType: 'Unauthorized API Access',
    affectedAssetId: 'AST-104',
    affectedAssetName: 'API Banking Switch (Open Banking Engine)',
    date: '2024-01-08',
    severity: 'High',
    downtimeHours: 1.2,
    dataAffected: 'Aggregator sandbox test credentials leaked via public GitHub repository commit.',
    recoveryCost: 450000, // ₹4.5 Lakh
    businessLoss: 300000, // ₹3 Lakh
    regulatoryCost: 100000,
    totalFinancialImpact: 850000, // ₹8.5 Lakh
    status: 'Remediated',
    rootCause: 'Contractor developer committed configuration file with hardcoded testing secret.'
  },
  {
    id: 'INC-2024-042',
    title: 'Vendor Support VPN Compromise via Unpatched Gateway',
    incidentType: 'Unauthorized API Access',
    affectedAssetId: 'AST-106',
    affectedAssetName: 'Active Directory Domain Controller (Hybrid)',
    date: '2023-12-19',
    severity: 'Critical',
    downtimeHours: 4.0,
    dataAffected: 'Internal directory read queries detected; no sensitive customer databases accessed.',
    recoveryCost: 1200000, // ₹12 Lakh
    businessLoss: 800000, // ₹8 Lakh
    regulatoryCost: 500000, // ₹5 Lakh
    totalFinancialImpact: 2500000, // ₹25 Lakh
    status: 'Resolved',
    rootCause: 'Third-party vendor laptop breached; attacker used cached split-tunnel VPN credentials.'
  },
  {
    id: 'INC-2024-033',
    title: 'Executive Spear-Phishing Attempt (CFO Impersonation)',
    incidentType: 'Phishing Breach',
    affectedAssetId: 'AST-113',
    affectedAssetName: 'Corporate Email & M365 Cloud Workspace',
    date: '2023-11-27',
    severity: 'Medium',
    downtimeHours: 0,
    dataAffected: 'Zero funds disbursed; flagged by Treasury desk secondary confirmation protocol.',
    recoveryCost: 80000,
    businessLoss: 0,
    regulatoryCost: 0,
    totalFinancialImpact: 80000,
    status: 'Resolved',
    rootCause: 'Spoofed lookalike domain `acmefinanciial.in` requested urgent ₹85 Lakh vendor payment.'
  },
  {
    id: 'INC-2024-028',
    title: 'Development S3 Bucket Misconfiguration (Exposed Logs)',
    incidentType: 'Data Leakage',
    affectedAssetId: 'AST-114',
    affectedAssetName: 'Document Storage & Customer KYC Vault (Ceph & S3)',
    date: '2023-10-12',
    severity: 'High',
    downtimeHours: 0,
    dataAffected: '12,000 anonymized transaction log lines accessible publicly for 18 hours before discovery.',
    recoveryCost: 350000,
    businessLoss: 250000,
    regulatoryCost: 600000, // ₹6 Lakh (RBI Self-disclosure reporting)
    totalFinancialImpact: 1200000, // ₹12 Lakh
    status: 'Remediated',
    rootCause: 'Terraform script default permissions set ACL to public-read during sandbox deployment.'
  },
  {
    id: 'INC-2024-019',
    title: 'Privilege Escalation Attempt on Treasury Database Node',
    incidentType: 'Unauthorized API Access',
    affectedAssetId: 'AST-115',
    affectedAssetName: 'Treasury Trading Terminal (BSE/NSE/Forex Gateway)',
    date: '2023-09-04',
    severity: 'High',
    downtimeHours: 1.5,
    dataAffected: 'Local system event log cleared by rogue script; killed by EDR behavioral rule.',
    recoveryCost: 600000,
    businessLoss: 450000,
    regulatoryCost: 150000,
    totalFinancialImpact: 1200000,
    status: 'Resolved',
    rootCause: 'Unpatched local kernel vulnerability (Dirty Pipe) triggered on auxiliary reporting host.'
  },
  {
    id: 'INC-2024-012',
    title: 'Edge Firewall Zero-Day Exploit Probe (PAN-OS GlobalProtect)',
    incidentType: 'Unauthorized API Access',
    affectedAssetId: 'AST-101',
    affectedAssetName: 'Payment Gateway Server Cluster',
    date: '2023-07-21',
    severity: 'Medium',
    downtimeHours: 0.5,
    dataAffected: 'Firewall telemetry inspection probed; blocked by upstream IPS rule.',
    recoveryCost: 150000,
    businessLoss: 100000,
    regulatoryCost: 0,
    totalFinancialImpact: 250000,
    status: 'Resolved',
    rootCause: 'Automated internet-wide scanner probed vulnerable telemetry socket.'
  },
  {
    id: 'INC-2024-004',
    title: 'SSL/TLS Certificate Expiration on Secondary API Endpoint',
    incidentType: 'DDoS Interruption',
    affectedAssetId: 'AST-104',
    affectedAssetName: 'API Banking Switch (Open Banking Engine)',
    date: '2023-05-10',
    severity: 'Low',
    downtimeHours: 1.1,
    dataAffected: 'Partner API requests received SSL invalid warning for 66 minutes.',
    recoveryCost: 50000,
    businessLoss: 180000,
    regulatoryCost: 0,
    totalFinancialImpact: 230000,
    status: 'Resolved',
    rootCause: 'Certificate lifecycle automation failed to renew Let\'s Encrypt token on secondary webhook.'
  }
];

export const INITIAL_COMPLIANCE_ITEMS: ComplianceItem[] = [
  // ISO/IEC 27001:2022
  {
    id: 'CMP-ISO-01',
    framework: 'ISO/IEC 27001',
    controlId: 'A.5.15',
    controlName: 'Access Control & Authentication',
    domain: 'Organizational Controls',
    status: 'Compliant',
    evidence: 'MFA enforced on 92% of corporate applications; PAM vaulting active for production databases.',
    gapAnalysis: 'Minor delay in offboarding external vendor accounts within 24-hour SLA.',
    remediationPlan: 'Integrate HR Workday webhooks with Active Directory automated deprovisioning queue.',
    responsibleTeam: 'IAM & Directory Services'
  },
  {
    id: 'CMP-ISO-02',
    framework: 'ISO/IEC 27001',
    controlId: 'A.8.8',
    controlName: 'Management of Technical Vulnerabilities',
    domain: 'Technological Controls',
    status: 'Partially Compliant',
    evidence: 'Tenable weekly scan reports available; critical CVE patch window average is 18 days.',
    gapAnalysis: 'SLA target is 14 days for critical vulnerabilities; currently exceeding on legacy gateways.',
    remediationPlan: 'Implement automated patch deployment for Linux container hosts in Payments VPC.',
    responsibleTeam: 'SecOps & Infrastructure'
  },
  {
    id: 'CMP-ISO-03',
    framework: 'ISO/IEC 27001',
    controlId: 'A.8.24',
    controlName: 'Use of Cryptography & Key Management',
    domain: 'Technological Controls',
    status: 'Compliant',
    evidence: 'HSM modules deployed for payment card keys; AES-256 for all databases at rest.',
    gapAnalysis: 'No major gaps; quarterly cryptographic key rotation verified by internal audit.',
    remediationPlan: 'Maintain current HSM firmware support contract.',
    responsibleTeam: 'Data Security & Cryptography'
  },

  // NIST CSF 2.0
  {
    id: 'CMP-NIST-01',
    framework: 'NIST CSF 2.0',
    controlId: 'GV.OC-01',
    controlName: 'Organizational Context & Risk Appetite',
    domain: 'GOVERN (GV)',
    status: 'Compliant',
    evidence: 'Board-approved cyber risk policy with explicit ₹5 Crore financial exposure tolerance threshold.',
    gapAnalysis: 'Need continuous alignment between business unit risk owners and CISO dashboard.',
    remediationPlan: 'Provide monthly automated executive risk quantification reports to Risk Committee.',
    responsibleTeam: 'Enterprise Risk Management'
  },
  {
    id: 'CMP-NIST-02',
    framework: 'NIST CSF 2.0',
    controlId: 'PR.DS-01',
    controlName: 'Data Security & Confidentiality at Rest',
    domain: 'PROTECT (PR)',
    status: 'Partially Compliant',
    evidence: 'Production databases encrypted; endpoint DLP agent deployed on 62% of corporate workstations.',
    gapAnalysis: 'Endpoint DLP coverage gap on remote branch workstations poses customer data leak risk.',
    remediationPlan: 'Expand DLP agent rollout to remaining 1,100 branch devices by Q3.',
    responsibleTeam: 'Endpoint Security Team'
  },
  {
    id: 'CMP-NIST-03',
    framework: 'NIST CSF 2.0',
    controlId: 'DE.CM-01',
    controlName: 'Continuous Security Monitoring & SIEM Coverage',
    domain: 'DETECT (DE)',
    status: 'Compliant',
    evidence: '24/7 SOC monitors 91% of core assets; automated alert ingestion into SOAR pipeline.',
    gapAnalysis: 'Cloud VPC flow logs latency during peak transaction hours.',
    remediationPlan: 'Upgrade AWS Kinesis ingestion buffer for VPC flow telemetry.',
    responsibleTeam: 'SOC & Threat Detection'
  },

  // CIS Controls v8
  {
    id: 'CMP-CIS-01',
    framework: 'CIS Controls v8',
    controlId: 'CIS-01.1',
    controlName: 'Establish and Maintain a Detailed Enterprise Asset Inventory',
    domain: 'Asset Management',
    status: 'Compliant',
    evidence: 'Automated network discovery and CMDB synchronization running daily.',
    gapAnalysis: 'Shadow cloud testing environments occasionally spun up without pre-registration.',
    remediationPlan: 'Enforce AWS Organizations SCP blocking unapproved VPC creations.',
    responsibleTeam: 'Cloud Governance'
  },
  {
    id: 'CMP-CIS-02',
    framework: 'CIS Controls v8',
    controlId: 'CIS-06.3',
    controlName: 'Require MFA for Externally-Exposed Applications',
    domain: 'Access Control',
    status: 'Compliant',
    evidence: '100% of external web applications and VPN gateways require MFA token or FIDO2.',
    gapAnalysis: 'None identified for external tier.',
    remediationPlan: 'Maintain strict conditional access policies.',
    responsibleTeam: 'IAM Team'
  },
  {
    id: 'CMP-CIS-03',
    framework: 'CIS Controls v8',
    controlId: 'CIS-11.1',
    controlName: 'Establish and Maintain a Data Recovery Process',
    domain: 'Data Recovery',
    status: 'Compliant',
    evidence: 'Automated immutable snapshot backups with bi-annual dry-run disaster recovery restoration.',
    gapAnalysis: 'Recovery Time Objective (RTO) achieved in 3.5 hrs (target was 2.0 hrs) for secondary ledgers.',
    remediationPlan: 'Provision dedicated high-bandwidth 10Gbps fiber link between Mumbai and Hyderabad DR.',
    responsibleTeam: 'Infrastructure & Storage'
  },

  // RBI Cyber Security Framework
  {
    id: 'CMP-RBI-01',
    framework: 'RBI Cyber Security Framework',
    controlId: 'RBI-CS-04',
    controlName: 'Network Segmentation & Segregation of Banking Zones',
    domain: 'Network Security',
    status: 'Partially Compliant',
    evidence: 'Payment network separated from corporate LAN via physical firewalls.',
    gapAnalysis: 'Internal micro-segmentation inside the payments Kubernetes cluster is in pilot stage.',
    remediationPlan: 'Deploy Cilium service mesh network policies across all container pods.',
    responsibleTeam: 'DevSecOps & Network Engineering'
  },
  {
    id: 'CMP-RBI-02',
    framework: 'RBI Cyber Security Framework',
    controlId: 'RBI-CS-09',
    controlName: 'Security Operations Centre (SOC) & CERT-In Reporting',
    domain: 'Incident Management',
    status: 'Compliant',
    evidence: 'Formal 6-hour incident reporting workflow documented and tested with CERT-In mock drills.',
    gapAnalysis: 'No compliance gaps detected during last annual statutory RBI IT inspection.',
    remediationPlan: 'Conduct quarterly tabletop crisis response simulation with executive leadership.',
    responsibleTeam: 'CISO Office & Regulatory Compliance'
  },
  {
    id: 'CMP-RBI-03',
    framework: 'RBI Cyber Security Framework',
    controlId: 'RBI-CS-14',
    controlName: 'Customer Data Protection & Consent Management (DPDP Act)',
    domain: 'Data Privacy',
    status: 'Partially Compliant',
    evidence: 'Consent records logged for new mobile app signups; data masking active on customer care screens.',
    gapAnalysis: 'Historical paper KYC archives digitized into legacy file shares need complete tokenization.',
    remediationPlan: 'Complete field-level tokenization project for KYC Vault by November 2024.',
    responsibleTeam: 'Data Governance & Legal'
  },

  // SEBI CSCRF
  {
    id: 'CMP-SEBI-01',
    framework: 'SEBI CSCRF',
    controlId: 'SEBI-CSCRF-03',
    controlName: 'Cyber Resilience & Business Continuity for Trading Systems',
    domain: 'Business Continuity',
    status: 'Compliant',
    evidence: 'Wealth Management platform has live synchronous replication with zero data loss (RPO = 0).',
    gapAnalysis: 'Failover testing required during non-market Saturday windows twice a year.',
    remediationPlan: 'Schedule mandatory secondary exchange live simulation for July.',
    responsibleTeam: 'Capital Markets IT'
  },
  {
    id: 'CMP-SEBI-02',
    framework: 'SEBI CSCRF',
    controlId: 'SEBI-CSCRF-07',
    controlName: 'Third-Party / Vendor Risk Assessment & API Governance',
    domain: 'Third-Party Risk',
    status: 'Partially Compliant',
    evidence: 'Vendor security questionnaire required for all tier-1 software partners.',
    gapAnalysis: 'Automated continuous vulnerability tracking of third-party APIs not fully integrated.',
    remediationPlan: 'Deploy API security gateway with automated token telemetry inspection.',
    responsibleTeam: 'Vendor Risk Management'
  }
];

export const INITIAL_SIMULATION_ACTIONS: SimulationAction[] = [
  {
    id: 'ACT-01',
    name: 'Enable Universal FIDO2 Hardware MFA for All Critical Assets',
    category: 'Identity & Access',
    cost: 1500000, // ₹15 Lakh
    riskReductionPercent: 22,
    financialLossReduction: 2400000, // ₹24 Lakh
    targetedControlId: 'SEC-01',
    enabled: true,
    description: 'Eliminates credential stuffing and push fatigue attacks on internal banking switches and administrator consoles.'
  },
  {
    id: 'ACT-02',
    name: 'Emergency Patching Campaign (CVE-2024-3400 & Log4j Remediation)',
    category: 'Vulnerability Management',
    cost: 850000, // ₹8.5 Lakh
    riskReductionPercent: 18,
    financialLossReduction: 1950000, // ₹19.5 Lakh
    targetedControlId: 'SEC-05',
    enabled: true,
    description: 'Directly resolves the two highest-contributing vulnerabilities on payment clusters and open banking switches.'
  },
  {
    id: 'ACT-03',
    name: 'Implement Zero-Trust Micro-Segmentation in Payments VPC',
    category: 'Network Defense',
    cost: 2200000, // ₹22 Lakh
    riskReductionPercent: 26,
    financialLossReduction: 2850000, // ₹28.5 Lakh
    targetedControlId: 'SEC-03',
    enabled: false,
    description: 'Isolates payment gateway from secondary workloads, reducing single-loss blast radius by 70%.'
  },
  {
    id: 'ACT-04',
    name: 'Increase EDR / XDR Coverage from 85% to 99% Across Fleet',
    category: 'Endpoint Security',
    cost: 1200000, // ₹12 Lakh
    riskReductionPercent: 14,
    financialLossReduction: 1500000, // ₹15 Lakh
    targetedControlId: 'SEC-02',
    enabled: false,
    description: 'Closes endpoint blind spots on 450 branch devices, preventing ransomware lateral staging.'
  },
  {
    id: 'ACT-05',
    name: 'Upgrade Immutable Backups & Automated 1-Hour DR Standby',
    category: 'Resilience',
    cost: 950000, // ₹9.5 Lakh
    riskReductionPercent: 12,
    financialLossReduction: 1300000, // ₹13 Lakh
    targetedControlId: 'SEC-04',
    enabled: false,
    description: 'Guarantees rapid recovery from extortion or destructive wiper attacks without paying ransom.'
  },
  {
    id: 'ACT-06',
    name: 'Deploy Dedicated API Security Gateway with Behavioral ML Rules',
    category: 'Network Defense',
    cost: 800000, // ₹8 Lakh
    riskReductionPercent: 10,
    financialLossReduction: 1100000, // ₹11 Lakh
    targetedControlId: 'SEC-11',
    enabled: false,
    description: 'Stops automated BOLA scraping, parameter tampering, and credential abuse on open banking endpoints.'
  }
];

export const INITIAL_INVESTMENT_CANDIDATES: InvestmentCandidate[] = [
  {
    id: 'INV-01',
    name: 'FIDO2 Hardware MFA & Conditional Zero-Trust Access',
    category: 'Identity & Access',
    cost: 1500000, // ₹15 Lakh
    annualSavings: 2400000, // ₹24 Lakh
    riskReductionPercent: 22,
    financialBenefit: 2400000,
    rosiPercent: 60,
    priority: 'High',
    recommended: true
  },
  {
    id: 'INV-02',
    name: 'Zero-Trust Micro-Segmentation (Payments & Core DB)',
    category: 'Network Defense',
    cost: 2200000, // ₹22 Lakh
    annualSavings: 2850000, // ₹28.5 Lakh
    riskReductionPercent: 26,
    financialBenefit: 2850000,
    rosiPercent: 30,
    priority: 'High',
    recommended: true
  },
  {
    id: 'INV-03',
    name: 'Fleet-wide EDR / XDR Coverage Expansion (99%)',
    category: 'Endpoint Security',
    cost: 1200000, // ₹12 Lakh
    annualSavings: 1500000, // ₹15 Lakh
    riskReductionPercent: 14,
    financialBenefit: 1500000,
    rosiPercent: 25,
    priority: 'Medium',
    recommended: true
  },
  {
    id: 'INV-04',
    name: 'Automated CI/CD Patch & Container Security Pipeline',
    category: 'Vulnerability Management',
    cost: 850000, // ₹8.5 Lakh
    annualSavings: 1950000, // ₹19.5 Lakh
    riskReductionPercent: 18,
    financialBenefit: 1950000,
    rosiPercent: 129,
    priority: 'High',
    recommended: true
  },
  {
    id: 'INV-05',
    name: 'Immutable Air-Gapped Cloud DR & Instant Snapshotting',
    category: 'Resilience',
    cost: 950000, // ₹9.5 Lakh
    annualSavings: 1300000, // ₹13 Lakh
    riskReductionPercent: 12,
    financialBenefit: 1300000,
    rosiPercent: 37,
    priority: 'Medium',
    recommended: false
  },
  {
    id: 'INV-06',
    name: 'Managed 24/7 Threat Hunting & Red Team Simulation',
    category: 'Threat Detection',
    cost: 1600000, // ₹16 Lakh
    annualSavings: 1400000, // ₹14 Lakh
    riskReductionPercent: 11,
    financialBenefit: 1400000,
    rosiPercent: -12,
    priority: 'Low',
    recommended: false
  },
  {
    id: 'INV-07',
    name: 'Next-Gen API Security Gateway & Schema Enforcer',
    category: 'Network Defense',
    cost: 800000, // ₹8 Lakh
    annualSavings: 1100000, // ₹11 Lakh
    riskReductionPercent: 10,
    financialBenefit: 1100000,
    rosiPercent: 38,
    priority: 'Medium',
    recommended: true
  }
];

export const INITIAL_FINANCIAL_PROFILE: FinancialExposureProfile = {
  potentialIncidentLoss: 28000000, // ₹2.8 Crore total exposure
  downtimeCost: 8400000, // ₹84 Lakh
  dataBreachCost: 9200000, // ₹92 Lakh
  recoveryCost: 4800000, // ₹48 Lakh
  regulatoryPenaltyRisk: 3600000, // ₹36 Lakh
  reputationalLoss: 2000000, // ₹20 Lakh
  totalEstimatedImpact: 28000000,
  expectedAnnualLoss: 5200000, // ₹52 Lakh
  assumptions: {
    hourlyDowntimeRate: 450000, // ₹4.5 Lakh per hour for Tier-1 services
    costPerBreachedRecord: 1800, // ₹1,800 per customer record (PII + financial)
    regulatoryCapPercent: 4.0, // DPDP Act / RBI statutory guidance
    businessDisruptionMultiplier: 1.4
  }
};
