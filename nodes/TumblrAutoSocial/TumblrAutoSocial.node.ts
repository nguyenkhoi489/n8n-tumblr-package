import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

import { promisify } from 'util';
import * as Tumblr from 'tumblr.js';

export class TumblrAutoSocial implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tumblr Auto Social',
		name: 'tumblrAutoSocial',
		group: ['transform'],
		version: 1,
		description: 'Post content or fetch data from Tumblr automatically',
		defaults: {
			name: 'Tumblr Auto Social',
		},
		// 🔹 n8n v1 yêu cầu enum thay cho string
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],

		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Create Text Post',
						value: 'createTextPost',
					},
					{
						name: 'Create Photo Post',
						value: 'createPhotoPost',
					},
					{
						name: 'Create Video Post',
						value: 'createVideoPost',
					},
					{
						name: 'Get Blog Info',
						value: 'blogInfo',
					},
					{
						name: 'Get User Info',
						value: 'userInfo',
					},
					{
						name: 'Get User Dashboard',
						value: 'userDashboard',
					},
				],
				default: 'createTextPost',
				description: 'The operation to perform on Tumblr',
			},
			{
				displayName: 'Blog Name',
				name: 'blogName',
				type: 'string',
				default: '',
				description: 'The name of the blog (e.g. myblog.tumblr.com)',
				required: true,
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['createTextPost'],
					},
				},
				description: 'Text body of the post',
			},
			{
				displayName: 'Photo Caption',
				name: 'photoCaption',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['createPhotoPost'],
					},
				},
			},
			{
				displayName: 'Photo Source URL',
				name: 'photoSource',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['createPhotoPost'],
					},
				},
			},
			{
				displayName: 'Video Caption',
				name: 'videoCaption',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['createVideoPost'],
					},
				},
			},
			{
				displayName: 'Video Source URL',
				name: 'videoSource',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['createVideoPost'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// 🔹 Lấy credentials
		const credentials = await this.getCredentials('tumblrApi') as {
			consumerKey: string;
			consumerSecret: string;
			token: string;
			tokenSecret: string;
		};

		// 🔹 Tạo client
		const client = Tumblr.createClient({
			consumer_key: credentials.consumerKey,
			consumer_secret: credentials.consumerSecret,
			token: credentials.token,
			token_secret: credentials.tokenSecret,
		});

		// 🔹 Promisify các method
		const createTextPost = promisify(client.createTextPost.bind(client));
		const createPhotoPost = promisify(client.createPhotoPost.bind(client));
		const createVideoPost = promisify(client.createVideoPost.bind(client));
		const blogInfo = promisify(client.blogInfo.bind(client));
		const userInfo = promisify(client.userInfo.bind(client));
		const userDashboard = promisify(client.userDashboard.bind(client));

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const blogName = this.getNodeParameter('blogName', i, '') as string;

				let responseData;

				switch (operation) {
					case 'createTextPost': {
						const body = this.getNodeParameter('body', i, '') as string;
						responseData = await createTextPost(blogName, { body });
						break;
					}
					case 'createPhotoPost': {
						const photoCaption = this.getNodeParameter('photoCaption', i, '') as string;
						const photoSource = this.getNodeParameter('photoSource', i, '') as string;
						responseData = await createPhotoPost(blogName, {
							caption: photoCaption,
							source: photoSource,
						});
						break;
					}
					case 'createVideoPost': {
						const videoCaption = this.getNodeParameter('videoCaption', i, '') as string;
						const videoSource = this.getNodeParameter('videoSource', i, '') as string;
						responseData = await createVideoPost(blogName, {
							caption: videoCaption,
							embed: videoSource,
						});
						break;
					}
					case 'blogInfo': {
						responseData = await blogInfo(blogName);
						break;
					}
					case 'userInfo': {
						responseData = await userInfo();
						break;
					}
					case 'userDashboard': {
						responseData = await userDashboard();
						break;
					}
					default:
						throw new Error(`The operation "${operation}" is not supported!`);
				}

				returnData.push({ json: responseData });
			} catch (error: any) {
				returnData.push({
					json: {
						success: false,
						error: error.message ?? 'Unknown error',
					},
				});
			}
		}

		return [returnData];
	}
}
