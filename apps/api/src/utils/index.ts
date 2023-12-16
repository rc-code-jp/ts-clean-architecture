import type { ZodIssue } from "zod";

/**
 * Create a 200 response object
 * @param result BodyInit
 * @returns Response
 */
export const jsonResponse = (result: BodyInit) => {
	return new Response(result, {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
};

/**
 * Create a 404 response object
 * @param message string
 * @returns Response
 */
export const notFountResponse = (message = "Not Found") => {
	return new Response(JSON.stringify([message]), {
		status: 404,
		headers: {
			"Content-Type": "application/json",
		},
	});
};

/**
 * Create a 422 response object
 * @param message string[]
 * @returns Response
 */
export const invalidResponse = (message: Array<ZodIssue>) => {
	return new Response(JSON.stringify(message), {
		status: 422,
		headers: {
			"Content-Type": "application/json",
		},
	});
};
