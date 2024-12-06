import type { FC } from 'react';

import { RefreshButtonClient } from '../RefreshButtonClient';

export type RefreshButtonProps = {
	collection: {
		label: string;
		slug: string;
	};
	label: string;
};

export const RefreshButton: FC<RefreshButtonProps> = ({ collection, label }) => {
	return <RefreshButtonClient collection={collection} label={label} />;
};

export default RefreshButton;
