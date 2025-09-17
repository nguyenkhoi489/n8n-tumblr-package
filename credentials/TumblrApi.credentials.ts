import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class TumblrApi implements ICredentialType {
	name = 'tumblrApi';
	displayName = 'Tumblr API';
	documentationUrl = '';
	properties: INodeProperties[] = [
		{
			displayName: 'Consumer Key',
			name: 'consumerKey',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Consumer Secret',
			name: 'consumerSecret',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Token Secret',
			name: 'tokenSecret',
			type: 'string',
			default: '',
		},
	];
}
