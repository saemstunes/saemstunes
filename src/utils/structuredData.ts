
interface Organization {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint: {
    "@type": string;
    telephone: string;
    contactType: string;
    email: string;
  };
  sameAs: string[];
}

interface Course {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  provider: {
    "@type": string;
    name: string;
    url: string;
  };
  educationalLevel: string;
  teaches: string[];
  url: string;
  image?: string;
  duration?: string;
}

interface WebApplication {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    "@type": string;
    price: string;
    priceCurrency: string;
  };
}

export const organizationSchema: Organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Saem's Tunes",
  url: "https://saemstunes.app",
  logo: "https://i.imgur.com/ltEen5M.png",
  description: "Making Music, Representing Christ - Online music learning platform for all ages",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-XXX-XXX-XXXX",
    contactType: "Customer Service",
    email: "saemstunes@gmail.com"
  },
  sameAs: [
    "https://instagram.com/saemstunes",
    "https://twitter.com/saemstunes"
  ]
};

export const createCourseSchema = (course: {
  name: string;
  description: string;
  level: string;
  skills: string[];
  url: string;
  image?: string;
  duration?: string;
}): Course => ({
  "@context": "https://schema.org",
  "@type": "Course",
  name: course.name,
  description: course.description,
  provider: {
    "@type": "Organization",
    name: "Saem's Tunes",
    url: "https://saemstunes.app"
  },
  educationalLevel: course.level,
  teaches: course.skills,
  url: course.url,
  image: course.image,
  duration: course.duration
});

export const webApplicationSchema: WebApplication = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Saem's Tunes App",
  description: "Comprehensive music learning platform with courses, tools, and community features",
  url: "https://saemstunes.app",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web Browser, Android",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  }
};
