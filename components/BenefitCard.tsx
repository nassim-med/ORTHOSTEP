"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface BenefitCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export default function BenefitCard({ title, description, icon }: BenefitCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft"
    >
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-orthostep-light text-orthostep-dark shadow-sm">
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </motion.article>
  );
}
