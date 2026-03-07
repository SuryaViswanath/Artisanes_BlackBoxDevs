# 🎨 AI-Powered Artisan Marketplace

An intelligent marketplace platform that helps artisans create professional product listings using AI, voice descriptions, and conversational interfaces.

## 🌟 Features

### For Sellers
- **AI-Powered Profile Setup**: Conversational AI learns your craft story and background
- **Voice-to-Listing**: Record your product description, AI generates professional Amazon-style listings
- **Photo Upload**: Upload up to 3 product photos
- **Conversational AI Assistant**: Get help with product details, care instructions, and FAQs
- **Seller Dashboard**: View all your products and manage listings
- **Authentication**: Secure login/signup system

### For Buyers
- **Product Marketplace**: Browse handcrafted products with rich descriptions
- **Product Details**: View photos, descriptions, artisan stories, and care instructions
- **Search & Filter**: Find products by keywords, materials, or styles

## 🛠️ Tech Stack

### Frontend
- React + Vite
- CSS3 with modern animations
- Responsive design

### Backend
- Node.js + Express
- AWS Services:
  - **S3**: Image and audio storage
  - **DynamoDB**: Product and seller data
  - **Bedrock**: AI model (Qwen3 32B) for listing generation and conversations
  - **IAM**: Access management

## 📋 Prerequisites

- Node.js (v18 or higher)
- AWS Account with:
  - S3 bucket created
  - DynamoDB tables set up
  - IAM user with appropriate permissions
  - Bedrock access enabled

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd amazon_hackathon
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install seller frontend dependencies
cd ../frontend-seller
npm install

# Install buyer frontend dependencies
cd ../frontend-buyer
npm install
```

### 3. Configure AWS

#### Create S3 Bucket
1. Go to AWS S3 Console
2. Create bucket: `artisan-marketplace-media-<your-name>`
3. Disable "Block all public access"
4. Add CORS configuration (see `infrastructure/s3-cors.json`)
5. Add bucket policy for public read access

#### Set Up DynamoDB Tables

```bash
cd backend
node setup-dynamodb.js
node setup-sellers-table.js
```

#### Configure IAM Permissions
Your IAM user needs these policies:
- `AmazonS3FullAccess`
- `AmazonDynamoDBFullAccess`
- `AmazonBedrockFullAccess`

### 4. Environment Variables

Create `.env` files in each directory:

**backend/.env**
```env
PORT=3001
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

S3_BUCKET_NAME=artisan-marketplace-media-<your-name>
DYNAMODB_PRODUCTS_TABLE=artisan-products
DYNAMODB_CONVERSATIONS_TABLE=artisan-conversations
BEDROCK_MODEL_ID=qwen.qwen3-32b-v1:0
```

**frontend-seller/.env**
```env
VITE_API_URL=http://localhost:3001/api
VITE_AWS_REGION=us-east-1
```

**frontend-buyer/.env**
```env
VITE_API_URL=http://localhost:3001/api
```

### 5. Run the Application

Open 3 terminal windows:

**Terminal 1 - Backend**
```bash
cd backend
node server.js
```

**Terminal 2 - Seller App**
```bash
cd frontend-seller
npm run dev
```

**Terminal 3 - Buyer App**
```bash
cd frontend-buyer
npm run dev
```

Access the apps:
- Seller Portal: http://localhost:3000
- Buyer Marketplace: http://localhost:3002
- Backend API: http://localhost:3001

## 📖 Usage Guide

### For Sellers

1. **Sign Up**: Create your seller account
2. **Profile Setup**: Chat with AI to share your craft story (optional but recommended)
3. **Create Product**:
   - Upload 1-3 photos
   - Record voice description of your product
   - AI generates professional listing
   - Chat with AI to add care instructions and details
   - Review and publish
4. **Dashboard**: View all your products

### For Buyers

1. Visit the marketplace
2. Browse products
3. Click on a product to see details
4. View artisan story and product information

## 🏗️ Project Structure

```
amazon_hackathon/
├── backend/
│   ├── config/          # AWS configuration
│   ├── routes/          # API routes
│   ├── services/        # Business logic (S3, DynamoDB, Bedrock)
│   └── server.js        # Express server
├── frontend-seller/     # Seller portal (React)
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   └── pages/       # Page components
│   └── package.json
├── frontend-buyer/      # Buyer marketplace (React)
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── package.json
└── infrastructure/      # AWS setup guides
```

## 🔑 Key Features Explained

### AI Listing Generation
- Uses AWS Bedrock (Qwen3 32B model)
- Converts voice descriptions to professional Amazon-style listings
- Generates: title, bullet points, description, tags, category, story card

### Seller Profile AI
- Conversational interface to learn seller's story
- Asks about craft type, inspiration, techniques, materials
- Stores profile for use in product listings

### Voice Recording
- Browser-based audio recording
- Uploads to S3
- Mock transcription (can be replaced with AWS Transcribe)

## 🚧 Known Limitations (POC)

- Voice transcription is mocked (not using AWS Transcribe)
- No actual Amazon SP-API integration
- Simple authentication (no password hashing)
- No payment processing
- No email notifications

## 🔮 Future Enhancements

- [ ] Real AWS Transcribe integration
- [ ] Amazon SP-API integration for actual listing
- [ ] Secure authentication with JWT
- [ ] Email notifications
- [ ] Order management
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app

## 📝 License

This is a POC project for educational purposes.

## 🤝 Contributing

This is a hackathon project. Feel free to fork and enhance!

## 📧 Contact

For questions or feedback, please open an issue.

---

Built with ❤️ for artisans worldwide
