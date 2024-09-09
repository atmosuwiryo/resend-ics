import { Resend } from 'resend';
import fs from 'fs/promises';
import * as ics from 'ics'
const resend = new Resend('your_resend_api_key');

async function createICSFile() {
  const event: ics.EventAttributes = {
    start: [2024, 9, 11, 14, 30],
    duration: { hours: 1 },
    title: 'Dentist appointment',
    description: 'Dentist appointment of the year',
    location: 'Dentist\'s office',
    url: 'https://waiki.dev',
    categories: ['appointment', 'health'],
    status: 'CONFIRMED',
    organizer: { name: 'Happy Dental', email: 'no-reply@waiki.dev' },
    attendees: [
      { name: 'Mike Hogan', email: 'songstitch@gmail.com', rsvp: true, partstat: 'NEEDS-ACTION', role: 'REQ-PARTICIPANT' },
      // { name: 'Widyo Atmoko', email: 'widyoatmoko@yahoo.com', rsvp: true, partstat: 'NEEDS-ACTION', role: 'REQ-PARTICIPANT' },
      { name: 'Atmo Suwiryo', email: 'suwiryo.atmo@gmail.com', rsvp: true, partstat: 'NEEDS-ACTION', role: 'REQ-PARTICIPANT' }
    ]
  };

  const { error, value } = ics.createEvent(event);
  
  if (error) {
    throw error;
  }

  console.log(value);
  await fs.writeFile('appointment.ics', value!);
  return 'appointment.ics';
}

async function sendEmailWithAttachment() {
  try {
    const icsFilePath = await createICSFile();
    const icsContent = await fs.readFile(icsFilePath, 'utf8');

    const data = await resend.emails.send({
      from: 'Atmo <no-reply@waiki.dev>',
      to: ['suwiryo.atmo@gmail.com', 'songstitch@gmail.com'],
      // to: ['suwiryo.atmo@gmail.com', 'widyoatmoko@yahoo.com'],
      subject: 'Dentist appointment',
      text: 'Dentist appointment from resend.com',
      attachments: [
        {
          filename: 'appointment.ics',
          content: icsContent,
        },
      ],
    });

    console.log('Email sent successfully:', data);

    // Clean up the temporary file
    await fs.unlink(icsFilePath);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

sendEmailWithAttachment();
