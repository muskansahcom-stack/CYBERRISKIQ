/**
 * Engine 7: Compliance Mapping Engine
 * Evaluates compliance posture across regulatory frameworks and computes alignment percentages.
 */

import { ComplianceItem } from '../types/cyberrisk';

export class ComplianceMappingEngine {
  public static getFrameworkSummary(items: ComplianceItem[], framework: string) {
    const filtered = items.filter(i => i.framework === framework);
    const total = filtered.length;
    const compliant = filtered.filter(i => i.status === 'Compliant').length;
    const partial = filtered.filter(i => i.status === 'Partially Compliant').length;
    const nonCompliant = filtered.filter(i => i.status === 'Non-Compliant').length;

    const compliancePercent = total > 0
      ? Math.round(((compliant + (partial * 0.5)) / total) * 100)
      : 0;

    return {
      framework,
      total,
      compliant,
      partial,
      nonCompliant,
      compliancePercent
    };
  }

  public static getEnterpriseComplianceScore(items: ComplianceItem[]): number {
    if (items.length === 0) return 0;
    const compliant = items.filter(i => i.status === 'Compliant').length;
    const partial = items.filter(i => i.status === 'Partially Compliant').length;
    return Math.round(((compliant + (partial * 0.5)) / items.length) * 100);
  }
}
