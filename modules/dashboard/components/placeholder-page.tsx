import type { LucideIcon } from "lucide-react";

type PlaceholderPageProps = {
	icon: LucideIcon;
	title: string;
	description: string;
	items: string[];
};

export function PlaceholderPage({
	icon: Icon,
	title,
	description,
	items,
}: PlaceholderPageProps) {
	return (
		<div className="grid flex-1 place-items-center">
			<section className="w-full max-w-3xl rounded-lg border border-slate-200 bg-white p-8 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
				<div className="flex items-start gap-4">
					<div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
						<Icon className="size-6" aria-hidden="true" />
					</div>
					<div className="min-w-0">
						<h2 className="text-2xl font-bold tracking-normal text-slate-950">
							{title}
						</h2>
						<p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600">
							{description}
						</p>
					</div>
				</div>

				<div className="mt-8 grid gap-3 md:grid-cols-2">
					{items.map((item) => (
						<div
							key={item}
							className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
						>
							{item}
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
