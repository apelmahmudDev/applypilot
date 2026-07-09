export type DetectionConfidence = "high" | "medium" | "low";

export type DetectedJob = {
	title: string;
	company: string;
	location: string;
	url: string;
	platform: string;
	description: string;
	salary: string;
	confidence: DetectionConfidence;
};
