import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        equipment: 'Equipment',
        howItWorks: 'How It Works',
        pricing: 'Pricing',
        login: 'Login',
        signup: 'Sign Up',
        dashboard: 'Dashboard',
        logout: 'Logout'
      },
      hero: {
        title: 'Rent Farm Equipment',
        titleHighlight: 'Without the Hassle',
        subtitle: 'Connect with local equipment owners, book tractors, harvesters, drones and more. Save money through community sharing.',
        cta: 'Find Equipment',
        ctaSecondary: 'List Your Equipment',
        stats: {
          equipment: 'Equipment Listed',
          farmers: 'Active Farmers',
          villages: 'Villages Covered',
          saved: 'Money Saved'
        }
      },
      features: {
        title: 'Everything You Need',
        subtitle: 'From search to booking to payment – we make farm equipment rental simple',
        smartBooking: 'Smart Booking',
        smartBookingDesc: 'Book equipment instantly or send requests. Real-time availability and automated scheduling.',
        gpsTracking: 'GPS Tracking',
        gpsTrackingDesc: 'Track your rented equipment in real-time. Know exactly when it arrives at your field.',
        groupSharing: 'Group Sharing',
        groupSharingDesc: 'Split costs with neighboring farmers. Make expensive equipment affordable for everyone.',
        securePayments: 'Secure Payments',
        securePaymentsDesc: 'Pay via UPI, cards, or wallet. Get invoices and track all your transactions.',
        operatorIncluded: 'Operator Included',
        operatorIncludedDesc: 'Need a skilled operator? Book equipment with trained professionals.',
        support: '24/7 Support',
        supportDesc: 'Emergency breakdowns? Our support team is always ready to help.'
      },
      howItWorks: {
        title: 'How It Works',
        subtitle: 'Get started in three simple steps',
        step1: 'Search',
        step1Desc: 'Find equipment near you by type, location, and availability',
        step2: 'Book',
        step2Desc: 'Select your time slot, add operator if needed, and confirm',
        step3: 'Use',
        step3Desc: 'Equipment arrives at your field, track in real-time, pay securely'
      },
      categories: {
        title: 'Equipment Categories',
        tractors: 'Tractors',
        harvesters: 'Harvesters',
        drones: 'Drones',
        tillers: 'Tillers',
        sprayers: 'Sprayers',
        pumps: 'Water Pumps'
      },
      testimonials: {
        title: 'What Farmers Say',
        subtitle: 'Join thousands of satisfied farmers'
      },
      cta: {
        title: 'Ready to Get Started?',
        subtitle: 'Join thousands of farmers saving money on equipment rental',
        button: 'Start Free Today'
      },
      footer: {
        description: 'Making farm equipment accessible to every farmer',
        product: 'Product',
        company: 'Company',
        support: 'Support',
        legal: 'Legal',
        copyright: '© 2024 AgroToolAccess. All rights reserved.'
      },
      common: {
        perHour: '/hour',
        perDay: '/day',
        perAcre: '/acre',
        available: 'Available',
        booked: 'Booked',
        inUse: 'In Use',
        bookNow: 'Book Now',
        viewDetails: 'View Details',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        loading: 'Loading...',
        noResults: 'No results found'
      },
      booking: {
        selectDate: 'Select Date',
        selectTime: 'Select Time Slot',
        duration: 'Duration',
        withOperator: 'With Operator',
        totalCost: 'Total Cost',
        confirm: 'Confirm Booking',
        success: 'Booking Confirmed!',
        pending: 'Pending Approval'
      },
      dashboard: {
        welcome: 'Welcome back',
        myBookings: 'My Bookings',
        myEquipment: 'My Equipment',
        earnings: 'Earnings',
        wallet: 'Wallet',
        settings: 'Settings',
        notifications: 'Notifications'
      }
    }
  },
  hi: {
    translation: {
      nav: {
        home: 'होम',
        equipment: 'उपकरण',
        howItWorks: 'कैसे काम करता है',
        pricing: 'मूल्य',
        login: 'लॉग इन',
        signup: 'साइन अप',
        dashboard: 'डैशबोर्ड',
        logout: 'लॉग आउट'
      },
      hero: {
        title: 'खेती के उपकरण किराए पर लें',
        titleHighlight: 'बिना किसी परेशानी के',
        subtitle: 'स्थानीय उपकरण मालिकों से जुड़ें, ट्रैक्टर, हार्वेस्टर, ड्रोन और बहुत कुछ बुक करें।',
        cta: 'उपकरण खोजें',
        ctaSecondary: 'अपना उपकरण लिस्ट करें',
        stats: {
          equipment: 'सूचीबद्ध उपकरण',
          farmers: 'सक्रिय किसान',
          villages: 'गांव कवर',
          saved: 'बचत'
        }
      },
      common: {
        perHour: '/घंटा',
        perDay: '/दिन',
        perAcre: '/एकड़',
        available: 'उपलब्ध',
        booked: 'बुक किया गया',
        inUse: 'उपयोग में',
        bookNow: 'अभी बुक करें',
        viewDetails: 'विवरण देखें',
        search: 'खोजें',
        filter: 'फ़िल्टर',
        sort: 'क्रमबद्ध',
        loading: 'लोड हो रहा है...',
        noResults: 'कोई परिणाम नहीं मिला'
      }
    }
  },
  mr: {
    translation: {
      nav: {
        home: 'मुख्यपृष्ठ',
        equipment: 'साधने',
        howItWorks: 'कसे काम करते',
        pricing: 'किंमत',
        login: 'लॉग इन',
        signup: 'साइन अप',
        dashboard: 'डॅशबोर्ड',
        logout: 'लॉग आउट'
      },
      hero: {
        title: 'शेती उपकरणे भाड्याने घ्या',
        titleHighlight: 'कोणत्याही त्रासाशिवाय',
        subtitle: 'स्थानिक उपकरण मालकांशी जोडा, ट्रॅक्टर, हार्वेस्टर, ड्रोन आणि बरेच काही बुक करा।',
        cta: 'साधने शोधा',
        ctaSecondary: 'तुमची साधने सूचीबद्ध करा'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;