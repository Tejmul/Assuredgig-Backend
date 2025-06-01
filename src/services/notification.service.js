const { User, Job, Notification, Portfolio, NotificationPreference } = require('../models');
const { Op } = require('sequelize');
const { getIO } = require('../config/socket');
const emailService = require('./email.service');

class NotificationService {
  // Notify freelancers about matching jobs
  static async notifyMatchingFreelancers(job) {
    try {
      // Find freelancers with matching skills
      const matchingFreelancers = await User.findAll({
        where: {
          role: 'freelancer',
          isActive: true
        },
        include: [
          {
            model: Portfolio,
            where: {
              skills: {
                [Op.overlap]: job.skills
              }
            }
          },
          {
            model: NotificationPreference,
            required: false
          }
        ]
      });

      // Create notifications for matching freelancers
      const notifications = [];
      const io = getIO();

      for (const freelancer of matchingFreelancers) {
        const preferences = freelancer.NotificationPreference || {};
        
        // Create in-app notification
        if (preferences.inAppNotifications !== false) {
          const notification = await Notification.create({
            userId: freelancer.id,
            type: 'job_match',
            title: 'New Job Match',
            message: `A new job matching your skills has been posted: ${job.title}`,
            relatedId: job.id,
            relatedType: 'job'
          });
          notifications.push(notification);

          // Send real-time notification
          if (preferences.pushNotifications !== false) {
            io.to(`user_${freelancer.id}`).emit('notification', {
              type: 'job_match',
              title: 'New Job Match',
              message: `A new job matching your skills has been posted: ${job.title}`,
              data: { jobId: job.id }
            });
          }
        }

        // Send email notification
        if (preferences.emailNotifications !== false) {
          await emailService.sendJobMatchNotification(freelancer, job);
        }
      }

      return notifications.length;
    } catch (error) {
      console.error('Error notifying matching freelancers:', error);
      throw error;
    }
  }

  // Create a notification with all channels
  static async createNotification(data) {
    try {
      const { userId, type, title, message, relatedId, relatedType } = data;
      
      // Get user preferences
      const user = await User.findByPk(userId, {
        include: [NotificationPreference]
      });

      const preferences = user.NotificationPreference || {};
      const notification = await Notification.create(data);

      // Send real-time notification
      if (preferences.pushNotifications !== false) {
        const io = getIO();
        io.to(`user_${userId}`).emit('notification', {
          type,
          title,
          message,
          data: { [relatedType]: relatedId }
        });
      }

      // Send email notification based on type
      if (preferences.emailNotifications !== false) {
        switch (type) {
          case 'application_received':
          case 'application_accepted':
          case 'application_rejected':
            const application = await Application.findByPk(relatedId, {
              include: [Job]
            });
            await emailService.sendApplicationStatusNotification(user, application, type.split('_')[1]);
            break;
          case 'contract_created':
          case 'contract_updated':
            const contract = await Contract.findByPk(relatedId, {
              include: [Job]
            });
            await emailService.sendContractNotification(user, contract);
            break;
          case 'meeting_scheduled':
            const meeting = await Meeting.findByPk(relatedId);
            await emailService.sendMeetingNotification(user, meeting);
            break;
        }
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Get user's notifications
  static async getUserNotifications(userId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const notifications = await Notification.findAndCountAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      return {
        notifications: notifications.rows,
        total: notifications.count,
        page,
        totalPages: Math.ceil(notifications.count / limit)
      };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  // Get user's notification preferences
  static async getNotificationPreferences(userId) {
    try {
      const preferences = await NotificationPreference.findOne({
        where: { userId }
      });
      return preferences;
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      throw error;
    }
  }

  // Update user's notification preferences
  static async updateNotificationPreferences(userId, preferences) {
    try {
      const [pref, created] = await NotificationPreference.findOrCreate({
        where: { userId },
        defaults: preferences
      });

      if (!created) {
        await pref.update(preferences);
      }

      return pref;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  // Mark notifications as read
  static async markAsRead(userId, notificationIds) {
    try {
      await Notification.update(
        {
          isRead: true,
          readAt: new Date()
        },
        {
          where: {
            id: {
              [Op.in]: notificationIds
            },
            userId
          }
        }
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(userId) {
    try {
      await Notification.update(
        {
          isRead: true,
          readAt: new Date()
        },
        {
          where: {
            userId,
            isRead: false
          }
        }
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete a notification
  static async deleteNotification(userId, notificationId) {
    try {
      await Notification.destroy({
        where: {
          id: notificationId,
          userId
        }
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

module.exports = NotificationService; 