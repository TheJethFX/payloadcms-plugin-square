export interface ErrorResponse {
	error: string;
}

export const sendError = (error: unknown) => {
	const message = error instanceof Error ? error.message : 'Unknown error occurred';
	return Response.json({ error: message }, { status: 500 });
};
