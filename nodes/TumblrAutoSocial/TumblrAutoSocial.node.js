import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import * as tumblr from 'tumblr.js';

export class TumblrAutoSocial implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tumblr Auto Social',
		name: 'tumblrAutoSocial',
		icon: 'file:tumblr.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Auto login and post content to Tumblr',
		defaults: {
			name: 'Tumblr Auto Social',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'tumblrApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Post',
						value: 'post',
					},
					{
						name: 'Blog',
						value: 'blog',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'post',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['post'],
					},
				},
				options: [
					{
						name: 'Create Text Post',
						value: 'createText',
						description: 'Create a text post',
						action: 'Create a text post',
					},
					{
						name: 'Create Photo Post',
						value: 'createPhoto',
						description: 'Create a photo post',
						action: 'Create a photo post',
					},
					{
						name: 'Create Video Post',
						value: 'createVideo',
						description: 'Create a video post',
						action: 'Create a video post',
					},
				],
				default: 'createText',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['blog'],
					},
				},
				options: [
					{
						name: 'Get Info',
						value: 'getInfo',
						description: 'Get blog information',
						action: 'Get blog information',
					},
					{
						name: 'Get Posts',
						value: 'getPosts',
						description: 'Get blog posts',
						action: 'Get blog posts',
					},
				],
				default: 'getInfo',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Get Info',
						value: 'getInfo',
						description: 'Get user information',
						action: 'Get user information',
					},
					{
						name: 'Get Dashboard',
						value: 'getDashboard',
						description: 'Get user dashboard',
						action: 'Get user dashboard',
					},
				],
				default: 'getInfo',
			},
			// Blog Name field
			{
				displayName: 'Blog Name',
				name: 'blogName',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'your-blog-name',
				description: 'The name of your Tumblr blog (without .tumblr.com)',
				displayOptions: {
					show: {
						resource: ['post', 'blog'],
					},
				},
			},
			// Text Post fields
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'The title of the post',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['createText'],
					},
				},
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				description: 'The body content of the post',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['createText'],
					},
				},
				required: true,
			},
			// Photo Post fields
			{
				displayName: 'Photo Source',
				name: 'photoSource',
				type: 'options',
				options: [
					{
						name: 'URL',
						value: 'url',
					},
					{
						name: 'Binary Data',
						value: 'binary',
					},
				],
				default: 'url',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['createPhoto'],
					},
				},
			},
			{
				displayName: 'Photo URL',
				name: 'photoUrl',
				type: 'string',
				default: '',
				description: 'URL of the photo to post',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['createPhoto'],
						photoSource: ['url'],
					},
				},
				required: true,
			},
			{
				displayName: 'Photo Caption',
				name: 'photoCaption',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'Caption for the photo',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['createPhoto'],
					},
				},
			},
			// Video Post fields
			{
				displayName: 'Video Embed',
				name: 'videoEmbed',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				description: 'HTML embed code or URL for the video',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['createVideo'],
					},
				},
				required: true,
			},
			{
				displayName: 'Video Caption',
				name: 'videoCaption',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'Caption for the video',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['createVideo'],
					},
				},
			},
			// Common post options
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				placeholder: 'tag1,tag2,tag3',
				description: 'Comma-separated list of tags',
				displayOptions: {
					show: {
						resource: ['post'],
					},
				},
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'options',
				options: [
					{
						name: 'Published',
						value: 'published',
					},
					{
						name: 'Draft',
						value: 'draft',
					},
					{
						name: 'Queue',
						value: 'queue',
					},
					{
						name: 'Private',
						value: 'private',
					},
				],
				default: 'published',
				description: 'The state of the post',
				displayOptions: {
					show: {
						resource: ['post'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('tumblrApi');
		
		const client = tumblr.createClient({
			consumer_key: credentials.consumerKey as string,
			consumer_secret: credentials.consumerSecret as string,
			token: credentials.accessToken as string,
			token_secret: credentials.accessTokenSecret as string,
		});

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			try {
				let responseData;

				if (resource === 'post') {
					const blogName = this.getNodeParameter('blogName', i) as string;
					const tags = this.getNodeParameter('tags', i, '') as string;
					const state = this.getNodeParameter('state', i) as string;

					const baseParams = {
						tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
						state,
					};

					if (operation === 'createText') {
						const title = this.getNodeParameter('title', i, '') as string;
						const body = this.getNodeParameter('body', i) as string;

						responseData = await client.createTextPost(blogName, {
							...baseParams,
							title,
							body,
						});
					} else if (operation === 'createPhoto') {
						const photoSource = this.getNodeParameter('photoSource', i) as string;
						const photoCaption = this.getNodeParameter('photoCaption', i, '') as string;

						if (photoSource === 'url') {
							const photoUrl = this.getNodeParameter('photoUrl', i) as string;
							responseData = await client.createPhotoPost(blogName, {
								...baseParams,
								source: photoUrl,
								caption: photoCaption,
							});
						}
					} else if (operation === 'createVideo') {
						const videoEmbed = this.getNodeParameter('videoEmbed', i) as string;
						const videoCaption = this.getNodeParameter('videoCaption', i, '') as string;

						responseData = await client.createVideoPost(blogName, {
							...baseParams,
							embed: videoEmbed,
							caption: videoCaption,
						});
					}
				} else if (resource === 'blog') {
					const blogName = this.getNodeParameter('blogName', i) as string;

					if (operation === 'getInfo') {
						responseData = await client.blogInfo(blogName);
					} else if (operation === 'getPosts') {
						responseData = await client.blogPosts(blogName);
					}
				} else if (resource === 'user') {
					if (operation === 'getInfo') {
						responseData = await client.userInfo();
					} else if (operation === 'getDashboard') {
						responseData = await client.userDashboard();
					}
				}

				returnData.push({
					json: responseData as any,
					pairedItem: {
						item: i,
					},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}