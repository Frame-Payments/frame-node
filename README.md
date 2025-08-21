# Frame-Node.js Library
The Frame Node.js Library simplifies the process of creating a seamless payment experience within your web app. It provides direct access to the underlying APIs that drive these components, allowing you to design fully customized payment workflows tailored to your app's needs.

## 📦 Installation

```bash
npm install framepayments
# or
yarn add framepayments
```

## 🤖 Usage

1. Initalize the client. You'll need your developer secret key from Frame, if you don't already have one you can sign up at https://www.framepayments.com
```bash
import { FrameSDK } from 'framepayments';

const frame = new FrameSDK({
  apiKey: 'your_api_key_here', // replace with your secret API key
});
```

2. Access API endpoints directly using available types and dot notation. For a list of all available endpoints: https://docs.framepayments.com
```bash
const newCustomer = await frame.customers.create({
  name: 'Alice Johnson',
  email: 'alice@example.com',
});
console.log(newCustomer.id); // e.g. cust_abc123
```

```bash
const subscription = await frame.subscriptions.create({
  customer: 'cust_abc123',
  plan: 'plan_basic_monthly',
});
console.log(subscription.status); // e.g. active
```

## 🔒 Privacy 

Our privacy policy can be found at https://framepayments.com/privacy.
