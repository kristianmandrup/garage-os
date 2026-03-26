import twilio from 'twilio';

// LINE Messaging API
const LINE_API_URL = 'https://api.line.me/v2/bot/message/push';

interface SendResult {
  success: boolean;
  message_id?: string;
  error?: string;
}

interface MessagePayload {
  customer_id: string;
  customer_phone?: string;
  customer_line_id?: string;
  channel: 'sms' | 'whatsapp' | 'line' | 'app';
  content: string;
  job_card_id?: string;
}

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    return null;
  }

  return twilio(accountSid, authToken);
}

async function sendViaLINE(
  lineId: string,
  content: string
): Promise<SendResult> {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  if (!channelAccessToken) {
    console.warn('LINE_CHANNEL_ACCESS_TOKEN not configured');
    return { success: false, error: 'LINE not configured' };
  }

  try {
    const response = await fetch(LINE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${channelAccessToken}`,
      },
      body: JSON.stringify({
        to: lineId,
        messages: [
          {
            type: 'text',
            text: content,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LINE API error:', errorText);
      return { success: false, error: `LINE API error: ${response.status}` };
    }

    const data = await response.json();
    return { success: true, message_id: data.messageId };
  } catch (error) {
    console.error('LINE send error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function sendViaTwilioSMS(
  phone: string,
  content: string
): Promise<SendResult> {
  const client = getTwilioClient();
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!client || !fromNumber) {
    console.warn('Twilio not configured');
    return { success: false, error: 'Twilio SMS not configured' };
  }

  try {
    // Format phone number (ensure E.164 format)
    const formattedPhone = formatPhoneNumber(phone);

    const message = await client.messages.create({
      body: content,
      from: fromNumber,
      to: formattedPhone,
    });

    return { success: true, message_id: message.sid };
  } catch (error) {
    console.error('Twilio SMS error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function sendViaTwilioWhatsApp(
  phone: string,
  content: string
): Promise<SendResult> {
  const client = getTwilioClient();
  const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM;

  if (!client || !fromWhatsApp) {
    console.warn('Twilio WhatsApp not configured');
    return { success: false, error: 'Twilio WhatsApp not configured' };
  }

  try {
    // Format phone number for WhatsApp (E.164 format)
    const formattedPhone = formatPhoneNumber(phone);

    const message = await client.messages.create({
      body: content,
      from: fromWhatsApp,
      to: `whatsapp:${formattedPhone}`,
    });

    return { success: true, message_id: message.sid };
  } catch (error) {
    console.error('Twilio WhatsApp error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // If it's a Thai number (10 digits starting with 0)
  if (digits.length === 10 && digits.startsWith('0')) {
    // Convert 0812345678 to +66812345678
    return `+66${digits.slice(1)}`;
  }

  // If it already has country code (66...)
  if (digits.length === 11 && digits.startsWith('66')) {
    return `+${digits}`;
  }

  // If it's just the number without country code
  if (digits.length === 9 && digits.startsWith('8')) {
    // Thai mobile numbers starting with 8
    return `+66${digits}`;
  }

  // Default: add + prefix
  return digits.startsWith('+') ? digits : `+${digits}`;
}

// Main send function
export async function sendMessage(payload: MessagePayload): Promise<SendResult> {
  const { channel, customer_phone, customer_line_id, content } = payload;

  switch (channel) {
    case 'line':
      if (!customer_line_id) {
        return { success: false, error: 'LINE ID required for LINE messages' };
      }
      return sendViaLINE(customer_line_id, content);

    case 'whatsapp':
      if (!customer_phone) {
        return { success: false, error: 'Phone number required for WhatsApp messages' };
      }
      return sendViaTwilioWhatsApp(customer_phone, content);

    case 'sms':
      if (!customer_phone) {
        return { success: false, error: 'Phone number required for SMS messages' };
      }
      return sendViaTwilioSMS(customer_phone, content);

    case 'app':
      // In-app notifications would be handled differently
      // For now, just simulate success
      return { success: true, message_id: `in-app-${Date.now()}` };

    default:
      return { success: false, error: `Unknown channel: ${channel}` };
  }
}

// Check if any messaging provider is configured
export function isMessagingConfigured(): { twilio: boolean; line: boolean } {
  return {
    twilio: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
    line: !!process.env.LINE_CHANNEL_ACCESS_TOKEN,
  };
}
