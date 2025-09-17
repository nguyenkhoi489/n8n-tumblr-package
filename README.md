# N8N Tumblr Auto Social Node

Một custom node cho n8n để tự động đăng nhập và đăng bài lên Tumblr thông qua Tumblr API.

## Tính năng

- ✅ Tự động xác thực với Tumblr API
- ✅ Đăng bài text với tiêu đề và nội dung
- ✅ Đăng ảnh từ URL hoặc binary data
- ✅ Đăng video với embed code
- ✅ Quản lý tags và trạng thái bài viết (published, draft, queue, private)
- ✅ Lấy thông tin blog và user
- ✅ Lấy danh sách bài viết từ blog

## Cài đặt

### 1. Tạo Tumblr Application

Trước tiên, bạn cần tạo một application trên Tumblr:

1. Đi đến https://www.tumblr.com/oauth/apps
2. Tạo một application mới
3. Lưu lại Consumer Key và Consumer Secret
4. Cấu hình OAuth redirect URL (thường là http://localhost:3000 cho development)

### 2. Lấy Access Token

Sử dụng OAuth flow để lấy access token và access token secret cho tài khoản Tumblr.

### 3. Cài đặt Package

```bash
# Clone repository
git clone https://github.com/yourusername/n8n-nodes-tumblr-auto-social.git
cd n8n-nodes-tumblr-auto-social

# Cài đặt dependencies
npm install

# Build package
npm run build

# Link package (development)
npm link

# Trong n8n directory
npm link n8n-nodes-tumblr-auto-social
```

### 4. Cấu hình Credentials trong N8N

1. Mở n8n
2. Đi đến Settings > Credentials
3. Tạo credential mới với loại "Tumblr API"
4. Nhập:
   - Consumer Key
   - Consumer Secret
   - Access Token
   - Access Token Secret

## Cách sử dụng

### Đăng bài Text

```javascript
// Workflow example
{
  "nodes": [
    {
      "parameters": {
        "resource": "post",
        "operation": "createText",
        "blogName": "your-blog-name",
        "title": "Tiêu đề bài viết",
        "body": "Nội dung bài viết của bạn",
        "tags": "tag1,tag2,tag3",
        "state": "published"
      },
      "name": "Tumblr Auto Social",
      "type": "n8n-nodes-tumblr-auto-social.tumblrAutoSocial",
      "typeVersion": 1,
      "credentials": {
        "tumblrApi": "your-tumblr-credentials"
      }
    }
  ]
}
```

### Đăng ảnh

```javascript
{
  "parameters": {
    "resource": "post",
    "operation": "createPhoto",
    "blogName": "your-blog-name",
    "photoSource": "url",
    "photoUrl": "https://example.com/image.jpg",
    "photoCaption": "Caption cho ảnh",
    "tags": "photography,nature",
    "state": "published"
  }
}
```

### Đăng video

```javascript
{
  "parameters": {
    "resource": "post",
    "operation": "createVideo",
    "blogName": "your-blog-name",
    "videoEmbed": "<iframe src='https://www.youtube.com/embed/VIDEO_ID'></iframe>",
    "videoCaption": "Caption cho video",
    "tags": "video,entertainment",
    "state": "published"
  }
}
```

## Cấu trúc thư mục

```
n8n-nodes-tumblr-auto-social/
├── credentials/
│   └── TumblrApi.credentials.ts
├── nodes/
│   └── TumblrAutoSocial/
│       ├── TumblrAutoSocial.node.ts
│       └── tumblr.svg
├── dist/                     # Built files
├── package.json
├── tsconfig.json
└── README.md
```

## Development

```bash
# Watch mode for development
npm run dev

# Format code
npm run format

# Lint
npm run lint

# Fix linting issues
npm run lintfix
```

## API Documentation

Node này sử dụng Tumblr API v2. Tham khảo:
- [Tumblr API Documentation](https://www.tumblr.com/docs/en/api/v2)
- [OAuth Authentication](https://www.tumblr.com/docs/en/api/v2#authentication)

## Troubleshooting

### Lỗi xác thực
- Kiểm tra lại Consumer Key và Consumer Secret
- Đảm bảo Access Token và Access Token Secret đúng
- Kiểm tra scope permissions của application

### Lỗi đăng bài
- Kiểm tra blog name (không bao gồm .tumblr.com)
- Đảm bảo account có quyền post lên blog
- Kiểm tra format của content và media URLs

### Lỗi rate limiting
- Tumblr có giới hạn số request per hour
- Thêm delay giữa các requests
- Monitor usage trong Tumblr app dashboard

## Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch  
5. Tạo Pull Request

## License

MIT License - xem file LICENSE để biết chi tiết.