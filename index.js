const sgMail = require('@sendgrid/mail');
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

exports.handler = async (event) => {
  console.log("hello from the lambda serverless function");
  const client = new SecretsManagerClient();

  // Get API key from Secrets Manager
  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: process.env.API_SECRET_NAME
    })
  );
  
  const secretData = JSON.parse(response.SecretString);

  console.log('API Key:', secretData.SENDGRID_API_KEY);

  // Configure SendGrid API Key from Lambda environment variables
  sgMail.setApiKey(secretData.SENDGRID_API_KEY);
  
  // Extract SNS message details
  const snsMessage = event.Records[0].Sns.Message;
  const { email, verificationToken } = JSON.parse(snsMessage);
  console.log('Email:', email);
  console.log('Verification Token:', verificationToken);

  try {
    // Generate the verification link using the provided token and email
    const verificationLink = `${process.env.VERIFICATION_URL}?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    console.log('Verification Link:', verificationLink);

    // Prepare the email content
    const msg = {
      to: email,
      from: 'noreply@webappmv.me', // Replace with your verified email
      subject: 'Verify Your Email Address',
      text: `Please verify your email by clicking the link below. This link will expire in 2 minutes.`,
      html: `<p>Please verify your email by clicking the link below. This link will expire in 2 minutes.</p>
             <p><a href="${verificationLink}">Verify Email</a></p>
             <br><br>
             <p>If you didn't request this, please ignore this email.</p>
             <p>Thanks,</p>
             <p>WebAppMV Team</p>`,
    };

    console.log('Email body:', msg);

    // Send the email using SendGrid
    await sgMail.send(msg);

    console.log('Verification email sent successfully.');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Verification email sent.' })
    };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error.' })
    };
  }
};
