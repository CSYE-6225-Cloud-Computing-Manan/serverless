# Email Verification Lambda Function

This Lambda function handles email verification by sending verification emails using SendGrid. It's triggered by SNS (Simple Notification Service) messages and is part of a user registration workflow.

## Overview

The function receives user email details via SNS, generates a verification link, and sends a verification email using SendGrid. The verification link expires after 2 minutes.

## Prerequisites

- AWS Account with appropriate IAM permissions
- SendGrid account and API key
- Node.js runtime environment
- AWS SNS topic set up
- Environment variables configured in Lambda

## Setup

### 2. Environment Variables

Configure the following environment variables in your Lambda function:

- `SENDGRID_API_KEY`: Your SendGrid API key
- `VERIFICATION_URL`: Base URL for email verification (e.g., `https://yourdomain.com/verify`)

### 3. Dependencies

Install required dependencies:

```bash
npm install @sendgrid/mail
```

### 4. SNS Topic Configuration

1. Create an SNS topic
2. Add a subscription to your Lambda function
3. Configure the following message structure:

```json
{
    "email": "user@example.com",
    "verificationToken": "unique-token"
}
```

## Function Input

The function expects an SNS event with a message containing:

- `email`: User's email address
- `verificationToken`: Unique token for verification

## Function Output

### Success Response (200)
```json
{
    "message": "Verification email sent."
}
```

### Error Response (500)
```json
{
    "message": "Internal server error."
}
```

## Email Template

The verification email includes:
- A verification link
- 2-minute expiration notice
- Security disclaimer
- Company branding

## Logging

The function logs the following information:
- Function initiation
- SendGrid API key configuration
- Email and verification token receipt
- Generated verification link
- Email content
- Success/failure status

## Error Handling

The function includes:
- Try-catch block for email sending
- Error logging
- Error response generation
- SNS message parsing validation

## Security Considerations

1. Environment variables for sensitive data
2. URL encoding for email parameters
3. Limited-time token expiration
4. Secure verification URL (HTTPS)
5. No-reply sender address

## Deployment

1. Zip the function code and dependencies
2. Upload to AWS Lambda/Terraform File
3. Configure environment variables
4. Set appropriate memory and timeout values
5. Configure SNS trigger

## Monitoring

Monitor the function using:
- CloudWatch Logs
- Lambda metrics
- SNS delivery status
- SendGrid dashboard

