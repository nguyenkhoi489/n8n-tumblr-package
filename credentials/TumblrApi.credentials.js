import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TumblrApi implements ICredentialType {
	name = 'tumblrApi';
	displayName = 'Tumblr API';
	documentationUrl = 'https://www.tumblr.com/docs/en/api/v2';
	properties: INodeProperties[] = [
		{
			displayName: 'Consumer Key',
			name: 'consumerKey',
			type: 'string',
			default: '',
			description: 'The consumer key from your Tumblr app',
			required: true,
		},
		{
			displayName: 'Consumer Secret',
			name: 'consumerSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'The consumer secret from your Tumblr app',
			required: true,
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			default: '',
			description: 'OAuth access token for the user account',
			required: true,
		},
		{
			displayName: 'Access Token Secret',
			name: 'accessTokenSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'OAuth access token secret for the user account',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				consumerKey: '={{$credentials.consumerKey}}',
				consumerSecret: '={{$credentials.consumerSecret}}',
				token: '={{$credentials.accessToken}}',
				tokenSecret: '={{$credentials.accessTokenSecret}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.tumblr.com/v2',
			url: '/user/info',
		},
	};
}