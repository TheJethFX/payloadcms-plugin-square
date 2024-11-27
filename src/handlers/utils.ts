import type { ErrorResponse } from './types';

export const sendError = (error: unknown, status = 500): Response => {
	const message =
		error instanceof Error
			? error.message
			: typeof error === 'string'
				? error
				: 'Unknown error occurred';

	return Response.json(
		{
			code: status,
			error: message,
		} as ErrorResponse,
		{ status },
	);
};
