export type DetectionConfidence = "high" | "medium" | "low";

export type DetectedJob = {
	title: string;
	company: string;
	location: string;
	url: string;
	platform: string;
	descriptionText: string;
	descriptionHtml?: string;
	salary: string;
	logoUrl?: string;
	employmentType?: string;
	workplaceType?: string;
	confidence: DetectionConfidence;
};
