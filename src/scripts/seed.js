require('dotenv').config();
const { User, Job, Application } = require('../models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    // Create test users
    const client = await User.create({
      email: 'client@test.com',
      password: 'password123',
      fullName: 'Test Client',
      role: 'client'
    });

    const freelancer = await User.create({
      email: 'freelancer@test.com',
      password: 'password123',
      fullName: 'Test Freelancer',
      role: 'freelancer'
    });

    // Create test jobs
    const job1 = await Job.create({
      title: 'Web Development Project',
      description: 'Need a full-stack developer for a web application',
      budget: 1000,
      deadline: new Date('2024-12-31'),
      status: 'open',
      skills: ['Node.js', 'React', 'PostgreSQL'],
      clientId: client.id
    });

    const job2 = await Job.create({
      title: 'Mobile App Development',
      description: 'Looking for a mobile app developer',
      budget: 2000,
      deadline: new Date('2024-12-15'),
      status: 'open',
      skills: ['React Native', 'Firebase'],
      clientId: client.id
    });

    // Create test applications
    await Application.create({
      proposal: 'I can help with this project',
      expectedDeliveryDate: new Date('2024-12-20'),
      status: 'pending',
      bidAmount: 900,
      jobId: job1.id,
      freelancerId: freelancer.id
    });

    await Application.create({
      proposal: 'I have experience with mobile development',
      expectedDeliveryDate: new Date('2024-12-10'),
      status: 'pending',
      bidAmount: 1800,
      jobId: job2.id,
      freelancerId: freelancer.id
    });

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed(); 