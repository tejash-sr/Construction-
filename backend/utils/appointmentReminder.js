import cron from 'node-cron';
import Appointment from '../models/Appointment.js';
import { sendAppointmentReminderEmail } from './emailService.js';
import dayjs from 'dayjs';

// Run every hour to check for appointments that need reminders
export const startAppointmentReminderCron = () => {
  // Run at minute 0 of every hour (e.g., 1:00, 2:00, 3:00, etc.)
  cron.schedule('0 * * * *', async () => {
    console.log('Running appointment reminder check...');
    
    try {
      const now = dayjs();
      const in24Hours = now.add(24, 'hour');
      const in25Hours = now.add(25, 'hour');

      // Find confirmed appointments that are 24 hours away
      // and haven't had a 24h reminder sent yet
      const appointments = await Appointment.find({
        status: 'confirmed',
        scheduledDate: {
          $gte: in24Hours.startOf('day').toDate(),
          $lte: in25Hours.endOf('day').toDate(),
        },
      }).populate('user', 'name email phone');

      let remindersSent = 0;

      for (const appointment of appointments) {
        try {
          // Parse appointment date and time
          const appointmentDateTime = dayjs(
            `${appointment.scheduledDate.toISOString().split('T')[0]} ${appointment.scheduledTime}`,
            'YYYY-MM-DD h:mm A'
          );

          // Check if appointment is approximately 24 hours away (23-25 hours)
          const hoursUntil = appointmentDateTime.diff(now, 'hour', true);
          
          if (hoursUntil >= 23 && hoursUntil <= 25) {
            // Check if 24h reminder already sent
            const reminderSent = appointment.remindersSent?.some(
              (reminder) => reminder.type === '24h'
            );

            if (!reminderSent) {
              // Send reminder email
              const emailResult = await sendAppointmentReminderEmail(
                appointment,
                appointment.user
              );

              if (emailResult.success) {
                // Mark reminder as sent
                appointment.remindersSent.push({
                  sentAt: new Date(),
                  type: '24h',
                });
                await appointment.save();
                remindersSent++;

                console.log(
                  `Reminder sent for appointment ${appointment._id} - ${appointment.appointmentType}`
                );
              } else {
                console.error(
                  `Failed to send reminder for appointment ${appointment._id}:`,
                  emailResult.error
                );
              }
            }
          }
        } catch (error) {
          console.error(
            `Error processing appointment ${appointment._id}:`,
            error.message
          );
        }
      }

      if (remindersSent > 0) {
        console.log(`✅ Sent ${remindersSent} appointment reminder(s)`);
      } else {
        console.log('No reminders to send at this time');
      }
    } catch (error) {
      console.error('Error in appointment reminder cron job:', error);
    }
  });

  console.log('✅ Appointment reminder cron job started (runs hourly)');
};

// Optional: Send 1-hour reminders (less common, but can be useful)
export const send1HourReminders = async () => {
  try {
    const now = dayjs();
    const in1Hour = now.add(1, 'hour');
    const in2Hours = now.add(2, 'hour');

    const appointments = await Appointment.find({
      status: 'confirmed',
      scheduledDate: {
        $gte: in1Hour.startOf('day').toDate(),
        $lte: in2Hours.endOf('day').toDate(),
      },
    }).populate('user', 'name email phone');

    for (const appointment of appointments) {
      const appointmentDateTime = dayjs(
        `${appointment.scheduledDate.toISOString().split('T')[0]} ${appointment.scheduledTime}`,
        'YYYY-MM-DD h:mm A'
      );

      const minutesUntil = appointmentDateTime.diff(now, 'minute');

      if (minutesUntil >= 50 && minutesUntil <= 70) {
        const reminderSent = appointment.remindersSent?.some(
          (reminder) => reminder.type === '1h'
        );

        if (!reminderSent) {
          await sendAppointmentReminderEmail(appointment, appointment.user);

          appointment.remindersSent.push({
            sentAt: new Date(),
            type: '1h',
          });
          await appointment.save();
        }
      }
    }
  } catch (error) {
    console.error('Error in 1-hour reminder check:', error);
  }
};
