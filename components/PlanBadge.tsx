import React from 'react';
import { PlanType } from '../types';

export const PlanBadge: React.FC<{ plan: PlanType }> = ({ plan }) => {
  const styles = {
    [PlanType.BASIC]: 'bg-slate-100 text-slate-700 border-slate-200',
    [PlanType.INTERMEDIATE]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    [PlanType.PREMIUM]: 'bg-brand-50 text-brand-700 border-brand-200',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[plan]}`}>
      {plan}
    </span>
  );
};