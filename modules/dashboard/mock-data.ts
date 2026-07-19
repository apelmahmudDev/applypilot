import type { DashboardJob } from "@/modules/dashboard/types";

export const dashboardJobs: DashboardJob[] = [
	{
		id: "figma-product-designer",
		title: "Product Designer",
		company: "Figma",
		location: "San Francisco, CA",
		workMode: "Remote",
		jobType: "Full-time",
		source: {
			name: "Company Site",
			url: "https://www.figma.com/careers/job/product-designer",
			faviconUrl: "https://www.google.com/s2/favicons?domain=figma.com&sz=64",
		},
		savedDate: "May 12, 2025",
		appliedDate: "May 20, 2025",
		reminder: "May 27",
		status: "Applied",
		salary: "$145,000 - $175,000",
		notes:
			"Strong fit with product thinking and cross-functional design systems work.",
		description:
			"Figma is hiring a Product Designer to shape collaborative workflows, prototype new editor experiences, and partner closely with product and engineering teams.",
		brand: "figma",
	},
	{
		id: "vercel-frontend-developer",
		title: "Frontend Developer",
		company: "Vercel",
		location: "New York, NY",
		workMode: "Hybrid",
		jobType: "Full-time",
		source: {
			name: "Company Site",
			url: "https://vercel.com/careers/frontend-developer",
			faviconUrl: "https://www.google.com/s2/favicons?domain=vercel.com&sz=64",
		},
		savedDate: "May 13, 2025",
		appliedDate: "May 18, 2025",
		reminder: "May 26",
		status: "Interview",
		salary: "$160,000 - $190,000",
		notes:
			"Good alignment with frontend platform work and modern React architecture.",
		description:
			"Vercel is looking for a Frontend Developer to build performant product interfaces, improve developer workflows, and collaborate on design system evolution.",
		brand: "vercel",
	},
	{
		id: "airbnb-data-analyst",
		title: "Data Analyst",
		company: "Airbnb",
		location: "Austin, TX",
		workMode: "Remote",
		jobType: "Full-time",
		source: {
			name: "LinkedIn",
			url: "https://www.linkedin.com/jobs/view/airbnb-data-analyst",
			faviconUrl:
				"https://www.google.com/s2/favicons?domain=linkedin.com&sz=64",
		},
		savedDate: "May 10, 2025",
		appliedDate: "May 15, 2025",
		reminder: "May 29",
		status: "Applied",
		salary: "$120,000 - $145,000",
		notes:
			"Analytics-heavy role with room to lean on experimentation and stakeholder communication.",
		description:
			"Airbnb is hiring a Data Analyst to uncover insights across product and operations, build dashboards, and support strategic decision-making for growth initiatives.",
		brand: "airbnb",
	},
	{
		id: "hubspot-business-development",
		title: "Business Development Executive",
		company: "HubSpot",
		location: "Boston, MA",
		workMode: "On-site",
		jobType: "Full-time",
		source: {
			name: "LinkedIn",
			url: "https://www.linkedin.com/jobs/view/hubspot-business-development",
			faviconUrl:
				"https://www.google.com/s2/favicons?domain=linkedin.com&sz=64",
		},
		savedDate: "May 14, 2025",
		appliedDate: "May 14, 2025",
		reminder: "-",
		status: "Saved",
		salary: "Not specified",
		notes:
			"Looks like a strong match for relationship-building and pipeline growth experience.",
		description:
			"HubSpot is looking for a Business Development Executive to identify new opportunities, partner with sales and marketing, and drive pipeline growth through client outreach.",
		brand: "hubspot",
	},
	{
		id: "notion-ux-researcher",
		title: "UX Researcher",
		company: "Notion",
		location: "San Francisco, CA",
		workMode: "Remote",
		jobType: "Contract",
		source: {
			name: "Company Site",
			url: null,
			faviconUrl: "https://www.google.com/s2/favicons?domain=notion.so&sz=64",
		},
		savedDate: "May 9, 2025",
		appliedDate: "May 12, 2025",
		reminder: "May 23",
		status: "Interview",
		salary: "$95/hour",
		notes:
			"Contract role with strong research ownership and remote-friendly collaboration.",
		description:
			"Notion is seeking a UX Researcher to design studies, synthesize qualitative findings, and help product teams better understand user behavior.",
		brand: "notion",
	},
	{
		id: "linear-product-manager",
		title: "Product Manager",
		company: "Linear",
		location: "Remote",
		workMode: "Worldwide",
		jobType: "Full-time",
		source: {
			name: "Manual",
			url: null,
			faviconUrl: null,
		},
		savedDate: "May 9, 2025",
		appliedDate: "May 9, 2025",
		reminder: "May 21",
		status: "Interview",
		salary: "Not specified",
		notes:
			"Manual lead worth following up on because the scope fits roadmap and prioritization work.",
		description:
			"Linear is hiring a Product Manager to guide roadmap execution, align cross-functional teams, and improve the planning experience for modern product organizations.",
		brand: "linear",
	},
	{
		id: "calendly-customer-success",
		title: "Customer Success Specialist",
		company: "Calendly",
		location: "Atlanta, GA",
		workMode: "Hybrid",
		jobType: "Full-time",
		source: {
			name: "Indeed",
			url: "https://www.indeed.com/viewjob?jk=calendly-customer-success",
			faviconUrl: "https://www.google.com/s2/favicons?domain=indeed.com&sz=64",
		},
		savedDate: "May 6, 2025",
		appliedDate: "May 8, 2025",
		reminder: "May 22",
		status: "Offer",
		salary: "$85,000 - $105,000",
		notes:
			"Healthy pipeline stage here and likely worth prioritizing for follow-up.",
		description:
			"Calendly is hiring a Customer Success Specialist to support onboarding, improve retention, and help customers adopt workflow automation successfully.",
		brand: "calendly",
	},
	{
		id: "plaid-software-engineer",
		title: "Software Engineer",
		company: "Plaid",
		location: "San Francisco, CA",
		workMode: "Hybrid",
		jobType: "Full-time",
		source: {
			name: "Company Site",
			url: "https://plaid.com/careers/software-engineer",
			faviconUrl: "https://www.google.com/s2/favicons?domain=plaid.com&sz=64",
		},
		savedDate: "May 4, 2025",
		appliedDate: "May 6, 2025",
		reminder: "-",
		status: "Saved",
		salary: "$170,000 - $210,000",
		notes:
			"Strong engineering role with fintech scale, but application has not been sent yet.",
		description:
			"Plaid is seeking a Software Engineer to build reliable financial infrastructure, improve platform performance, and ship features for developer-facing products.",
		brand: "plaid",
	},
	{
		id: "canva-content-designer",
		title: "Content Designer",
		company: "Canva",
		location: "Sydney, Australia",
		workMode: "Remote",
		jobType: "Contract",
		source: {
			name: "Company Site",
			url: "https://www.canva.com/careers/content-designer",
			faviconUrl: "https://www.google.com/s2/favicons?domain=canva.com&sz=64",
		},
		savedDate: "May 3, 2025",
		appliedDate: "May 5, 2025",
		reminder: "-",
		status: "Offer",
		salary: "$90,000 - $120,000",
		notes:
			"Creative role with strong writing and product storytelling overlap.",
		description:
			"Canva is hiring a Content Designer to craft product language, shape UX content systems, and partner with design teams across multiple surfaces.",
		brand: "canva",
	},
];

export const dashboardStats = [
	{ label: "Total Jobs", value: "42", trend: "12% this month" },
	{ label: "Applied", value: "18", trend: "8% this month" },
	{ label: "Interview", value: "4", trend: "2% this month" },
	{ label: "Offers", value: "1", trend: "1% this month" },
];

export const analyticsMonthlyActivity = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
