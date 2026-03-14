import { google } from 'googleapis';
import dayjs from 'dayjs';

// Initialize OAuth2 client
const getOAuth2Client = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // Set credentials - In production, you'll need to implement OAuth2 flow
  // For now, we'll use refresh token if available
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
  }

  return oauth2Client;
};

// Create Google Meet event
export const createMeetEvent = async (appointment) => {
  try {
    // Check if Google Calendar is configured
    if (
      !process.env.GOOGLE_CLIENT_ID ||
      !process.env.GOOGLE_CLIENT_SECRET ||
      !process.env.GOOGLE_REFRESH_TOKEN
    ) {
      console.log('Google Calendar not configured, skipping meeting link generation');
      return {
        success: false,
        message: 'Google Calendar not configured',
      };
    }

    const oauth2Client = getOAuth2Client();
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Parse date and time
    const startDateTime = dayjs(
      `${appointment.scheduledDate.toISOString().split('T')[0]} ${appointment.scheduledTime}`,
      'YYYY-MM-DD h:mm A'
    );
    const endDateTime = startDateTime.add(appointment.duration, 'minute');

    // Create event
    const event = {
      summary: `${appointment.appointmentType} - INIYAN & Co`,
      description: `
Appointment Type: ${appointment.appointmentType}
Customer: ${appointment.user?.name || 'N/A'}
Email: ${appointment.user?.email || 'N/A'}
Phone: ${appointment.user?.phone || 'N/A'}
Duration: ${appointment.duration} minutes
Location Type: ${appointment.locationType}
${appointment.location ? `Location: ${appointment.location}` : ''}
${appointment.customerNotes ? `Notes: ${appointment.customerNotes}` : ''}

powered by INIYAN & Co Construction Services
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      attendees: [
        { email: appointment.user?.email },
        { email: process.env.ADMIN_EMAIL || 'sivadharshana1312@gmail.com' },
      ],
      conferenceData: {
        createRequest: {
          requestId: `appointment-${appointment._id}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours before
          { method: 'popup', minutes: 60 }, // 1 hour before
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      sendUpdates: 'all',
      resource: event,
    });

    const meetingLink =
      response.data.hangoutLink || response.data.conferenceData?.entryPoints?.[0]?.uri || '';

    return {
      success: true,
      meetingLink,
      eventId: response.data.id,
      event: response.data,
    };
  } catch (error) {
    console.error('Error creating Google Meet event:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update Google Meet event
export const updateMeetEvent = async (eventId, appointment) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REFRESH_TOKEN) {
      return {
        success: false,
        message: 'Google Calendar not configured',
      };
    }

    const oauth2Client = getOAuth2Client();
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Parse new date and time
    const startDateTime = dayjs(
      `${appointment.scheduledDate.toISOString().split('T')[0]} ${appointment.scheduledTime}`,
      'YYYY-MM-DD h:mm A'
    );
    const endDateTime = startDateTime.add(appointment.duration, 'minute');

    // Get existing event
    const existingEvent = await calendar.events.get({
      calendarId: 'primary',
      eventId: eventId,
    });

    // Update event
    const updatedEvent = {
      ...existingEvent.data,
      summary: `${appointment.appointmentType} - INIYAN & Co`,
      description: `
Appointment Type: ${appointment.appointmentType}
Customer: ${appointment.user?.name || 'N/A'}
Email: ${appointment.user?.email || 'N/A'}
Phone: ${appointment.user?.phone || 'N/A'}
Duration: ${appointment.duration} minutes
Location Type: ${appointment.locationType}
${appointment.location ? `Location: ${appointment.location}` : ''}
${appointment.customerNotes ? `Notes: ${appointment.customerNotes}` : ''}

powered by INIYAN & Co Construction Services
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
    };

    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      sendUpdates: 'all',
      resource: updatedEvent,
    });

    const meetingLink =
      response.data.hangoutLink || response.data.conferenceData?.entryPoints?.[0]?.uri || '';

    return {
      success: true,
      meetingLink,
      event: response.data,
    };
  } catch (error) {
    console.error('Error updating Google Meet event:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete Google Meet event
export const deleteMeetEvent = async (eventId) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REFRESH_TOKEN) {
      return {
        success: false,
        message: 'Google Calendar not configured',
      };
    }

    const oauth2Client = getOAuth2Client();
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
      sendUpdates: 'all',
    });

    return {
      success: true,
      message: 'Event deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting Google Meet event:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Generate OAuth2 URL for initial setup
export const getAuthUrl = () => {
  const oauth2Client = getOAuth2Client();

  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });

  return url;
};

// Exchange authorization code for tokens
export const getTokenFromCode = async (code) => {
  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    return {
      success: true,
      tokens,
      refreshToken: tokens.refresh_token,
    };
  } catch (error) {
    console.error('Error getting tokens:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};
