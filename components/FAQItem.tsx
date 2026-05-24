interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <details className="group rounded-[28px] border border-slate-200 bg-white p-6 transition hover:border-orthostep">
      <summary className="cursor-pointer text-lg font-semibold text-slate-900">
        {question}
      </summary>
      <p className="mt-4 text-sm leading-7 text-slate-600">{answer}</p>
    </details>
  );
}
