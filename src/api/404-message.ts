import { supabase } from '@/integrations/supabase/client';

const VARIANTS = {
  playful: [
    "Can't find `{path}`. Our squirrels looked and came up empty-pawed.",
    "404: `{path}` went on vacation without telling anyone.",
    "You found a blank spot: `{path}`. Nice detective work.",
    "Well this is awkward — `{path}` seems to be hiding from the internet.",
    "Huh. `{path}` is playing hide-and-seek. We lost.",
    "We searched under the couch; `{path}` wasn't there.",
    "Oof. `{path}` bounced. We're on it.",
    "Error 404 — `{path}` unplugged itself for unknown reasons.",
    "Whoops. `{path}` took a detour.",
    "Looks like `{path}` never RSVP'd to the internet party.",
    "This page (`{path}`) is practicing social distancing from our server.",
    "Our map doesn't show `{path}`. Can you be our cartographer?",
    "We couldn't fetch `{path}`. Maybe it left with the cookies.",
    "Hmm. `{path}` must be under construction. Hardhat time.",
    "404 report: `{path}` — missing but suspected adorable.",
    "It's not you, it's `{path}`. It's missing.",
    "We checked the attic; `{path}` isn't there (and there were cobwebs).",
    "This feels like the plot twist: `{path}` is fictional.",
    "Your persistence found `{path}` — sadly it's invisible.",
    "404: `{path}` — currently experiencing identity issues.",
    "We tried to fetch `{path}` but it ghosted us.",
    "Well spotted. `{path}` is absent without leave.",
    "Looks like `{path}` took the scenic route and never returned.",
    "You're right to call this out — `{path}` is officially MIA.",
    // MUSICAL ADDITIONS
    "`{path}` is playing a silent symphony — we can't hear it either.",
    "404: `{path}` missed its cue and never entered the stage.",
    "Looks like `{path}` is stuck in an eternal rest. No sound here.",
    "`{path}` went off-key and disappeared into the void.",
    "We're conducting a search for `{path}`, but the orchestra is confused.",
    "404: `{path}` decided to improvise and jazzed right out of existence.",
    "`{path}` is playing hide-and-seek in 4/4 time. Still counting.",
    "This page (`{path}`) is having a solo career — away from our servers.",
    "We tried to tune into `{path}` but got static instead.",
    "`{path}` hit a wrong note and vanished into the digital ether.",
    "404: `{path}` is on a world tour and forgot to tell us the schedule.",
    "Looks like `{path}` is stuck in a minor key — we can't find the resolve.",
    "`{path}` went backstage and never returned for the encore.",
    "We're getting radio silence from `{path}`. Check your antenna?",
    "404: `{path}` is composing itself somewhere else apparently.",
    "`{path}` dropped the beat and we can't find where it landed.",
    "This URL (`{path}`) is playing musical chairs with our server.",
    "We tried to remix `{path}` but the original track is missing.",
    "404: `{path}` is experiencing technical difficulties with its amplifier.",
    "`{path}` went to band camp and never came back.",
    "Looks like `{path}` is stuck on repeat — of nonexistence.",
    "We can't find `{path}`. Maybe it's in a different octave?",
    "404: `{path}` is having a sound check that's taking forever.",
    "`{path}` joined the witness protection program for URLs.",
    "This page (`{path}`) is playing hard to get — very hard.",
    "We tried to duet with `{path}` but it's a no-show.",
    "404: `{path}` is practicing scales somewhere we can't hear.",
    "`{path}` went to find itself and got lost in the process.",
    "Looks like `{path}` is having an existential crisis about its chord progression.",
    "We searched the entire songbook — `{path}` isn't in there.",
    "404: `{path}` is on mute and we can't find the unmute button.",
    "`{path}` decided to go acoustic and unplugged from everything.",
    "This URL (`{path}`) is having stage fright and won't perform.",
    "We tried to auto-tune `{path}` but it's completely out of range.",
    "404: `{path}` is in the studio recording its absence.",
    "`{path}` went on a coffee break during its big solo.",
    "Looks like `{path}` is playing in a frequency only dogs can hear.",
    "We can't find `{path}`. Maybe it's stuck in the bridge section?",
    "404: `{path}` is doing an unplugged session — very unplugged.",
    "`{path}` got stage fright and hid behind the digital curtain.",
    "This page (`{path}`) is having a tempo tantrum and won't load.",
    "We tried to harmonize with `{path}` but it's singing a different tune.",
    "404: `{path}` is taking a really long intermission.",
    "`{path}` went to tune its digital strings and got tangled up.",
    "Looks like `{path}` is playing in a parallel universe orchestra.",
    "We searched every measure — `{path}` skipped its part entirely.",
    "404: `{path}` is having a pitch perfect meltdown.",
    "`{path}` went to find the beat and got lost in the rhythm section.",
    "This URL (`{path}`) is doing interpretive dance instead of loading.",
    "We tried to sample `{path}` but the original is nowhere to be found.",
    "404: `{path}` is stuck in a loop pedal and can't escape.",
    "`{path}` went to the metaphorical recording studio in the sky.",
    "Looks like `{path}` is playing hide-and-seek with a metronome.",
    "We can't find `{path}`. It might be in the lost chord archives.",
    "404: `{path}` is having a creative block and won't produce sound.",
    "`{path}` decided to go on tour without booking any venues.",
    "This page (`{path}`) is practicing its scales in another dimension.",
    "We tried to conduct `{path}` but our baton broke.",
    "404: `{path}` is experiencing feedback and shut itself down.",
    "`{path}` went to find its inner rhythm and got lost in the groove.",
    "Looks like `{path}` is playing a song only it can hear.",
    "We searched the entire playlist — `{path}` must have been deleted.",
    "404: `{path}` is having a vinyl moment and won't go digital.",
    "`{path}` went to the bathroom during its solo and never returned.",
    "This URL (`{path}`) is having a karaoke night somewhere else.",
    "We tried to remix `{path}` but it's copyright protected by the void.",
    "404: `{path}` is stuck in shuffle mode and can't find its place.",
    "`{path}` went to find the perfect reverb and got lost in the echo.",
    "Looks like `{path}` is playing in a soundproof room — we can't hear it.",
    "We can't find `{path}`. Maybe it's in the deleted scenes of the internet?",
    "404: `{path}` is having a drumroll that never ends.",
    "`{path}` decided to go analog and disconnected from the digital world.",
    "This page (`{path}`) is warming up its vocals and taking forever.",
    "We tried to duet with `{path}` but it's singing in a different key of existence.",
    "404: `{path}` is stuck on the wrong side of the mixing board.",
    "`{path}` went to find its muse and they both disappeared.",
    "Looks like `{path}` is playing in the orchestra pit — too deep to reach.",
    "We searched every genre — `{path}` doesn't fit any category.",
    "404: `{path}` is having a midlife crisis and changed its identity.",
    "`{path}` went to the record store and got lost in the vinyl section.",
    "This URL (`{path}`) is practicing for a concert that may never happen.",
    "We tried to auto-correct `{path}` but it insists on being wrong.",
    "404: `{path}` is on a spiritual journey to find its true frequency.",
    "`{path}` decided to become a mime and won't make any HTTP sounds.",
    "Looks like `{path}` is playing musical chairs with our database.",
    "We can't find `{path}`. It might be hiding in the bass clef.",
    "404: `{path}` is having a sound bite crisis and won't load.",
    "`{path}` went to the digital conservatory and never graduated.",
    "This page (`{path}`) is having a remix emergency — please stand by.",
    "We tried to sync with `{path}` but it's dancing to its own beat.",
    "404: `{path}` is stuck in a time signature we don't recognize.",
    "`{path}` went to find the perfect sample and got lost in the library.",
    "Looks like `{path}` is playing in the key of 'file not found'.",
    "We searched the entire discography — `{path}` is a B-side that never existed.",
    "404: `{path}` is having an acoustic breakdown in digital space.",
    "`{path}` decided to go solo and forgot to tell the rest of the band.",
    "This URL (`{path}`) is stuck in a guitar solo that won't end.",
    "We tried to harmonize with `{path}` but it's singing in ancient languages.",
    "404: `{path}` is practicing its death metal scream in silence.",
    "`{path}` went to find the perfect reverb setting and got lost in the delay.",
    "Looks like `{path}` is playing hopscotch with our server architecture.",
    "We can't find `{path}`. Maybe it's hiding in the treble clef?",
    "404: `{path}` is having a jazz fusion meltdown — too complex to compute.",
    "`{path}` went on a world tour of non-existent venues.",
    "This page (`{path}`) is stuck in a loop pedal and can't break free.",
    "We tried to beatmatch `{path}` but it's in a completely different BPM of reality.",
    "404: `{path}` is experiencing stage fright in front of zero audience members.",
    "`{path}` decided to become a DJ and got lost in the mix.",
    "Looks like `{path}` is playing telephone with our servers — message unclear.",
    "We searched every chord progression — `{path}` resolves to nothing.",
    "404: `{path}` is having a vinyl vs digital identity crisis.",
    "`{path}` went to find its perfect pitch and fell into a black hole."
  ],
  
  apologetic: [
    "We couldn't find `{path}` — sorry about that. Can you tell us what you were trying to do?",
    "`{path}` isn't available. We'll fix this if you give us a hint.",
    "Sorry, but `{path}` seems to have wandered off. Can you help us understand what should be there?",
    "We're really sorry — `{path}` is missing in action. What were you hoping to find?",
    "Our apologies for the inconvenience. `{path}` isn't where it should be. Can you describe what you were looking for?",
    "Sorry about this — `{path}` appears to be unavailable. We'd love to help if you can tell us more.",
    "We're sorry to disappoint, but `{path}` isn't responding. What functionality were you trying to access?",
    "Apologies — `{path}` seems to have taken an unexpected break. Can you share what you were trying to accomplish?",
    "Sorry for the trouble. `{path}` is currently unreachable. What were you hoping to see here?",
    "We apologize for the confusion. `{path}` isn't available right now. Can you help us understand your needs?",
    "Sorry about the dead end — `{path}` isn't loading. What were you trying to find?",
    "Our sincere apologies. `{path}` appears to be missing. Can you tell us what should be here?",
    "We're sorry for the frustration. `{path}` isn't accessible at the moment. What were you looking to do?",
    "Sorry to let you down — `{path}` can't be found. Can you share more details about what you expected?",
    "We apologize for this hiccup. `{path}` isn't responding. What kind of content were you seeking?",
    "Sorry for the inconvenience — `{path}` seems to be offline. Can you help us understand what's missing?",
    "We're sorry this isn't working as expected. `{path}` is unavailable. What were you trying to access?",
    "Apologies for the broken link. `{path}` can't be reached. Can you describe what you were looking for?",
    "Sorry about the confusion — `{path}` isn't there. What functionality did you expect to find?",
    "We sincerely apologize. `{path}` appears to be missing. Can you help us figure out what should be here?",
    "Sorry for the disruption. `{path}` is currently inaccessible. What were you hoping to accomplish?",
    "We're sorry for the trouble — `{path}` isn't loading properly. Can you tell us more about what you need?",
    "Apologies for the dead link. `{path}` can't be found. What type of content were you expecting?",
    "Sorry to disappoint — `{path}` seems to be unavailable. Can you help us understand what's supposed to be there?",
    "We apologize for this error. `{path}` isn't responding. What were you trying to find or do?",
    // MUSICAL APOLOGETIC ADDITIONS
    "Sorry, but `{path}` missed its musical cue and didn't show up. Can you tell us what tune you were trying to play?",
    "We apologize — `{path}` went off-key and disappeared. What song were you hoping to hear?",
    "Sorry about the silence. `{path}` isn't making any sound right now. What melody were you looking for?",
    "Our apologies — `{path}` dropped out of the band and left us hanging. Can you help us understand what's missing from the mix?",
    "Sorry for the discord. `{path}` isn't harmonizing with our servers. What musical experience were you expecting?",
    "We're sorry to strike the wrong note, but `{path}` isn't available. What composition were you trying to access?",
    "Apologies — `{path}` went on an unscheduled intermission. Can you tell us what performance you were hoping to see?",
    "Sorry about the technical difficulties. `{path}` is having microphone problems. What audio experience were you seeking?",
    "We apologize for the static. `{path}` isn't transmitting clearly. Can you help us tune into what you need?",
    "Sorry, but `{path}` is experiencing stage fright and won't perform. What show were you expecting?",
    "Our apologies — `{path}` lost its rhythm and can't find the beat. What tempo were you looking for?",
    "Sorry for the feedback. `{path}` is having amplifier issues. Can you describe the sound you were hoping to hear?",
    "We're sorry to report that `{path}` went flat and needs retuning. What pitch-perfect experience were you after?",
    "Apologies — `{path}` is stuck in a loop pedal and can't break free. What original content were you seeking?",
    "Sorry about the muted response. `{path}` can't find its voice right now. What were you hoping to hear sing?",
    "We apologize for the scratched record. `{path}` keeps skipping. Can you help us understand what track you wanted?",
    "Sorry, but `{path}` is having a creative block and won't compose itself. What masterpiece were you expecting?",
    "Our apologies — `{path}` went backstage and forgot to return for the encore. What finale were you anticipating?",
    "Sorry for the unplugged performance. `{path}` lost its connection to the digital amplifier. What electric experience were you seeking?",
    "We're sorry that `{path}` is playing hard to get — very hard to find, actually. What musical magic were you looking for?"
  ],
  
  investigative: [
    "`{path}` has been requested {count} times. Thanks for flagging — we'll investigate.",
    "This page (`{path}`) looks popular but missing — creating a ticket now.",
    "`{path}` seems to be a frequent target — we're looking into why it's missing.",
    "Interesting pattern: `{path}` has been requested multiple times. Adding to our investigation queue.",
    "Thanks for reporting this. `{path}` appears to be a common request — we're on the case.",
    "`{path}` is generating a lot of 404s. We're investigating the root cause.",
    "Good catch! `{path}` seems to be in demand but missing. Investigating now.",
    "We've noticed `{path}` coming up often in our logs. Time for some detective work.",
    "`{path}` is showing up in our analytics as a frequent miss. Looking into it.",
    "Thanks for bringing this to our attention. `{path}` warrants investigation.",
    "Multiple users have been looking for `{path}`. We're digging deeper.",
    "`{path}` is trending in our 404 reports. Investigation initiated.",
    "Curious case: `{path}` keeps being requested. We're putting our detective hats on.",
    "Pattern detected: `{path}` is a repeat offender. Time to solve this mystery.",
    "`{path}` has been flagged by our monitoring systems. Investigation underway.",
    "Thanks for the report. `{path}` is now on our radar for further analysis.",
    "`{path}` appears to be a phantom URL that many are seeking. We're ghost hunting.",
    "Noted: `{path}` is generating significant interest. Adding to our research list.",
    "`{path}` has caught our analytics team's attention. Investigation in progress.",
    "Good detective work finding `{path}`. We're now investigating why it's missing.",
    "`{path}` seems to be the white whale of our URL structure. We're on the hunt.",
    "Thanks for flagging this. `{path}` deserves a closer look from our team.",
    "`{path}` is showing unusual traffic patterns for a missing page. Investigating.",
    "Multiple reports on `{path}` — we're treating this as a priority investigation.",
    "`{path}` has been added to our digital forensics queue for analysis.",
    // MUSICAL INVESTIGATIVE ADDITIONS
    "`{path}` has been requested {count} times — sounds like a hit single we're missing. Investigating the missing track.",
    "This URL (`{path}`) is getting a lot of requests — like a song stuck in everyone's head. We're hunting for the missing melody.",
    "`{path}` keeps showing up in our logs like a recurring musical theme. Time to investigate this phantom composition.",
    "Interesting pattern: `{path}` seems to be the encore everyone's requesting. Looking into why this performance is missing.",
    "Thanks for flagging this. `{path}` appears to be a chart-topper that's gone missing. We're tracking down the lost hit.",
    "`{path}` is generating a lot of requests — like a viral song we can't find. Investigating the missing audio.",
    "Good catch! `{path}` seems to be in high demand like a concert ticket. Looking into why this show isn't happening.",
    "We've noticed `{path}` harmonizing with our error logs repeatedly. Time for some musical detective work.",
    "`{path}` is showing up in our analytics like a catchy hook. We're investigating this earworm of an error.",
    "Thanks for bringing this to our attention. `{path}` is playing on repeat in our 404 symphony.",
    "Multiple users are searching for `{path}` — sounds like a lost B-side everyone wants. We're digging through the archives.",
    "`{path}` is trending in our error reports like a TikTok sound. Investigation of this viral miss is underway.",
    "Curious case: `{path}` keeps being requested like a song lyric no one can remember. We're solving this musical mystery.",
    "Pattern detected: `{path}` is our most-wanted missing track. Time to crack this case.",
    "`{path}` has been flagged by our monitoring like a copyright claim. Investigation of this phantom recording in progress.",
    "Thanks for the report. `{path}` is now on our playlist for forensic analysis.",
    "`{path}` appears to be the phantom of our digital opera house. We're ghost hunting in the server orchestra pit.",
    "Noted: `{path}` is generating buzz like an unreleased album. Adding to our A&R investigation list.",
    "`{path}` has caught our analytics team's ear. They're investigating this audio anomaly.",
    "Good detective work finding `{path}`. We're now investigating why this concert was cancelled.",
    "`{path}` seems to be the lost chord everyone's trying to play. We're on the hunt for this musical Holy Grail.",
    "Thanks for flagging this missing track. `{path}` deserves a spot in our digital jukebox investigation.",
    "`{path}` is showing unusual request patterns — like a song that everyone hums but no one can name. Investigating.",
    "Multiple reports on `{path}` — we're treating this like a missing person case for URLs. All-points-bulletin issued.",
    "`{path}` has been added to our digital forensics playlist for deep analysis."
  ],
  
  feature_request: [
    "That sounds like a feature we should add — `{path}`. We'll look into it.",
    "Nice idea — `{path}` would be useful. Adding it to our wishlist.",
    "Interesting suggestion! `{path}` could be a great addition to our platform.",
    "Thanks for the idea. `{path}` sounds like something our users would appreciate.",
    "Good thinking — `{path}` would enhance the user experience. We'll consider it.",
    "`{path}` sounds like a valuable feature request. Adding to our product roadmap.",
    "We love the suggestion! `{path}` could be exactly what we need.",
    "Thanks for proposing `{path}` — it has potential. We'll evaluate it.",
    "Great idea! `{path}` would be a nice enhancement. Noted for future development.",
    "`{path}` seems like it would solve a real user need. We'll investigate building it.",
    "Interesting concept — `{path}` could be a game-changer. Adding to our innovation list.",
    "We appreciate the suggestion. `{path}` might be the missing piece we need.",
    "Good insight! `{path}` could improve our offering significantly.",
    "Thanks for thinking outside the box. `{path}` is now on our consideration list.",
    "`{path}` sounds like it could fill a gap in our current features.",
    "We're intrigued by your idea for `{path}`. It's going into our feature pipeline.",
    "That's a thoughtful suggestion — `{path}` could benefit many users.",
    "Thanks for the creative input. `{path}` has been added to our development wishlist.",
    "`{path}` could be the feature we didn't know we needed. We'll explore it.",
    "Great suggestion! `{path}` aligns well with our product vision.",
    "We're excited about the possibility of `{path}`. Thanks for the inspiration.",
    "`{path}` sounds like it could enhance user productivity. We'll investigate.",
    "Interesting idea — `{path}` might be exactly what our community is looking for.",
    "Thanks for the feature request. `{path}` has been logged for consideration.",
    "`{path}` could be a valuable addition to our toolkit. We'll prioritize evaluation.",
    // MUSICAL FEATURE REQUEST ADDITIONS
    "That sounds like a hit single we should record — `{path}`. We'll add it to our studio session list.",
    "Nice composition idea — `{path}` would be a great addition to our musical repertoire.",
    "Interesting musical suggestion! `{path}` could be the perfect track for our next album.",
    "Thanks for the creative input. `{path}` sounds like a song our audience would love to hear on repeat.",
    "Good thinking — `{path}` would make our platform sing better. We'll tune into this idea.",
    "`{path}` sounds like a chart-topping feature request. Adding it to our greatest hits roadmap.",
    "We love the musical direction! `{path}` could be exactly the melody our users are humming for.",
    "Thanks for composing this idea. `{path}` has potential to become a classic feature.",
    "Great remix suggestion! `{path}` would be a nice enhancement to our current playlist.",
    "`{path}` seems like it would hit all the right notes for user experience. We'll orchestrate its development.",
    "Interesting concept — `{path}` could be the crescendo our platform needs. Adding to our symphony of innovations.",
    "We appreciate the musical suggestion. `{path}` might be the missing harmony in our feature ensemble.",
    "Good improvisation! `{path}` could jazz up our offering significantly.",
    "Thanks for thinking in musical terms. `{path}` is now on our setlist for consideration.",
    "`{path}` sounds like it could fill the silence in our current feature composition.",
    "We're intrigued by your musical idea for `{path}`. It's going into our recording pipeline.",
    "That's a melodious suggestion — `{path}` could create beautiful music for many users.",
    "Thanks for the lyrical input. `{path}` has been added to our songbook of development ideas.",
    "`{path}` could be the anthem we didn't know our platform needed. We'll compose it.",
    "Great suggestion! `{path}` harmonizes well with our product vision.",
    "We're excited about the possibility of `{path}` joining our orchestra. Thanks for the musical inspiration.",
    "`{path}` sounds like it could amplify user productivity. We'll plug into this idea.",
    "Interesting musical idea — `{path}` might be exactly the sound our community is vibing with.",
    "Thanks for the feature request duet. `{path}` has been recorded for consideration.",
    "`{path}` could be a valuable addition to our digital instrument collection. We'll prioritize learning this new piece.",
    "That sounds like a symphony we should conduct — `{path}`. Adding it to our concert schedule.",
    "Nice musical arrangement idea — `{path}` would make our platform more harmonious.",
    "Thanks for the beat suggestion. `{path}` could be the rhythm our users are missing.",
    "`{path}` sounds like a remix that would get everyone dancing. We'll spin it into development.",
    "Good acoustic thinking — `{path}` would make our digital sound more authentic."
  ],
  
  suggest_fix: [
    "Did you mean `{closest}`? We couldn't find `{path}`.",
    "Try `{closest}` instead of `{path}` — that might work.",
    "Looks like you might be looking for `{closest}` rather than `{path}`.",
    "Perhaps you meant `{closest}`? `{path}` doesn't exist, but that does.",
    "Close! Try `{closest}` — it's similar to `{path}` but actually works.",
    "We couldn't find `{path}`, but `{closest}` might be what you're after.",
    "Almost there! `{closest}` exists, while `{path}` doesn't.",
    "Did you intend to visit `{closest}`? It's close to `{path}` but functional.",
    "Try navigating to `{closest}` instead — `{path}` isn't available.",
    "`{path}` doesn't exist, but `{closest}` might be what you need.",
    "We think you meant `{closest}` rather than `{path}`.",
    "Close guess! `{closest}` works, but `{path}` doesn't.",
    "Perhaps there's a typo? Try `{closest}` instead of `{path}`.",
    "We couldn't locate `{path}`, but `{closest}` is available and similar.",
    "`{closest}` might be what you're looking for — `{path}` isn't found.",
    "Almost! `{closest}` exists and might serve your needs better than `{path}`.",
    "Try `{closest}` — it's the closest match to `{path}` that actually works.",
    "We suggest `{closest}` as an alternative to `{path}`.",
    "`{path}` isn't available, but `{closest}` might do the trick.",
    "Consider trying `{closest}` instead of `{path}` — it's functional and similar.",
    "We couldn't find `{path}`, but `{closest}` is right there waiting for you.",
    "Oops! Try `{closest}` — it's like `{path}` but actually exists.",
    "Almost hit the right note! `{closest}` works, while `{path}` doesn't.",
    "We think you're looking for `{closest}` rather than `{path}`.",
    "Try the working alternative: `{closest}` instead of `{path}`.",
    // MUSICAL SUGGEST FIX ADDITIONS
    "Did you mean to play `{closest}`? We couldn't find the `{path}` track.",
    "Try tuning to `{closest}` instead of `{path}` — that frequency actually broadcasts.",
    "Looks like you might be looking for the `{closest}` song rather than `{path}`.",
    "Perhaps you meant to request `{closest}`? The `{path}` record doesn't exist in our collection.",
    "Close harmony! Try `{closest}` — it's similar to `{path}` but actually plays.",
    "We couldn't find `{path}` in our playlist, but `{closest}` might be the melody you're after.",
    "Almost hit the right chord! `{closest}` exists in our songbook, while `{path}` doesn't.",
    "Did you intend to listen to `{closest}`? It's close to `{path}` but actually has sound.",
    "Try playing `{closest}` instead — the `{path}` track isn't in our music library.",
    "The `{path}` song doesn't exist, but `{closest}` might be the tune you need.",
    "We think you meant to queue up `{closest}` rather than `{path}`.",
    "Close note! `{closest}` plays beautifully, but `{path}` is silent.",
    "Perhaps there's a mix-up in your playlist? Try `{closest}` instead of `{path}`.",
    "We couldn't locate `{path}` in our discography, but `{closest}` is available and sounds similar.",
    "`{closest}` might be the song you're humming — `{path}` isn't in our catalog.",
    "Almost found your rhythm! `{closest}` exists and might groove better than `{path}`.",
    "Try `{closest}` — it's the closest musical match to `{path}` that actually performs.",
    "We suggest `{closest}` as a harmonious alternative to `{path}`.",
    "The `{path}` performance isn't available, but `{closest}` might hit the right notes.",
    "Consider trying `{closest}` instead of `{path}` — it's functional and sounds similar.",
    "We couldn't find `{path}` on our setlist, but `{closest}` is ready for an encore.",
    "Oops! Try `{closest}` — it's like `{path}` but actually makes music.",
    "Almost hit the right tempo! `{closest}` works, while `{path}` doesn't have a beat.",
    "We think you're looking for the `{closest}` composition rather than `{path}`.",
    "Try the working track: `{closest}` instead of `{path}`.",
    "Did you mean to sample `{closest}`? We couldn't find the `{path}` audio file.",
    "Try mixing `{closest}` instead of `{path}` — that track actually exists in our studio.",
    "Looks like you're searching for `{closest}` rather than `{path}` — check the liner notes.",
    "Perhaps you meant to stream `{closest}`? The `{path}` single was never released.",
    "Close listening! Try `{closest}` — it resonates, while `{path}` is just white noise.",
    "We couldn't find `{path}` on any album, but `{closest}` might be the B-side you want.",
    "Almost found your jam! `{closest}` is available for download, while `{path}` is not.",
    "Did you intend to bookmark `{closest}`? It's close to `{path}` but actually streams.",
    "Try accessing `{closest}` instead — the `{path}` concert was cancelled.",
    "The `{path}` remix doesn't exist, but `{closest}` might be the version you remember.",
    "We think you meant to cue `{closest}` rather than the phantom `{path}`.",
    "Close call! `{closest}` is a real crowd-pleaser, but `{path}` never made it to vinyl.",
    "Perhaps there's static in your request? Try `{closest}` instead of `{path}`.",
    "We couldn't locate `{path}` in any genre, but `{closest}` is chart-ready and similar.",
    "`{closest}` might be the earworm you're thinking of — `{path}` was never recorded.",
    "Almost nailed the solo! `{closest}` performs live, while `{path}` is just a sound check.",
    "Try `{closest}` — it's the closest acoustic match to `{path}` that actually amplifies.",
    "We suggest `{closest}` as a melodic alternative to the missing `{path}`.",
    "The `{path}` tour isn't happening, but `{closest}` might give you the same concert experience.",
    "Consider trying `{closest}` instead of `{path}` — it's mastered and ready to play.",
    "We couldn't find `{path}` in our digital collection, but `{closest}` is spinning right now.",
    "Oops! Try `{closest}` — it's like `{path}` but actually made it past the demo stage.",
    "Almost found the right frequency! `{closest}` broadcasts clearly, while `{path}` is just static.",
    "We think you're looking for the `{closest}` session rather than `{path}`.",
    "Try the released version: `{closest}` instead of the unreleased `{path}`.",
    "Did you mean to request `{closest}`? We couldn't find `{path}` in our rotation.",
    "Try drumming up `{closest}` instead of `{path}` — that beat actually drops.",
    "Looks like you might be humming `{closest}` rather than `{path}`.",
    "Perhaps you meant to groove to `{closest}`? The `{path}` rhythm section never showed up.",
    "Close harmony! Try `{closest}` — it's in tune, while `{path}` is flat.",
    "We couldn't find `{path}` in our symphony, but `{closest}` might be the movement you're after.",
    "Almost hit the bridge! `{closest}` connects, while `{path}` leads nowhere.",
    "Did you intend to loop `{closest}`? It's close to `{path}` but actually repeats.",
    "Try vibing to `{closest}` instead — the `{path}` mood never set in.",
    "The `{path}` acoustic version doesn't exist, but `{closest}` might be the unplugged sound you want.",
    "We think you meant to shuffle to `{closest}` rather than `{path}`.",
    "Close remix! `{closest}` drops the bass, but `{path}` never had a sound.",
    "Perhaps there's feedback in your search? Try `{closest}` instead of `{path}`.",
    "We couldn't locate `{path}` in our sample library, but `{closest}` is cleared and ready.",
    "`{closest}` might be the hook you're thinking of — `{path}` never caught on.",
    "Almost found your anthem! `{closest}` rallies the crowd, while `{path}` is just silence.",
    "Try `{closest}` — it's the closest vocal match to `{path}` that actually sings.",
    "We suggest `{closest}` as a rhythmic alternative to `{path}`.",
    "The `{path}` album never dropped, but `{closest}` might give you the same vibes.",
    "Consider trying `{closest}` instead of `{path}` — it's produced and ready to stream.",
    "We couldn't find `{path}` on any label, but `{closest}` is signed and available.",
    "Oops! Try `{closest}` — it's like `{path}` but actually made it to the chorus.",
    "Almost found the right pitch! `{closest}` harmonizes perfectly, while `{path}` is off-key.",
    "We think you're looking for the `{closest}` instrumental rather than `{path}`.",
    "Try the mastered track: `{closest}` instead of the rough cut `{path}`."
  ]
};

function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i-1][j] + 1,
        dp[i][j-1] + 1,
        dp[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

const knownRoutes = [
  '/', 
  '/admin',
  '/login',
  '/signup',
  '/auth',
  '/verification-waiting',
  '/terms',
  '/privacy',
  '/unauthorized',
  '/auth/callback',
  '/videos',
  '/videos/:id',
  '/resources',
  '/resources/:id',
  '/search',
  '/discover',
  '/library',
  '/community',
  '/tracks',
  '/music-showcase',
  '/player',
  '/learning-hub',
  '/learning-hub/:id',
  '/learning-module/:id',
  '/artist/:slug',
  '/notifications',
  '/follow-us',
  '/contact-us',
  '/support-us',
  '/settings',
  '/profile',
  '/services',
  '/payment',
  '/payment-success',
  '/subscriptions',
  '/music-tools',
  '/artists',
  '/learning-hub/:moduleId',
  '/bookings',
  '/book/:id',
  '/book-tutor',
  '/user-details',
  '/coming-soon',
  '/tracks/:slug',
  '/audio-player/:id',
  '*'
];

function findClosestRoute(path: string, confidenceLevel: 'high' | 'medium' | 'low' = 'medium'): { route: string, distance: number } | null {
  let bestMatch = null;
  let bestDistance = Infinity;

  for (const route of knownRoutes) {
    const cleanRoute = route.replace(/:[^/]+/g, '');
    const cleanPath = path.replace(/\/$/, '');
    
    const distance = levenshtein(cleanPath, cleanRoute);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = route;
    }
  }

  let threshold;
  switch(confidenceLevel) {
    case 'high':
      threshold = 1;
      break;
    case 'medium':
      threshold = 2;
      break;
    case 'low':
      threshold = 3;
      break;
    default:
      threshold = 2;
  }

  if (bestMatch && bestDistance <= threshold) {
    return { route: bestMatch, distance: bestDistance };
  }

  return null;
}

export const handle404 = async (path: string, search: string, referrer: string, userAgent: string) => {
  try {
    const now = new Date().toISOString();
    const { data: existing, error: selectError } = await supabase
      .from('page_404s')
      .select('id, count, referrers, user_agents')
      .eq('path', path)
      .maybeSingle();

    if (selectError) throw selectError;

    let count = 1;
    if (existing) {
      count = (existing.count || 0) + 1;
      const referrers = Array.from(new Set([...(existing.referrers || []), referrer]));
      const user_agents = Array.from(new Set([...(existing.user_agents || []), userAgent]));

      const { error: updateError } = await supabase
        .from('page_404s')
        .update({
          count,
          last_seen: now,
          referrers,
          user_agents,
          query_params: search || null,
        })
        .eq('id', existing.id);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from('page_404s')
        .insert({
          path,
          first_seen: now,
          last_seen: now,
          count: 1,
          referrers: referrer ? [referrer] : [],
          user_agents: userAgent ? [userAgent] : [],
          query_params: search || null,
        });

      if (insertError) throw insertError;
    }

    const confidenceLevels = ['high', 'medium', 'low'] as const;
    let closestMatch = null;

    for (const level of confidenceLevels) {
      closestMatch = findClosestRoute(path, level);
      if (closestMatch) break;
    }

    let looksLikeTypo = false;
    let bestMatch = '';

    if (closestMatch) {
      looksLikeTypo = true;
      bestMatch = closestMatch.route;
    }

    const hasQuery = !!search;
    const isFrequent = count > 10;
    const externalReferrer = referrer && !referrer.includes(window.location.hostname);

    let bucket: keyof typeof VARIANTS = 'playful';
    if (looksLikeTypo) {
      bucket = 'suggest_fix';
    } else if (isFrequent) {
      bucket = 'investigative';
    } else if (hasQuery) {
      bucket = 'apologetic';
    } else if (path.includes('feature') || path.includes('suggest')) {
      bucket = 'feature_request';
    } else if (externalReferrer) {
      bucket = 'playful';
    }

    const variants = VARIANTS[bucket];
    const rawMessage = variants[Math.floor(Math.random() * variants.length)];
    const message = rawMessage
      .replace(/{path}/g, path)
      .replace(/{count}/g, String(count))
      .replace(/{bestMatch}/g, bestMatch);

    return { message, bucket, count, bestMatch: looksLikeTypo ? bestMatch : null };
  } catch (error) {
    console.error('Error in 404 handler:', error);
    return { 
      message: `We couldn't find the page ${path}. It might have been moved or deleted.`, 
      bucket: 'apologetic', 
      count: 0,
      bestMatch: null
    };
  }
};
