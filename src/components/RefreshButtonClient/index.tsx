'use client';
import type { FC } from 'react';

import { Button, LoadingOverlay, toast, useConfig } from '@payloadcms/ui';

import './styles.scss';

import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

export interface RefreshButtonClientProps {
	collection: {
		label: string;
		slug: string;
	};
	label: string;
}

export const RefreshButtonClient: FC<RefreshButtonClientProps> = ({ collection, label }) => {
	const [isLoading, setIsLoading] = useState(false);

	const {
		config: {
			routes: { admin },
			serverURL,
		},
	} = useConfig();

	const baseUrl = `${serverURL}${admin}/collections/${collection.slug}`;
	const searchParams = useSearchParams();

	const handleRefresh = useCallback(async () => {
		setIsLoading(true);
		try {
			return await fetch(`${baseUrl}?${searchParams.toString()}`, {
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			}).then((response) => {
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				toast.success(`${collection.label} refreshed`);
			});
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			toast.error(`Error refreshing ${collection.label}: ${error}`);
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, [searchParams, baseUrl, collection]);

	return (
		<>
			<LoadingOverlay show={isLoading} />
			<div className={`refresh-button-container gutter--left gutter--right`}>
				<Button
					buttonStyle="secondary"
					className="refresh-button"
					disabled={isLoading}
					onClick={handleRefresh}
				>
					{label}
				</Button>
			</div>
		</>
	);
};
