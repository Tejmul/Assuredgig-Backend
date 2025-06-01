const nodemailer = require('nodemailer');
const { logger } = require('../middleware/logger.middleware');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(to, subject, html) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Email sent:', info.messageId);
      return info;
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  async sendJobMatchNotification(user, job) {
    const subject = 'New Job Match Found!';
    const html = `
      <h2>New Job Match</h2>
      <p>A new job matching your skills has been posted:</p>
      <h3>${job.title}</h3>
      <p>${job.description}</p>
      <p>Budget: $${job.budget}</p>
      <p>Deadline: ${new Date(job.deadline).toLocaleDateString()}</p>
      <p>Click here to view the job: <a href="${process.env.FRONTEND_URL}/jobs/${job.id}">View Job</a></p>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  async sendApplicationStatusNotification(user, application, status) {
    const subject = `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`;
    const html = `
      <h2>Application Update</h2>
      <p>Your application for "${application.job.title}" has been ${status}.</p>
      <p>Click here to view the job: <a href="${process.env.FRONTEND_URL}/jobs/${application.jobId}">View Job</a></p>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  async sendContractNotification(user, contract) {
    const subject = 'New Contract Created';
    const html = `
      <h2>New Contract</h2>
      <p>A new contract has been created for the job "${contract.job.title}".</p>
      <p>Click here to view the contract: <a href="${process.env.FRONTEND_URL}/contracts/${contract.id}">View Contract</a></p>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  async sendMeetingNotification(user, meeting) {
    const subject = 'New Meeting Scheduled';
    const html = `
      <h2>Meeting Scheduled</h2>
      <p>A new meeting has been scheduled:</p>
      <p>Title: ${meeting.title}</p>
      <p>Date: ${new Date(meeting.startTime).toLocaleString()}</p>
      <p>Click here to view the meeting: <a href="${process.env.FRONTEND_URL}/meetings/${meeting.id}">View Meeting</a></p>
    `;

    return this.sendEmail(user.email, subject, html);
  }
}

module.exports = new EmailService(); 