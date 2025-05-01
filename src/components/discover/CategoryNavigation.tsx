
import React from 'react';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";

const CategoryNavigation = () => {
  // List of skills for the dropdown
  const skillsList = [
    {
      title: "Music Theory",
      description: "Learn about harmonics, scales, modes and more"
    },
    {
      title: "Sight Reading",
      description: "Improve your ability to read and play sheet music"
    },
    {
      title: "Ear Training",
      description: "Develop your ability to identify pitches, intervals, and chords"
    },
    {
      title: "Improvisation",
      description: "Learn to create spontaneous musical compositions"
    },
    {
      title: "Composition",
      description: "Create your own songs and musical pieces"
    },
    {
      title: "Sound Engineering",
      description: "Record, edit and produce music professionally"
    },
    {
      title: "Performance",
      description: "Master stage presence and performance techniques"
    },
    {
      title: "Music Production",
      description: "Create, arrange, and produce music using software"
    }
  ];

  return (
    <div className="overflow-x-auto pb-2">
      <NavigationMenu className="max-w-none w-full justify-start mb-6 z-[100]">
        <NavigationMenuList className="space-x-2">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-muted/50 z-[100]">Instruments</NavigationMenuTrigger>
            <NavigationMenuContent className="w-screen max-w-md z-[100]">
                <ul className="grid w-full gap-3 p-4 md:grid-cols-2">
                  {["Piano", "Guitar", "Drums", "Violin", "Saxophone", "Flute", "Bass", "Trumpet"].map((item) => (
                    <li key={item}>
                      <NavigationMenuLink asChild>
                        <a
                          href={`#${item.toLowerCase()}`}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{item}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Discover {item.toLowerCase()} lessons, techniques, and performances
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-muted/50">Genres</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-screen max-w-md">
                <ul className="grid w-full gap-3 p-4 md:grid-cols-2">
                  {["Classical", "Jazz", "Rock", "Pop", "Hip Hop", "R&B", "Electronic", "Folk"].map((item) => (
                    <li key={item}>
                      <NavigationMenuLink asChild>
                        <a
                          href={`#${item.toLowerCase().replace(" ", "-")}`}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{item}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Explore {item.toLowerCase()} music theory, history, and performances
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-muted/50">Skills</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-screen max-w-md">
                <ul className="grid w-full gap-3 p-4 md:grid-cols-2">
                  {skillsList.map((skill) => (
                    <li key={skill.title}>
                      <NavigationMenuLink asChild>
                        <a
                          href={`#${skill.title.toLowerCase().replace(" ", "-")}`}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{skill.title}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {skill.description}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default CategoryNavigation;
