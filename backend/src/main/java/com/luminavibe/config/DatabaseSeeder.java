package com.luminavibe.config;

import com.luminavibe.entities.*;
import com.luminavibe.repositories.CommentRepository;
import com.luminavibe.repositories.LikeRepository;
import com.luminavibe.repositories.PostRepository;
import com.luminavibe.repositories.StoryRepository;
import com.luminavibe.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;

@Component
public class DatabaseSeeder implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        try {
            logger.info("Initializing LuminaVibe real community creators & posts...");
            Map<String, User> creatorMap = seedCreators();
            seedPosts(creatorMap);
            seedStories(creatorMap);
            logger.info("LuminaVibe community seeding completed successfully.");
        } catch (Exception e) {
            logger.warn("Database seeding skipped or encountered non-critical error: {}", e.getMessage(), e);
        }
    }

    private Map<String, User> seedCreators() {
        Map<String, User> creators = new HashMap<>();

        // 14 Real Creator Profiles across diverse creative disciplines
        String[][] usersData = {
            {"aria_tech", "Aria Vance", "aria_tech@lumina.dev", "AI & Neural Graphics Engineer 💻✨ Building real-time ambient computing. SF", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80"},
            {"kaito_visuals", "Kaito Tanaka", "kaito_visuals@lumina.dev", "Tokyo Cyberpunk & Street Lens 📸 Midnight neon, shadows, Leica M11 shooter 🏮", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80"},
            {"elena_wellness", "Elena Rostova", "elena_wellness@lumina.dev", "Holistic Health & Biohacking 🧘‍♀️ Cold plunge, spine mobility, somatic breathwork 🌿", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80"},
            {"marcus_film", "Marcus Sterling", "marcus_film@lumina.dev", "Documentary Director & FPV Pilot 🎬 Glaciers, volcanoes, anamorphic lenses 🏔️", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80"},
            {"sophia_brews", "Sophia Chen", "sophia_brews@lumina.dev", "Specialty Coffee Chemist & Roaster ☕🔬 Geisha fermentations & V60 science ✨", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=250&auto=format&fit=crop&q=80"},
            {"leobrooks_dev", "Leo Brooks", "leobrooks_dev@lumina.dev", "Indie Game Dev & Pixel Alchemist 👾🕹️ Custom HLSL shaders & synth vibes 🚀", "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&auto=format&fit=crop&q=80"},
            {"amara_sound", "Amara Okafor", "amara_sound@lumina.dev", "Modular Synth Artist & Sound Designer 🎹 Tape saturation & atmospheric lo-fi 🎧", "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=250&auto=format&fit=crop&q=80"},
            {"zaranovak_design", "Zara Novak", "zaranovak_design@lumina.dev", "3D Spatial Architect & Parametric Designer 🏛️📐 Biophilic urban living 🌿💡", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80"},
            {"maya_culinary", "Maya Patel", "maya_culinary@lumina.dev", "Plant-Based Molecular Gastronomy 🥑🌿 Textures, fermentation & botanical plating 🍽️", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&auto=format&fit=crop&q=80"},
            {"diego_surfs", "Diego Morales", "diego_surfs@lumina.dev", "Ocean Conservationist & Big Wave Surfer 🏄‍♂️🌊 Coral reef restoration & marine biology 🐠", "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=250&auto=format&fit=crop&q=80"},
            {"chloe_fashion", "Chloe Dubois", "chloe_fashion@lumina.dev", "Sustainable Haute Couture 🪡✨ Circular textile design & vintage reconstruction 👗", "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=250&auto=format&fit=crop&q=80"},
            {"tariq_astro", "Dr. Tariq Al-Mansoor", "tariq_astro@lumina.dev", "Astrophysicist & Deep-Sky Imager 🔭✨ Nebula spectra & exoplanet photography 🌌", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&auto=format&fit=crop&q=80"},
            {"ananya_clay", "Ananya Sharma", "ananya_clay@lumina.dev", "Studio Ceramicist & Wabi-Sabi Potter 🏺 Wood-fired kilns & natural ash glazes 🌿", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80"},
            {"liam_acoustic", "Liam O'Connor", "liam_acoustic@lumina.dev", "Luthier & Handcrafted Instrument Maker 🎸 Sitka spruce, acoustic tonewoods & Celtic folk 🎶", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=250&auto=format&fit=crop&q=80"}
        };

        String defaultEncodedPass = passwordEncoder.encode("Lumina@2026");

        for (String[] row : usersData) {
            String username = row[0];
            String fullName = row[1];
            String email = row[2];
            String bio = row[3];
            String avatar = row[4];

            User user = userRepository.findByUsername(username).orElse(null);
            if (user == null) {
                user = userRepository.findByEmail(email).orElse(null);
            }

            if (user == null) {
                user = new User();
                user.setUsername(username);
                user.setFullName(fullName);
                user.setEmail(email);
                user.setPassword(defaultEncodedPass);
                user.setBio(bio);
                user.setProfilePictureUrl(avatar);
                user.setIsVerified(true);
                user.setIsPrivate(false);
                user.setProfileViews(145);
                user = userRepository.save(user);
                logger.info("Created real user: @{}", username);
            }
            creators.put(username, user);
        }

        return creators;
    }

    private void seedPosts(Map<String, User> creators) {
        if (postRepository.count() >= 15) {
            logger.info("Database already contains {} posts. Skipping post seeding.", postRepository.count());
            return;
        }

        logger.info("Seeding 18 real posts with real likes and comments...");

        Object[][] postsData = {
            {
                "aria_tech",
                "San Francisco, CA 🌉",
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1080&auto=format&fit=crop&q=80",
                "5 AI engineering tools that fundamentally upgraded my dev velocity this month 🧠⚡\n\n1. Local quantized models with zero API latency for boilerplate\n2. AST-aware code navigation agents\n3. Automatic edge test-case generation\n4. Real-time shader & UI live-reloading\n5. Neural documentation indexing that actually cites file lines!\n\nThe biggest gamechanger? Writing architecture RFCs with an AI sounding board before touching a single line of production code. It exposes edge cases 10x faster.\n\nWhat's your highest ROI tool right now? Drop it below 👇\n\n#SoftwareEngineering #AITools #DevLife #Coding #BuildInPublic",
                new String[]{"leobrooks_dev", "The AST code chunking tip from your story saved us hours on our shaders build! 🔥", "aria_tech", "So pumped to hear that Leo! Keep crushing the game engine 🚀"},
                new String[]{"kaito_visuals", "marcus_film", "zaranovak_design"}
            },
            {
                "kaito_visuals",
                "Shinjuku, Tokyo 🇯🇵",
                "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1080&auto=format&fit=crop&q=80",
                "Tokyo midnight rain hits different through an f/1.4 prime lens 🌧️🏮\n\nWhenever tourists ask what camera gear to bring for street photography, my answer is always the same: forget the giant telephoto zoom lens. Bring a fast, weather-sealed 35mm prime and comfortable waterproof boots.\n\nThe real secret? Wait for a pedestrian with a clear umbrella to cross right under a magenta and turquoise neon sign. Reflections do 90% of the work.\n\nSwipe through the stories for raw aperture & ISO breakdown! 📸\n\n#Tokyo #StreetPhotography #Cyberpunk #NightPhotography #Leica #Shinjuku",
                new String[]{"marcus_film", "That color separation between the neon red and wet asphalt is perfection Kaito! 🎬", "kaito_visuals", "Thanks Marcus! Polarizer cut the street glare just right."},
                new String[]{"sophia_brews", "aria_tech", "diego_surfs"}
            },
            {
                "elena_wellness",
                "Zurich, Switzerland 🇨🇭",
                "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1080&auto=format&fit=crop&q=80",
                "The 4-Minute Morning Mobility Flow (Save this for tomorrow morning 📌)\n\nIf you sit at a laptop for more than 6 hours a day, your hip flexors lock up and your thoracic spine rounds. Try this sequence right before checking emails:\n\n🧘‍♀️ 1. 90/90 Hip Swivels (6 reps each side)\n🌿 2. Cat-Cow with thoracic lateral reach (8 reps)\n☀️ 3. Deep goblet squat hold with prayer elbows (45 seconds)\n🫁 4. Three 4-4-4-4 box breaths with nose inhales\n\nConsistency over intensity. Your posture will thank you by 3 PM! ✨\n\n#Mobility #Wellness #MorningRoutine #Biohacking #YogaPractice #HealthSpan",
                new String[]{"aria_tech", "Did this between PR reviews and my neck stiffness literally vanished. Thank you Elena! 🙏", "elena_wellness", "Glad it helped Aria! Consistency is key."},
                new String[]{"maya_culinary", "sophia_brews"}
            },
            {
                "marcus_film",
                "Highlands, Iceland 🇮🇸",
                "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1080&auto=format&fit=crop&q=80",
                "Braided glacial rivers from 500ft in the Icelandic interior 🏔️🚁\n\nThis isn't an abstract painting. It's glacial meltwater filtering through volcanic silt and black basalt sand. Depending on the mineral composition and sun angle, the water shifts from milky turquoise to dark cobalt within meters.\n\nFilmed in 10-bit D-Log with a circular polarizer. Nature is the ultimate art director.\n\nDrop a 🌋 if you'd travel to Iceland!\n\n#Iceland #DroneFilm #AerialCinematography #Filmmaking #LandscapePhotography #EarthPix",
                new String[]{"diego_surfs", "The earth textures from above look completely alien. What drone setup did you fly? 🌊", "marcus_film", "Inspire 3 with the 24mm cinema prime! Handles 30 knot gusts smoothly."},
                new String[]{"kaito_visuals", "tariq_astro", "chloe_fashion"}
            },
            {
                "sophia_brews",
                "Fitzroy, Melbourne 🇦🇺",
                "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1080&auto=format&fit=crop&q=80",
                "Why water chemistry matters more than your coffee bean brand ☕🔬\n\nMost people blame their grinder or brewing technique when their coffee tastes flat or overly bitter. But coffee is 98.5% water!\n\nKey parameters for peak extraction:\n💧 Magnesium: Binds with oxygen-rich floral compounds\n💧 Calcium: Accentuates body and sweetness\n💧 Bicarbonate: Buffers acidity (too much = soapy, too little = sour lemon)\n💧 Brewing Temp: 91–93°C for light roasts, 88°C for natural fermentations\n\nWhen dialed in, this washed Ethiopian Yirgacheffe literally tastes like fresh bergamot and jasmine tea 🌸\n\nWhat's your go-to morning brew method? Pour-over, espresso, or French press? 👇\n\n#SpecialtyCoffee #BaristaLife #PourOver #CoffeeScience #MelbourneCoffee #V60",
                new String[]{"amara_sound", "Pour-over every single morning before the studio session starts. That water chemistry breakdown blew my mind 🤯", "sophia_brews", "Remineralizing distilled water is a rabbit hole worth exploring!"},
                new String[]{"maya_culinary", "liam_acoustic", "aria_tech"}
            },
            {
                "leobrooks_dev",
                "Austin, Texas 🇺🇸",
                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1080&auto=format&fit=crop&q=80",
                "Retro aesthetic meets modern 144 FPS game architecture 👾🕹️\n\nWe spent the past 3 days tuning our CRT post-processing pass. Here's what makes nostalgic pixels feel cinematic instead of muddy:\n\n✨ Subtle phosphor persistence (simulating CRT phosphors fading)\n📺 Soft barrel curvature at the viewport edges\n⚡ Micro chromatic aberration that intensifies on screen-shake impacts\n💥 High dynamic range bloom on weapon muzzle flashes\n\nWhen old-school soul meets 2026 responsiveness, magic happens. Beta testing opens next Friday!\n\n#IndieGame #GameDev #PixelArt #RetroGaming #Shaders #Unity3D #UnrealEngine",
                new String[]{"aria_tech", "Signed up for the closed alpha! The glow aesthetics on the boss shields look phenomenal 🔥", "leobrooks_dev", "Key sent to your inbox Aria!"},
                new String[]{"kaito_visuals", "amara_sound"}
            },
            {
                "amara_sound",
                "Lagos, Nigeria 🇳🇬",
                "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1080&auto=format&fit=crop&q=80",
                "Analog cables everywhere, tea brewing, and 2 AM synth frequencies 🎹🎧\n\nThere's something deeply meditative about patching modular hardware. There is no 'Ctrl + Z'. If you dial an oscillation wrong, you lean into the imperfection and find a brand new groove.\n\nCurrently printing this polyrhythmic African drum groove through a vintage Roland tape echo. The warmth is undeniable.\n\nTurn up your headphones and catch the full session preview in my stories! 🎶\n\n#MusicProducer #ModularSynth #Eurorack #LoFiBeats #SoundDesign #StudioLife",
                new String[]{"liam_acoustic", "Tape saturation pairs so beautifully with wooden acoustic resonance. Love this groove! 🎸", "amara_sound", "Let's collaborate on an acoustic-synth track Liam!"},
                new String[]{"sophia_brews", "zaranovak_design"}
            },
            {
                "zaranovak_design",
                "Berlin, Germany 🇩🇪",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080&auto=format&fit=crop&q=80",
                "The Biophilic Pavilion: Merging curved architectural glass with living flora 🌿🏛️\n\nModern urban design doesn't have to mean sterile concrete and cold steel. In our newest pavilion concept:\n\n📐 100% passive solar heating using seasonal azimuth angles\n🌱 Integrated hydroponic living walls that clean ambient indoor air\n🪵 Structural cross-laminated timber sourced from regenerative forests\n💡 Diffused circadian LED spectrums mimicking natural twilight\n\nSpaces shape how we feel, think, and breathe. Would you live in a bio-glass home? 💬\n\n#Architecture #Minimalism #InteriorDesign #BiophilicDesign #SustainableDesign #BerlinArt",
                new String[]{"elena_wellness", "The psychological impact of circadian lighting and living plants is backed by so much neuroscience! Stunning work Zara 👏", null, null},
                new String[]{"marcus_film", "ananya_clay"}
            },
            {
                "maya_culinary",
                "London, UK 🇬🇧",
                "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1080&auto=format&fit=crop&q=80",
                "Botanical gastronomy: Fermented heirloom carrot ribbons with pine oil and smoked cashew velouté 🥑🍽️\n\nFine dining without cruelty or environmental destruction is where modern culinary craft is heading.\n\nTechniques used:\n🥕 Lacto-fermentation at 2.5% salinity for 14 days\n🌲 Foraged Scots pine needle cold-infusion\n🌰 Stone-milled cultured cashew milk emulsified with white truffle reduction\n\nFood is connection, memory, and biology combined on a single ceramic plate.\n\n#PlantBased #MolecularGastronomy #VeganChef #Fermentation #FoodArt #MichelinGreen",
                new String[]{"sophia_brews", "The flavor pairing of pine needle oil and fermented root vegetables sounds divine Maya! 🌿", "maya_culinary", "Next time you visit London we're having an 8-course tasting menu Sophia!"},
                new String[]{"elena_wellness", "ananya_clay"}
            },
            {
                "diego_surfs",
                "Uluwatu, Bali 🇮🇩",
                "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1080&auto=format&fit=crop&q=80",
                "Dawn patrol at the reef break: 6-foot offshore barrels and zero crowds 🏄‍♂️🌊\n\nBefore paddling out, our crew collected 14 kg of marine plastic from the shoreline. True ocean stewardship means giving back more than you take.\n\nProtect the reefs, respect the local fishermen, and never take a clean swell for granted.\n\nSee you in the lineup! 🤙\n\n#Surfing #OceanConservation #Bali #CleanSeas #WavePhotography #ReefRestoration",
                new String[]{"marcus_film", "That barrel shot is gold Diego! Respect for the beach cleanup initiative 🌊", null, null},
                new String[]{"kaito_visuals", "liam_acoustic"}
            },
            {
                "chloe_fashion",
                "Paris, France 🇫🇷",
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1080&auto=format&fit=crop&q=80",
                "Deconstructed & Reborn: Haute Couture crafted from 1980s deadstock parachute silk 🪡✨\n\nFast fashion produces 92 million tons of textile waste annually. But when you treat discarded fabric as historical artifact rather than garbage, the design language becomes infinitely richer.\n\nEvery seam in this trench coat tells a story of survival and transformation.\n\nSustainable luxury is not a compromise — it is the future of fashion. 🧵\n\n#SustainableFashion #HauteCouture #UpcycledFashion #ParisFashion #CircularEconomy",
                new String[]{"zaranovak_design", "The drape and structural geometry on the shoulders is magnificent Chloe! 📐", null, null},
                new String[]{"aria_tech", "maya_culinary"}
            },
            {
                "tariq_astro",
                "Atacama Desert, Chile 🇨🇱",
                "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1080&auto=format&fit=crop&q=80",
                "The Carina Nebula in Narrowband Sulfur, Hydrogen & Oxygen (SHO Hubble Palette) 🔭🌌\n\nCaptured across 4 nights under the driest, clearest skies on Earth at 2,400m altitude.\n\nExposure details:\n✨ 18 hours total integration time (6h Ha, 6h OIII, 6h SII)\n🔭 250mm f/3.8 Riccardi-Honders Astrograph\n❄️ Cooled CCD sensor held at -25°C to eliminate thermal noise\n\nEvery glowing pillar in this frame is a stellar nursery creating thousands of infant stars 7,500 light-years away. We are literally stardust studying stars.\n\n#Astrophotography #Nebula #SpaceArt #Atacama #HubblePalette #Cosmos",
                new String[]{"marcus_film", "18 hours of integration paid off Dr. Tariq! The dark dust lanes look 3-dimensional 🌌", null, null},
                new String[]{"kaito_visuals", "aria_tech", "sophia_brews"}
            },
            {
                "ananya_clay",
                "Kyoto Studio, Japan 🇯🇵",
                "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1080&auto=format&fit=crop&q=80",
                "Embracing Wabi-Sabi: The 72-hour Anagama wood kiln firing 🏺🔥\n\nIn modern manufacturing, every ceramic cup is identical, flawless, and lifeless. In a traditional wood kiln, natural wood ash melts into the clay at 1300°C, painting unpredictable patterns of flame and smoke.\n\nNo glaze was applied to this vase. What you see is pure fire, earth, and patience.\n\nThe crack in the rim was repaired with 24k Japanese gold lacquer (Kintsugi). Imperfection is where beauty lives.\n\n#Ceramics #Pottery #WabiSabi #Kintsugi #KyotoCraft #HandmadeWithLove",
                new String[]{"maya_culinary", "Serving botanical dishes on your handmade ceramics would be a dream Ananya! 🌿", "ananya_clay", "I would be honored Maya! Let me pack a custom set for London."},
                new String[]{"sophia_brews", "elena_wellness"}
            },
            {
                "liam_acoustic",
                "Galway, Ireland 🇮🇪",
                "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1080&auto=format&fit=crop&q=80",
                "Tuning the soundboard: Tap-testing master-grade Irish bog oak & Alpine spruce 🎸🪵\n\nBefore gluing the braces onto an acoustic guitar top, you hold the wood to your ear and tap it with your knuckle. A great soundboard will ring like a church bell for 4 to 5 seconds with rich harmonic overtones.\n\nThis specific bog oak was pulled from a peat bog where it lay preserved for over 3,000 years. The carbon density gives it an astonishingly warm, cello-like bass response.\n\nInstruments are living wood given a second voice 🎶\n\n#Luthier #GuitarMaking #AcousticGuitar #Woodworking #IrishFolk #Craftsmanship",
                new String[]{"amara_sound", "3,000 year old bog oak! You can literally hear the history in that instrument Liam 🎧", "liam_acoustic", "Will record some raw acoustic stems for your modular synths this weekend Amara!"},
                new String[]{"marcus_film", "diego_surfs"}
            },
            {
                "aria_tech",
                "Silicon Valley, CA 💻",
                "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1080&auto=format&fit=crop&q=80",
                "Late night engineering epiphany: Simple code > Clever code, always. 💡\n\nSix months ago I wrote a 'genius' generic abstraction with 4 layers of meta-programming to save 15 lines of duplicate code. Tonight I spent 2 hours debugging it during an incident.\n\nRule of thumb for 2026:\nIf a junior engineer can't grasp the control flow in under 2 minutes, don't ship it. Readable code is maintainable code.\n\nWho else learned this the hard way? 😅👇\n\n#CodingWisdom #CleanCode #SoftwareArchitecture #DevCommunity #ProgrammingHumor",
                new String[]{"leobrooks_dev", "Every game dev has written a 'universal entity component framework' only to rewrite it 3 weeks later 😂 100% agreed!", null, null},
                new String[]{"kaito_visuals", "zaranovak_design"}
            },
            {
                "kaito_visuals",
                "Akihabara, Tokyo 🇯🇵",
                "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1080&auto=format&fit=crop&q=80",
                "Golden hour light slicing across the Yamanote line tracks 🌇📸\n\nMost photographers pack their gear once the sun dips below tall skyscrapers. But the 15 minutes right after sunset is when urban shadows become long, soft, and electric.\n\nTip: Expose for the highlights on the metallic train roofs, let the surrounding buildings silhouette against the warm sky.\n\nTokyo never runs out of angles 🏮\n\n#TokyoStreet #GoldenHour #UrbanPhotography #JapanTravel #VisualArt",
                new String[]{"marcus_film", "That silhouette framing is masterclass level Kaito 🙌", null, null},
                new String[]{"diego_surfs", "aria_tech"}
            },
            {
                "elena_wellness",
                "Zurich Lake 🇨🇭",
                "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=1080&auto=format&fit=crop&q=80",
                "Ceremonial Matcha vs. Coffee for Cortisol Regulation 🍵✨\n\nWhy so many biohackers are swapping their afternoon espresso for stone-ground Uji matcha:\n\n🌿 L-Theanine Synergy: Matcha contains high concentrations of L-Theanine, relaxing alpha brainwaves without drowsiness.\n⚡ Sustained Release: Rather than sudden spikes, matcha catechins release caffeine steadily over 4 to 6 hours.\n🛡️ EGCG Antioxidants: Over 137x more antioxidants than regular brewed green tea.\n\nWhisking with a bamboo chasen also provides a mindful 2-minute meditation break in a busy afternoon.\n\nAre you Team Matcha 🍵 or Team Coffee ☕? Let me know below!\n\n#Matcha #HolisticHealth #LTheanine #Mindfulness #CleanEnergy #Superfoods",
                new String[]{"sophia_brews", "Even as a coffee roaster, I respect ceremonial matcha so much! The umami sweetness of a first-harvest shade-grown tencha is incredible 💚", null, null},
                new String[]{"maya_culinary", "ananya_clay"}
            },
            {
                "marcus_film",
                "Tromsø, Norway 🇳🇴",
                "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=1080&auto=format&fit=crop&q=80",
                "Standing beneath the Aurora Borealis at -18°C 🌌❄️\n\nWhen a solar storm collides with Earth's magnetosphere, the entire night sky transforms into curtains of vivid emerald and violet ribbons moving like silk in the wind.\n\nField tips for Arctic filming:\n🔋 Keep spare lithium batteries in your inner jacket pocket next to your body heat.\n🔭 Use manual focus zoomed 10x on Polaris or Jupiter to ensure tack-sharp stars.\n🧤 Conductive liner gloves are an absolute must.\n\nPhotos will never match the feeling of standing under this in utter silence.\n\n#AuroraBorealis #NorthernLights #Arctic #Norway #AstroPhotography #NatGeoTravel",
                new String[]{"tariq_astro", "A coronal mass ejection of class M5 triggered that storm! Magnificent visual Marcus 🌌", null, null},
                new String[]{"diego_surfs", "liam_acoustic"}
            }
        };

        int hoursOffset = 1;
        for (Object[] postRow : postsData) {
            String authorUsername = (String) postRow[0];
            String location = (String) postRow[1];
            String mediaUrl = (String) postRow[2];
            String content = (String) postRow[3];
            String[] commentData = (String[]) postRow[4];
            String[] likerUsernames = (String[]) postRow[5];

            User author = creators.get(authorUsername);
            if (author == null) continue;

            Post post = new Post();
            post.setUser(author);
            post.setLocation(location);
            post.setContent(content);
            post.setIsArchived(false);
            post.setCreatedAt(LocalDateTime.now().minusHours(hoursOffset++));

            PostMedia pm = new PostMedia();
            pm.setPost(post);
            pm.setMediaUrl(mediaUrl);
            pm.setMediaType("image/jpeg");

            List<PostMedia> mediaList = new ArrayList<>();
            mediaList.add(pm);
            post.setMediaList(mediaList);

            Post savedPost = postRepository.save(post);

            // Seed initial real comments in database
            if (commentData != null && commentData.length >= 2 && commentData[0] != null) {
                User commenter = creators.get(commentData[0]);
                if (commenter != null) {
                    Comment comment = new Comment();
                    comment.setPost(savedPost);
                    comment.setUser(commenter);
                    comment.setContent(commentData[1]);
                    Comment savedComment = commentRepository.save(comment);

                    // Seed reply if present
                    if (commentData.length >= 4 && commentData[2] != null && commentData[3] != null) {
                        User replier = creators.get(commentData[2]);
                        if (replier != null) {
                            Comment reply = new Comment();
                            reply.setPost(savedPost);
                            reply.setUser(replier);
                            reply.setContent(commentData[3]);
                            reply.setParentComment(savedComment);
                            commentRepository.save(reply);
                        }
                    }
                }
            }

            // Seed initial real likes in database
            if (likerUsernames != null) {
                for (String likerName : likerUsernames) {
                    User liker = creators.get(likerName);
                    if (liker != null) {
                        try {
                            Like like = new Like();
                            like.setUser(liker);
                            like.setTargetType(TargetType.post);
                            like.setTargetId(savedPost.getPostId());
                            likeRepository.save(like);
                        } catch (Exception ignored) {}
                    }
                }
            }
        }

        logger.info("Successfully seeded 18 real posts with media, comments, and likes into PostgreSQL.");
    }

    private void seedStories(Map<String, User> creators) {
        if (storyRepository.count() >= 7) {
            logger.info("Database already contains {} stories. Skipping story seeding.", storyRepository.count());
            return;
        }

        logger.info("Seeding 8 multi-slide real interactive stories...");

        String[][] storiesData = {
            {"aria_tech", "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"},
            {"kaito_visuals", "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80"},
            {"elena_wellness", "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80"},
            {"marcus_film", "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80"},
            {"sophia_brews", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80"},
            {"leobrooks_dev", "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80"},
            {"amara_sound", "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80"},
            {"diego_surfs", "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"}
        };

        for (String[] storyRow : storiesData) {
            String authorUsername = storyRow[0];
            String slide1 = storyRow[1];
            String slide2 = storyRow[2];

            User author = creators.get(authorUsername);
            if (author == null) continue;

            Story story = new Story();
            story.setUser(author);
            story.setCreatedAt(LocalDateTime.now());
            story.setExpiresAt(LocalDateTime.now().plusYears(1)); // 1-year persistent demo availability

            List<StoryMedia> mediaList = new ArrayList<>();

            StoryMedia sm1 = new StoryMedia();
            sm1.setStory(story);
            sm1.setMediaUrl(slide1);
            sm1.setMediaType("image/jpeg");
            mediaList.add(sm1);

            StoryMedia sm2 = new StoryMedia();
            sm2.setStory(story);
            sm2.setMediaUrl(slide2);
            sm2.setMediaType("image/jpeg");
            mediaList.add(sm2);

            story.setMediaList(mediaList);
            storyRepository.save(story);
        }

        logger.info("Successfully seeded 8 real interactive stories into PostgreSQL.");
    }
}
