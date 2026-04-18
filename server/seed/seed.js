const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Student = require('../models/Student');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Coordinator = require('../models/Coordinator');
const Feedback = require('../models/Feedback');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await Student.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});
    await Coordinator.deleteMany({});
    await Feedback.deleteMany({});
    console.log('Cleared existing data.');

    // Create Coordinators
    const coordinators = await Coordinator.create([
      {
        name: 'Dr. Rajesh Kumar',
        email: 'admin@college.edu',
        password: 'admin123',
        phone: '9876543210',
        department: 'Computer Science',
        role: 'admin'
      },
      {
        name: 'Prof. Anita Sharma',
        email: 'anita@college.edu',
        password: 'coord123',
        phone: '9876543211',
        department: 'Electronics',
        role: 'coordinator'
      },
      {
        name: 'Dr. Vikram Singh',
        email: 'vikram@college.edu',
        password: 'coord123',
        phone: '9876543212',
        department: 'Mechanical',
        role: 'coordinator'
      }
    ]);
    console.log(`Created ${coordinators.length} coordinators.`);

    // Create Students
    const students = await Student.create([
      { name: 'Aarav Patel', email: 'aarav@student.edu', collegeId: 'CS2024001', password: 'student123', phone: '9000000001', department: 'Computer Science', year: 2 },
      { name: 'Priya Mehta', email: 'priya@student.edu', collegeId: 'CS2024002', password: 'student123', phone: '9000000002', department: 'Computer Science', year: 3 },
      { name: 'Rohan Gupta', email: 'rohan@student.edu', collegeId: 'EC2024001', password: 'student123', phone: '9000000003', department: 'Electronics', year: 2 },
      { name: 'Sneha Reddy', email: 'sneha@student.edu', collegeId: 'ME2024001', password: 'student123', phone: '9000000004', department: 'Mechanical', year: 4 },
      { name: 'Arjun Nair', email: 'arjun@student.edu', collegeId: 'CS2024003', password: 'student123', phone: '9000000005', department: 'Computer Science', year: 1 },
      { name: 'Kavya Iyer', email: 'kavya@student.edu', collegeId: 'EC2024002', password: 'student123', phone: '9000000006', department: 'Electronics', year: 3 },
      { name: 'Rahul Verma', email: 'rahul@student.edu', collegeId: 'ME2024002', password: 'student123', phone: '9000000007', department: 'Mechanical', year: 2 },
      { name: 'Divya Joshi', email: 'divya@student.edu', collegeId: 'CS2024004', password: 'student123', phone: '9000000008', department: 'Computer Science', year: 4 },
      { name: 'Amit Saxena', email: 'amit@student.edu', collegeId: 'EC2024003', password: 'student123', phone: '9000000009', department: 'Electronics', year: 1 },
      { name: 'Neha Kapoor', email: 'neha@student.edu', collegeId: 'CS2024005', password: 'student123', phone: '9000000010', department: 'Computer Science', year: 2 }
    ]);
    console.log(`Created ${students.length} students.`);

    // Create Events
    const now = new Date();
    const events = await Event.create([
      {
        title: 'TechFest 2026 - Hackathon',
        description: 'A 24-hour coding marathon where teams of 4 compete to build innovative solutions. Prizes worth ₹50,000! Open to all departments.',
        date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
        venue: 'Main Auditorium, Block A',
        category: 'Technical',
        maxParticipants: 200,
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        coordinator: coordinators[0]._id,
        status: 'upcoming'
      },
      {
        title: 'Annual Cultural Night',
        description: 'Celebrate the diversity of our college with music, dance, drama, and art performances from all departments. Food stalls included!',
        date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        venue: 'Open Air Theatre',
        category: 'Cultural',
        maxParticipants: 500,
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
        coordinator: coordinators[1]._id,
        status: 'upcoming'
      },
      {
        title: 'Inter-Department Cricket Tournament',
        description: 'Annual cricket tournament between all departments. T20 format. Register your team of 11 players.',
        date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        venue: 'College Cricket Ground',
        category: 'Sports',
        maxParticipants: 100,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
        coordinator: coordinators[2]._id,
        status: 'upcoming'
      },
      {
        title: 'AI/ML Workshop',
        description: 'Hands-on workshop on Artificial Intelligence and Machine Learning using Python and TensorFlow. Bring your laptops!',
        date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        venue: 'Computer Lab 3, Block B',
        category: 'Workshop',
        maxParticipants: 60,
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
        coordinator: coordinators[0]._id,
        status: 'upcoming'
      },
      {
        title: 'Guest Lecture: Future of Quantum Computing',
        description: 'Distinguished lecture by Prof. Srinivasan from IISc Bangalore on quantum computing and its applications.',
        date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        venue: 'Seminar Hall, Block C',
        category: 'Seminar',
        maxParticipants: 150,
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
        coordinator: coordinators[1]._id,
        status: 'upcoming'
      },
      {
        title: 'Web Development Bootcamp',
        description: 'Learn full-stack web development with MERN stack in this intensive 3-day bootcamp. Certificate provided.',
        date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        venue: 'Computer Lab 1, Block B',
        category: 'Workshop',
        maxParticipants: 40,
        image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
        coordinator: coordinators[0]._id,
        status: 'completed'
      },
      {
        title: 'Robotics Competition',
        description: 'Build and program robots to complete an obstacle course. Teams of 3-5 members. Components provided.',
        date: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
        venue: 'Mechanical Workshop, Block D',
        category: 'Technical',
        maxParticipants: 80,
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        coordinator: coordinators[2]._id,
        status: 'upcoming'
      },
      {
        title: 'Photography Walk & Exhibition',
        description: 'Campus photography walk followed by an exhibition of the best shots. Open to all skill levels. DSLR cameras available.',
        date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        venue: 'Campus Gardens & Gallery',
        category: 'Cultural',
        maxParticipants: 50,
        image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
        coordinator: coordinators[1]._id,
        status: 'completed'
      }
    ]);
    console.log(`Created ${events.length} events.`);

    // Create sample registrations
    const QRCode = require('qrcode');
    const registrations = [];

    const regPairs = [
      [0, 0], [0, 3], [0, 5],
      [1, 0], [1, 1], [1, 4],
      [2, 2], [2, 3],
      [3, 1], [3, 2], [3, 6],
      [4, 0], [4, 4], [4, 5],
      [5, 1], [5, 3],
      [6, 2], [6, 6],
      [7, 0], [7, 1], [7, 5],
      [8, 3], [8, 4],
      [9, 0], [9, 5], [9, 7]
    ];

    for (const [si, ei] of regPairs) {
      const reg = await Registration.create({
        student: students[si]._id,
        event: events[ei]._id,
        checkedIn: events[ei].status === 'completed',
        checkedInAt: events[ei].status === 'completed' ? events[ei].date : undefined
      });
      const qrData = JSON.stringify({ regId: reg._id, studentId: students[si]._id, eventId: events[ei]._id });
      reg.qrCode = await QRCode.toDataURL(qrData);
      await reg.save();
      registrations.push(reg);
    }
    console.log(`Created ${registrations.length} registrations.`);

    // Create sample feedback (for completed events)
    const completedEventIds = events.filter(e => e.status === 'completed').map(e => e._id);
    const feedbackData = [];

    for (const reg of registrations) {
      if (completedEventIds.some(id => id.equals(reg.event))) {
        feedbackData.push({
          student: reg.student,
          event: reg.event,
          rating: Math.floor(Math.random() * 3) + 3, // 3-5 rating
          comment: ['Great event!', 'Learned a lot!', 'Well organized.', 'Amazing experience!', 'Would attend again.'][Math.floor(Math.random() * 5)]
        });
      }
    }

    if (feedbackData.length > 0) {
      await Feedback.create(feedbackData);
      console.log(`Created ${feedbackData.length} feedback entries.`);
    }

    console.log('\n--- Seed Data Summary ---');
    console.log(`Coordinators: ${coordinators.length}`);
    console.log(`Students: ${students.length}`);
    console.log(`Events: ${events.length}`);
    console.log(`Registrations: ${registrations.length}`);
    console.log(`Feedback: ${feedbackData.length}`);
    console.log('\n--- Login Credentials ---');
    console.log('Admin:       admin@college.edu / admin123');
    console.log('Coordinator: anita@college.edu / coord123');
    console.log('Student:     aarav@student.edu / student123');
    console.log('\nSeeding complete!');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
