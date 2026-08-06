import { ServiceForm } from "../ServiceForm";

export default function NewServicePage() {
  return (
    <div className="p-6 md:p-10">
      <span className="eyebrow">Add</span>
      <h1 className="mt-2 font-display text-3xl text-ink dark:text-canvas">New Service</h1>
      <div className="mt-8 max-w-3xl"><ServiceForm /></div>
    </div>
  );
}
