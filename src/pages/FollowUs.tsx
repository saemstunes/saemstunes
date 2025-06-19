
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Instagram, Facebook, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Custom TikTok icon as it's not available in lucide-react
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const FollowUs = () => {
  const socialPlatforms = [
    {
      name: 'Instagram',
      description: 'Follow us for daily music tips, behind-the-scenes content, and inspiration.',
      icon: Instagram,
      url: 'https://instagram.com/saemstunes',
      username: '@saemstunes',
      color: 'from-pink-500 to-purple-500'
    },
    {
      name: 'TikTok',
      description: 'Check out our trending music tutorials and quick lessons.',
      icon: TikTokIcon,
      url: 'https://tiktok.com/@saemstunes',
      username: '@saemstunes',
      color: 'from-black to-gray-800'
    },
    {
      name: 'Facebook',
      description: 'Join our community for events, live sessions, and updates.',
      icon: Facebook,
      url: 'https://facebook.com/saemstunes',
      username: 'Saem\'s Tunes',
      color: 'from-blue-700 to-blue-600'
    }
  ];

  const musicPlatforms = [
    {
      name: 'Spotify',
      description: 'Stream our original compositions and curated playlists.',
      url: 'https://open.spotify.com/artist/6oMbcOwuuETAvO51LesbO8',
      image: '/spotify.header.svg'
    },
    {
      name: 'SoundCloud',
      description: 'Discover our latest tracks and student performances.',
      url: 'https://soundcloud.com/saemstunes',
      image: '/soundcloud-header.svg'
    },
    {
      name: 'Apple Music',
      description: 'Listen to our music catalog on Apple Music.',
      url: 'https://music.apple.com/ca/artist/saems-tunes/1723336566',
      image: '/apple-header.svg'
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-proxima font-bold mb-2">Follow Saem's Tunes</h1>
          <p className="text-muted-foreground">Connect with us on social media and streaming platforms for updates, tutorials, and new music releases.</p>
        </div>
        
        {/* Social Media Platforms */}
        <div>
          <h2 className="text-2xl font-proxima font-semibold mb-4 flex items-center">
            <span className="text-gold mr-2">•</span> Social Media
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialPlatforms.map((platform) => (
              <Card key={platform.name} className="overflow-hidden">
                <div className={`h-3 bg-gradient-to-r ${platform.color}`}></div>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    {React.createElement(platform.icon, { className: "h-5 w-5" })}
                    {platform.name}
                  </CardTitle>
                  <CardDescription>{platform.username}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{platform.description}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gold hover:bg-gold-dark" 
                    onClick={() => window.open(platform.url, '_blank')}
                  >
                    Follow Us
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Music Releases */}
        <div>
          <h2 className="text-2xl font-proxima font-semibold mb-4 flex items-center">
            <span className="text-gold mr-2">•</span> Music Releases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {musicPlatforms.map((platform) => (
              <Card key={platform.name} className="overflow-hidden">
                <div className="aspect-video">
                  <img 
                    src={platform.image} 
                    alt={platform.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{platform.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{platform.description}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => window.open(platform.url, '_blank')}
                  >
                    <Music className="h-4 w-4 mr-2" />
                    Listen Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Latest Updates */}
        <div className="bg-muted rounded-lg p-6 mt-8">
          <h3 className="font-proxima font-semibold mb-2">Stay Connected</h3>
          <p className="text-muted-foreground">
            Follow us on social media to get notified about new lessons, upcoming events, and music releases. 
            Join our community of music enthusiasts and learners!
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default FollowUs;
