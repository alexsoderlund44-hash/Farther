// The Americas and Oceania. Costs are rough budget-travel estimates in USD per person per day.
window.addCountries([
  { id: "usa", name: "United States", region: "North America", currency: "US dollar (USD)", best: [4, 5, 6, 9, 10], w: "Grand Canyon",
    blurb: "Pricey cities balanced by world-class national parks. Road trips with campsites, motels and hostels make the US doable on a budget.",
    route: "New York, then fly west for a Southwest road trip: Las Vegas, Zion, Grand Canyon and Utah's parks. 3 weeks.",
    places: [
      ["new-york", "New York City", [66, 32, 6, 6], "city food culture", "Skyscraper views from Central Park, bagels and pizza slices, and a free harbor ride past the Statue of Liberty on the Staten Island Ferry.", "The Staten Island Ferry is free, and many museums have pay-what-you-wish hours. Hostels in Brooklyn or Queens cost less than Manhattan.", "Manhattan"],
      ["grand-canyon", "Grand Canyon", [36, 26, 20, 12], "nature trekking", "Hike from the South Rim down the Bright Angel Trail toward the Colorado River, then watch sunset turn the canyon walls red and gold.", "Visitors from abroad pay a $100 surcharge per person at the busiest parks, Grand Canyon included, or $250 for the annual pass that covers it. US residents pay $80.", "Grand Canyon"],
      ["utah-parks", "Zion & Utah's parks", [36, 26, 20, 12], "nature trekking", "Chain-assisted climbs up Angels Landing in Zion, Bryce Canyon's orange hoodoos at sunrise and the red rock arches of Arches National Park.", "Camp free on BLM land just outside the parks, and enter the Angels Landing permit lottery early if you want to climb it.", "Zion National Park"],
      ["new-orleans", "New Orleans", [42, 29, 4, 4], "food culture city", "Brass bands on Frenchmen Street, powdered-sugar beignets, po'boys and wrought-iron balconies across the French Quarter make a cheap, lively city break.", "Streetcars cost $1.25 a ride, and a Jazzy Pass covers unlimited rides. Many Frenchmen Street bars have live music with no cover, just buy a drink.", "French Quarter"],
      ["yosemite", "Yosemite", [42, 26, 15, 12], "nature trekking mountains", "Half Dome and El Capitan tower over the valley floor, with roaring waterfalls in spring and giant sequoias in Mariposa Grove.", "Campsites book out months ahead, the moment reservations open, so set an alarm. The free valley shuttle saves gas and parking hassle.", "Yosemite National Park"]
    ] },
  { id: "canada", name: "Canada", region: "North America", currency: "Canadian dollar (CAD)", best: [6, 7, 8, 9], w: "Moraine Lake",
    blurb: "Turquoise Rocky Mountain lakes, French-speaking Montreal and Quebec City, and huge wilderness, with hostels and campgrounds keeping costs down.",
    route: "Vancouver, Banff and Jasper, then Montreal and Quebec City. 3 weeks.",
    places: [
      ["banff", "Banff & Jasper", [42, 25, 18, 8], "mountains nature trekking", "Drive the Icefields Parkway past glaciers to the turquoise water of Moraine Lake and Lake Louise, the classic Canadian Rockies road trip.", "Hostelling International runs rustic hostels along the parkway, far cheaper than Banff hotels. Use the Parks Canada shuttle to reach Moraine Lake.", "Moraine Lake"],
      ["vancouver", "Vancouver", [42, 25, 5, 4], "city nature", "Bike the Stanley Park seawall, hike the North Shore mountains above downtown, then eat dim sum and ramen in a great Asian food scene.", "Hike the Grouse Grind instead of riding the gondola up. Lynn Canyon's suspension bridge is free, unlike the one at Capilano.", "Stanley Park"],
      ["montreal", "Montreal & Quebec City", [37, 22, 5, 4], "city food culture", "Wood-fired bagels and late-night poutine in Montreal, then the cobbled lanes and city walls of Old Quebec, a short bus ride away.", "Buses between the two cities are cheap if booked early. Hostels in Old Quebec put you inside the walls for a fraction of hotel prices.", "Old Quebec"],
      ["cape-breton", "Cape Breton", [37, 22, 18, 4], "offbeat nature", "Drive or cycle the Cabot Trail's sea cliffs, spot pilot whales from the Skyline Trail and catch a Celtic fiddle ceilidh in a village hall.", "Visit in late September for autumn colors. Campgrounds in Cape Breton Highlands National Park cost far less than coastal motels.", "Cabot Trail"]
    ] },
  { id: "belize", name: "Belize", region: "Central America & Caribbean", currency: "Belize dollar (BZD)", best: [12, 1, 2, 3, 4], w: "Great Blue Hole",
    blurb: "Snorkel the reef off Caribbean cayes, see the Great Blue Hole and wade into Mayan caves. Pricier than its neighbors, but guesthouses help.",
    route: "Caye Caulker, then San Ignacio for caves and ruins. 1 week.",
    places: [
      ["caye-caulker", "Caye Caulker", [25, 15, 4, 20], "beach nature", "No cars, sandy streets and a 'go slow' motto, with reef snorkelling, nurse sharks and sunset swims at the Split.", "Snorkel trips to Hol Chan and Shark Ray Alley are the best value activity. Street barbecue stands serve cheap grilled fish and chicken.", "Caye Caulker"],
      ["san-ignacio", "San Ignacio", [20, 12, 4, 25], "history nature", "Swim and scramble into the ATM cave to see Mayan skeletons, then climb El Castillo at the Xunantunich ruins near town.", "ATM cave tours must go with a licensed guide. Reach Xunantunich cheaply by local bus and the free hand-cranked river ferry.", "Actun Tunichil Muknal"]
    ] },
  { id: "el-salvador", name: "El Salvador", region: "Central America & Caribbean", currency: "US dollar (USD)", best: [11, 12, 1, 2, 3, 4], w: "Lake Coatepeque",
    blurb: "Surf beaches, volcano hikes and pupusas on every corner, in a small, cheap country that is now much safer than its reputation.",
    route: "San Salvador, the Ruta de las Flores and El Tunco. 1 week.",
    places: [
      ["el-tunco", "El Tunco", [15, 10, 3, 6], "beach", "Black-sand surf town on the Pacific with famous sunsets behind its rock formation, cheap hostels and lively beach bars.", "Board rental costs about $10 a day. Beginners can find gentler waves at nearby El Sunzal.", "El Tunco"],
      ["ruta-flores", "Ruta de las Flores", [14, 9, 3, 4], "offbeat culture nature", "Mural-covered coffee towns like Juayúa and Ataco, waterfall hikes and a weekend food festival full of grilled meats and pupusas.", "Juayúa's food festival runs every weekend. Local buses link the towns for very little, so skip the tour van.", "Juayúa"],
      ["coatepeque", "Lake Coatepeque & Santa Ana", [15, 10, 4, 5], "nature trekking", "Swim in a deep blue crater lake, then hike the Santa Ana volcano to peer down at the turquoise lagoon inside its crater.", "Volcano hikes leave once a day with a police escort and guide. Catch an early bus from Santa Ana to make the start.", "Lake Coatepeque"]
    ] },
  { id: "costa-rica", name: "Costa Rica", region: "Central America & Caribbean", currency: "Costa Rican colón (CRC)", best: [12, 1, 2, 3, 4], w: "Arenal Volcano",
    blurb: "Sloths, toucans and rainforest everywhere, plus volcanoes and two coasts. It's the priciest country in Central America, so hostels and local sodas matter.",
    route: "San José, La Fortuna, Monteverde, then Manuel Antonio or the Caribbean coast. 2 weeks.",
    places: [
      ["la-fortuna", "La Fortuna", [22, 16, 6, 20], "nature", "Arenal Volcano's near-perfect cone, hanging bridges through the rainforest canopy and free hot river pools where locals soak after dark.", "Soak in the free hot river near Tabacón instead of paying for resort springs. Casados at local sodas are cheap, filling meals.", "Arenal Volcano"],
      ["monteverde", "Monteverde", [22, 16, 6, 25], "nature trekking", "Misty cloud forest reserves, resplendent quetzals, hummingbirds and night walks in search of tarantulas, frogs and sleeping sloths.", "Night tours are often the best wildlife value. Take the public bus up the mountain instead of a private shuttle.", "Monteverde Cloud Forest Reserve"],
      ["puerto-viejo", "Puerto Viejo", [20, 15, 4, 6], "beach nature", "Laid-back Caribbean beaches, reggae bars, sloths in the trees and the coastal trail through Cahuita National Park.", "Cahuita National Park entry is by donation at the Kelly Creek gate. Rent a beach cruiser bike to ride out to Punta Uva.", "Cahuita National Park"],
      ["osa", "Osa Peninsula", [28, 17, 9, 30], "offbeat nature", "Corcovado, 'the most biologically intense place on Earth', with tapirs, scarlet macaws and all four of Costa Rica's monkey species.", "A licensed guide is required in Corcovado. Base yourself in Puerto Jiménez or Drake Bay and split guide costs with other travelers.", "Corcovado National Park"]
    ] },
  { id: "panama", name: "Panama", region: "Central America & Caribbean", currency: "US dollar and balboa (PAB)", best: [12, 1, 2, 3, 4], w: "San Blas Islands",
    blurb: "Watch ships squeeze through the Panama Canal, drink highland coffee in Boquete and sail between the tiny islands of San Blas.",
    route: "Panama City, Boquete, Bocas del Toro and San Blas. 2 weeks.",
    places: [
      ["panama-city", "Panama City", [20, 14, 4, 6], "city history", "Giant ships rising through the Miraflores canal locks, then the restored colonial streets and rooftop bars of Casco Viejo.", "The Metro and buses are cheap. Walk the Cinta Costera or the Amador Causeway for free skyline views.", "Casco Viejo"],
      ["bocas", "Bocas del Toro", [18, 14, 6, 8], "beach nature", "Hop between Caribbean islands by water taxi, find starfish at Playa Estrella and surf reef breaks off Isla Colón.", "Water taxis are cheaper than tours. Share one with people from your hostel to reach Starfish Beach or Red Frog Beach.", "Bocas del Toro"],
      ["san-blas", "San Blas Islands", [30, 0, 38, 10], "offbeat beach culture", "Tiny palm islands of Guna Yala, run by the Guna people, where you sleep in simple huts and eat freshly caught fish.", "2 to 3 day trips include boat, meals and huts. Bring enough cash, as there are no ATMs on the islands.", "Guna Yala"],
      ["boquete", "Boquete", [15, 13, 4, 5], "mountains trekking", "A cool highland town of coffee farms, the Lost Waterfalls trail and Volcán Barú, Panama's highest peak.", "Climb Barú at night for sunrise over both oceans. Many coffee farms offer tours and tastings, a cheap half-day out.", "Volcán Barú"]
    ] },
  { id: "cuba", name: "Cuba", region: "Central America & Caribbean", currency: "Cuban peso (CUP)", best: [11, 12, 1, 2, 3, 4], w: "Old Havana",
    blurb: "Classic cars, salsa and family-run casas particulares, in a country going through a hard economic time with frequent blackouts and shortages.",
    route: "Havana, Viñales, Trinidad and Cienfuegos. 2 weeks.",
    places: [
      ["havana", "Havana", [31, 12, 6, 5], "city culture history", "Pastel facades in Old Havana, sunset walks along the Malecón seawall and live son music drifting out of bars.", "Bring cash in euros or dollars. Blackouts and shortages are common, so pack a flashlight and basic medicines.", "Old Havana"],
      ["vinales", "Viñales", [25, 12, 7, 5], "nature trekking", "Ride horses past tobacco farms beneath limestone mogotes, explore caves and watch a farmer roll cigars in this green valley.", "Casas particulares often include huge dinners. Ask your host to arrange horseback rides directly with farmers for a fair price."],
      ["trinidad-cuba", "Trinidad", [25, 12, 7, 5], "history culture beach", "Cobbled colonial streets in pastel colors, salsa under the stars, Playa Ancón and the old sugar mill valley.", "Join the dancing at Casa de la Música steps. Cycle or share a taxi to Playa Ancón for a cheap beach day.", "Trinidad, Cuba"]
    ] },
  { id: "dominican-republic", name: "Dominican Republic", region: "Central America & Caribbean", currency: "Dominican peso (DOP)", best: [12, 1, 2, 3, 4], w: "Zona Colonial",
    blurb: "Beyond the all-inclusive resorts, there's a colonial capital, cool mountain towns for hiking and rafting, and bays where humpback whales gather in winter.",
    route: "Santo Domingo, Jarabacoa, Samaná and Las Terrenas. 10 days.",
    places: [
      ["santo-domingo", "Santo Domingo", [20, 12, 3, 4], "history city", "Wander the Zona Colonial, the first European city in the Americas, with its old cathedral, cobbled lanes and merengue in the plazas.", "Guaguas (minibuses) are the cheap way around. Local comedores serve la bandera, a filling plate of rice, beans and meat.", "Ciudad Colonial (Santo Domingo)"],
      ["samana", "Samaná & Las Terrenas", [22, 13, 4, 10], "beach nature", "Humpback whales breach in Samaná Bay from January to March, with palm beaches like Playa Rincón close by.", "Whale-watching boats leave from Samaná town. Shared guaguas between Samaná and Las Terrenas cost far less than taxis.", "Samaná Province"],
      ["jarabacoa", "Jarabacoa", [18, 10, 4, 5], "offbeat mountains trekking", "Cool pine-covered mountains with waterfalls, river rafting and the climb up Pico Duarte, the Caribbean's highest peak.", "Pico Duarte takes 2 or 3 days with a guide. Split guide and mule costs with a group to keep it cheap.", "Pico Duarte"]
    ] },
  { id: "jamaica", name: "Jamaica", region: "Central America & Caribbean", currency: "Jamaican dollar (JMD)", best: [12, 1, 2, 3, 4], w: "Blue Mountains (Jamaica)",
    blurb: "Reggae, smoky jerk chicken, rainforest waterfalls and the coffee-growing Blue Mountains, with cheaper guesthouses away from the resort strips.",
    route: "Kingston and the Blue Mountains, Port Antonio, then Negril. 10 days.",
    places: [
      ["kingston", "Kingston & the Blue Mountains", [28, 15, 6, 6], "culture mountains trekking", "Visit the Bob Marley Museum in Kingston, then hike Blue Mountain Peak through the night to watch sunrise above the clouds.", "Stay in a mountain guesthouse to start the hike at 2 a.m. Route taxis are the cheap way around Kingston.", "Blue Mountain Peak"],
      ["port-antonio", "Port Antonio", [28, 15, 5, 6], "offbeat beach nature", "Bamboo rafting on the Rio Grande, swimming in the Blue Lagoon and Reach Falls on Jamaica's lush, unhurried east coast.", "Much quieter than the north coast resorts. Eat jerk pork at Boston Bay's roadside stands, where jerk cooking is said to have begun.", "Port Antonio"],
      ["negril", "Negril", [34, 18, 5, 4], "beach", "Seven Mile Beach's soft white sand by day, then cliff jumping and sunset at Rick's Café on the West End.", "Eat at jerk shacks rather than resort restaurants. Guesthouses on the West End cliffs are cheaper than beachfront hotels.", "Negril"]
    ] },
  { id: "haiti", name: "Haiti", region: "Central America & Caribbean", currency: "Haitian gourde (HTG)", best: [11, 12, 1, 2, 3], w: "Citadelle Laferrière",
    advisory: "Most governments advise against all travel to Haiti because of gang violence, kidnapping and civil unrest.",
    blurb: "A mountaintop fortress, a rich art scene and quiet beaches, but Haiti is currently very unsafe and most governments advise against all travel.",
    route: "Cap-Haïtien and the Citadelle. 5 days, if travel becomes safe.",
    places: [
      ["citadelle", "Citadelle Laferrière", [25, 10, 10, 10], "history offbeat", "A massive fortress built on a mountain peak after Haitian independence, now a UNESCO World Heritage Site above Cap-Haïtien.", "Not currently considered safe to visit. Check your government's latest travel advice before making any plans.", "Citadelle Laferrière"],
      ["jacmel", "Jacmel", [25, 10, 5, 4], "offbeat culture beach", "A seaside arts town known for colorful papier-mâché carnival masks, craft workshops and old merchant houses.", "Not currently considered safe to visit. Check your government's latest travel advice before making any plans.", "Jacmel"]
    ] },
  { id: "trinidad-tobago", name: "Trinidad and Tobago", region: "Central America & Caribbean", currency: "Trinidad and Tobago dollar (TTD)", best: [1, 2, 3, 4, 5], w: "Pigeon Point",
    blurb: "Trinidad's Carnival and doubles street food, then Tobago's quiet reefs, rainforest and beaches, a Caribbean trip with more local life than resorts.",
    route: "Port of Spain for carnival, then Tobago. 10 days.",
    places: [
      ["port-of-spain", "Port of Spain", [30, 12, 4, 4], "city food culture", "The Caribbean's biggest Carnival, steelpan yards and street food like doubles, roti and bake and shark at Maracas Bay.", "Carnival prices triple; book months ahead. The rest of the year, doubles from roadside vendors make a cheap, filling breakfast.", "Port of Spain"],
      ["tobago", "Tobago", [30, 14, 5, 6], "beach nature offbeat", "Snorkel Buccoo Reef, hike the Main Ridge rainforest reserve and laze on the white sand of Pigeon Point.", "Turtles nest on Tobago's beaches from March to August. Guesthouses around Crown Point are cheaper than resorts.", "Tobago"]
    ] },
  { id: "chile", name: "Chile", region: "South America", currency: "Chilean peso (CLP)", best: [10, 11, 12, 1, 2, 3, 4], w: "Torres del Paine National Park",
    blurb: "From the Atacama desert's salt flats to Patagonia's granite towers. Pricier than its neighbors, but hostels and comfortable long-distance buses help.",
    route: "Santiago, Valparaíso, San Pedro de Atacama, then fly to Torres del Paine. 3 weeks.",
    places: [
      ["valparaiso", "Valparaíso", [22, 17, 5, 3], "city culture", "Ride creaky old funicular elevators up hills covered in street art and colorful houses, with views over the Pacific port.", "Funiculars cost under $1. A free tip-based walking tour explains the stories behind the murals.", "Valparaíso"],
      ["atacama", "San Pedro de Atacama", [28, 18, 6, 25], "nature offbeat", "Salt flats, El Tatio geysers at dawn and some of the clearest stargazing skies on Earth around this adobe desert town.", "Rent a bike for Valle de la Luna instead of a tour. Compare agencies in town before booking the geysers or salt flats.", "Valle de la Luna (Chile)"],
      ["torres-del-paine", "Torres del Paine", [33, 24, 16, 15], "trekking mountains", "Hike the W trek past glaciers, Lago Grey and the French Valley to the base of Patagonia's famous granite towers.", "Campsites must be booked months ahead. Carry your own tent and food to skip pricey refugio beds and meals.", "Torres del Paine National Park"],
      ["chiloe", "Chiloé", [22, 17, 6, 3], "offbeat culture", "A misty island of wooden UNESCO-listed churches, palafito stilt houses in Castro and curanto feasts cooked in earth pits.", "Buses and ferries run from Puerto Montt. Try curanto at Castro's market stalls, where it costs less than in restaurants.", "Chiloé Island"]
    ] },
  { id: "brazil", name: "Brazil", region: "South America", currency: "Brazilian real (BRL)", best: [4, 5, 6, 7, 8, 9], w: "Christ the Redeemer (statue)",
    blurb: "Beaches, rainforest and waterfalls on a huge scale, with good-value hostels, pay-by-weight buffet restaurants and long-distance buses.",
    route: "Rio, Ilha Grande, Paraty, then Iguaçu and Salvador. 3 to 4 weeks.",
    places: [
      ["rio", "Rio de Janeiro", [19, 13, 5, 5], "city beach trekking", "Copacabana and Ipanema beaches, cable car views from Sugarloaf and the dawn hike up Morro Dois Irmãos above the city.", "Por quilo buffets (pay by weight) are the cheap way to eat. Monday night samba at Pedra do Sal is free.", "Sugarloaf Mountain"],
      ["ilha-grande", "Ilha Grande", [17, 13, 8, 6], "beach trekking", "A car-free island where jungle trails lead to Lopes Mendes, one of Brazil's finest beaches, and cheap pousadas line Abraão.", "Ferries from Conceição de Jacareí are the cheapest. Walk the trails instead of paying for water taxis.", "Ilha Grande"],
      ["iguacu", "Iguaçu Falls", [17, 13, 6, 15], "nature", "Hundreds of waterfalls along a 3 km horseshoe, with walkways that end in the roaring spray of the Devil's Throat.", "Visit both the Brazilian and Argentine sides. City buses run to the park entrance for much less than a tour.", "Iguazu Falls"],
      ["salvador", "Salvador", [15, 11, 5, 4], "culture history beach", "Pelourinho's colorful colonial streets, capoeira, Afro-Brazilian drumming and acarajé fritters fried by Baiana women on street corners.", "Join the Tuesday night drumming in Pelourinho. Acarajé from a street stall makes a cheap, filling snack.", "Pelourinho"],
      ["lencois", "Lençóis Maranhenses", [17, 13, 16, 15], "offbeat nature", "Rolling white dunes filled with blue rain lagoons you can swim in, best from May to September.", "Stay in Barreirinhas and join a 4x4 tour. Shared tours cost far less than private ones.", "Lençóis Maranhenses National Park"]
    ] },
  { id: "uruguay", name: "Uruguay", region: "South America", currency: "Uruguayan peso (UYU)", best: [11, 12, 1, 2, 3], w: "Colonia del Sacramento",
    blurb: "A relaxed, small country of colonial towns, steak grills and Atlantic beach villages, where everyone carries a thermos of mate.",
    route: "Colonia, Montevideo and Cabo Polonio. 1 week.",
    places: [
      ["colonia", "Colonia del Sacramento", [26, 20, 5, 3], "history", "Cobbled colonial streets, a lighthouse and river sunsets, an hour by ferry from Buenos Aires and easy as a day trip.", "Book ferries ahead for the best fares. Stay overnight to enjoy the old town once the day-trippers leave.", "Colonia del Sacramento"],
      ["montevideo", "Montevideo", [26, 20, 5, 3], "city food", "Walk or cycle the long rambla, eat grilled meat at the Mercado del Puerto parrillas and hear candombe drums in the streets.", "Lunch specials (menú ejecutivo) are cheaper than dinner. Watching sunset from the rambla with locals costs nothing.", "Montevideo"],
      ["cabo-polonio", "Cabo Polonio", [24, 20, 13, 2], "offbeat beach nature", "A hippie village with no roads or mains power, set among dunes, a lighthouse and a colony of sea lions.", "Reached only by 4x4 truck across the dunes. Bring cash and a flashlight, and sleep in a simple hostel.", "Cabo Polonio"]
    ] },
  { id: "paraguay", name: "Paraguay", region: "South America", currency: "Paraguayan guaraní (PYG)", best: [4, 5, 6, 7, 8, 9], w: "Jesuit Missions of La Santísima Trinidad de Paraná and Jesús de Tavarangue",
    blurb: "South America's least-visited country, with Jesuit mission ruins, tereré on every street corner and the wild Chaco, all very cheap.",
    route: "Asunción and the Jesuit missions near Encarnación. 1 week.",
    places: [
      ["asuncion", "Asunción", [15, 8, 2, 2], "city offbeat", "A low-key capital of colonial buildings, the sprawling Mercado 4 and warm chipa cheese rolls sold from street baskets.", "Try tereré, the cold yerba mate drink. Cheap set lunches are easy to find around the center.", "Asunción"],
      ["trinidad-missions", "Jesuit Missions", [15, 8, 4, 5], "offbeat history", "Ruined 18th-century Jesuit missions at Trinidad and Jesús, UNESCO-listed, often near-empty and an easy day trip from Encarnación.", "Night light shows run at Trinidad. Local buses from Encarnación reach the ruins for very little.", "Jesuit Missions of La Santísima Trinidad de Paraná and Jesús de Tavarangue"]
    ] },
  { id: "venezuela", name: "Venezuela", region: "South America", currency: "Venezuelan bolívar (VES)", best: [12, 1, 2, 3, 4], w: "Angel Falls",
    advisory: "Many governments advise reconsidering travel to Venezuela because of crime, kidnapping and political uncertainty after the January 2026 change of government, and against all travel to border areas and several states. Strong earthquakes in June 2026 also damaged infrastructure.",
    blurb: "Angel Falls and the tabletop mountains of the Gran Sabana. Security remains a serious concern, so check current government advice carefully.",
    route: "Canaima and Angel Falls, then the Gran Sabana and Roraima. 2 weeks, if travel becomes safe.",
    places: [
      ["angel-falls", "Angel Falls", [30, 12, 30, 25], "offbeat nature", "The world's tallest waterfall, reached by river boat through the jungle and tepuis of Canaima National Park.", "Visited on packages from Canaima. Check current travel advice before booking, and use only established operators.", "Angel Falls"],
      ["roraima", "Mount Roraima", [15, 10, 10, 20], "offbeat trekking mountains", "A 6-day trek onto a flat-topped tepui above the clouds, with strange black rock formations and rare plants on the summit.", "Usually started from Santa Elena de Uairén. Check current travel advice and border conditions first, and hire a registered guide.", "Mount Roraima"]
    ] },
  { id: "guyana", name: "Guyana", region: "South America", currency: "Guyanese dollar (GYD)", best: [9, 10, 11, 2, 3], w: "Kaieteur Falls",
    blurb: "English-speaking, little-visited and covered in rainforest, with Kaieteur Falls, savanna ranches and community-run eco-lodges.",
    route: "Georgetown, Kaieteur Falls and the Rupununi savanna. 10 days.",
    places: [
      ["kaieteur", "Kaieteur Falls", [30, 12, 60, 10], "offbeat nature", "A single 226 m drop through untouched rainforest, far more powerful than Angel Falls, often with hardly anyone else around.", "Day flights from Georgetown are the usual way in. Join a shared flight package to lower the cost per person.", "Kaieteur Falls"],
      ["rupununi", "Rupununi", [40, 15, 20, 15], "offbeat nature", "Wide savanna ranches, giant river otters, black caiman and a real chance of spotting jaguars in Guyana's wild south.", "Community eco-lodges like Surama include meals and guides. Overland minibuses from Georgetown are cheaper than flying, but slow.", "Rupununi"]
    ] },
  { id: "suriname", name: "Suriname", region: "South America", currency: "Surinamese dollar (SRD)", best: [2, 3, 9, 10, 11], w: "Paramaribo",
    blurb: "A wooden Dutch colonial capital, Javanese warungs and some of the world's most intact rainforest along wide jungle rivers.",
    route: "Paramaribo, then a river trip to the interior. 1 week.",
    places: [
      ["paramaribo", "Paramaribo", [25, 10, 3, 3], "city history offbeat", "A UNESCO-listed old town of white wooden buildings, where a mosque and a synagogue stand side by side.", "Warungs serve cheap Javanese food. Try saoto soup or bami in the Blauwgrond area in the north of the city.", "Paramaribo"],
      ["upper-suriname", "Upper Suriname River", [30, 10, 20, 10], "offbeat nature culture", "Travel upriver by dugout canoe to Maroon villages and simple jungle lodges among rapids and rainforest.", "Book a 3 to 4 day package from Paramaribo. Packages cover boats, meals and guides, which is hard to beat on your own."]
    ] },
  { id: "australia", name: "Australia", region: "Oceania", currency: "Australian dollar (AUD)", best: [3, 4, 5, 9, 10, 11], w: "Uluru",
    blurb: "Expensive, but hostels, campervans and working holiday visas make long trips possible, from Sydney's beaches to the Outback and the Reef.",
    route: "Sydney, the east coast up to Cairns, then Uluru. 4 weeks.",
    places: [
      ["sydney", "Sydney", [35, 24, 5, 3], "city beach", "The Opera House, harbor ferries to Manly and the clifftop Bondi to Coogee walk past ocean pools and sandy coves.", "Opal card fares are capped on Sundays. The Manly ferry doubles as a cheap harbor cruise.", "Sydney Opera House"],
      ["great-barrier-reef", "Cairns & the Reef", [30, 22, 5, 40], "nature beach", "Snorkel or dive the Great Barrier Reef from Cairns, then explore the Daintree, where ancient rainforest runs down to the sea.", "Outer-reef day trips are worth the extra cost. Swim for free in the Cairns Esplanade Lagoon on rest days.", "Great Barrier Reef"],
      ["uluru", "Uluru", [40, 24, 30, 15], "nature culture", "Watch Uluru glow red at sunrise, then hike the Valley of the Winds among the giant domes of Kata Tjuta.", "Camp at Yulara to save on accommodation, and bring groceries, as food at the resort is expensive.", "Uluru"],
      ["tasmania", "Tasmania", [30, 22, 15, 10], "offbeat nature trekking", "Cradle Mountain, the white sand of Wineglass Bay and the multi-day Overland Track through wild alpine country.", "Rent a car or campervan; buses are limited. A multi-week parks pass beats paying entry at each national park.", "Cradle Mountain-Lake St Clair National Park"],
      ["melbourne", "Melbourne", [32, 22, 4, 3], "city food culture", "Laneway cafés, street art in Hosier Lane and the Great Ocean Road's Twelve Apostles within a long day trip.", "Trams are free in the city centre's Free Tram Zone. Queen Victoria Market is good for cheap food.", "Great Ocean Road"]
    ] },
  { id: "new-zealand", name: "New Zealand", region: "Oceania", currency: "New Zealand dollar (NZD)", best: [11, 12, 1, 2, 3, 4], w: "Milford Sound",
    blurb: "Fjords, volcanoes and Great Walks, best seen by campervan with hostels and cheap Department of Conservation campsites in between.",
    route: "Auckland, Rotorua, Tongariro, then the South Island: Queenstown, Milford Sound and Wānaka. 3 weeks.",
    places: [
      ["tongariro", "Tongariro Crossing", [30, 20, 16, 10], "trekking mountains", "A 19 km volcanic day hike past steaming vents, the Red Crater and the bright Emerald Lakes.", "Book the shuttle from National Park village. Start early and pack warm layers, as mountain weather changes fast.", "Tongariro Alpine Crossing"],
      ["queenstown", "Queenstown & Wānaka", [35, 22, 10, 15], "mountains nature", "Bungy and adventure sports in Queenstown, lakeside walks in quieter Wānaka and a sunrise hike up Roys Peak.", "Hiking Roys Peak or Ben Lomond is free. Beds in Wānaka usually cost less than in Queenstown.", "Queenstown, New Zealand"],
      ["milford", "Milford Sound", [35, 20, 24, 10], "nature trekking", "Waterfalls pour down sheer fjord walls on a boat cruise, at the end of a spectacular mountain drive from Te Anau.", "Budget boat cruises leave early or late in the day. Sleep in Te Anau, where beds are cheaper.", "Milford Sound"],
      ["abel-tasman", "Abel Tasman", [30, 20, 10, 8], "beach trekking", "Golden beaches and turquoise coves along a coastal Great Walk, with sea kayaking and water taxis between bays.", "Book Great Walk campsites ahead. Walk one way and catch a water taxi back to save time.", "Abel Tasman National Park"]
    ] },
  { id: "fiji", name: "Fiji", region: "Oceania", currency: "Fijian dollar (FJD)", best: [5, 6, 7, 8, 9, 10], w: "Yasawa Islands",
    blurb: "Budget island resorts with meals included, kava ceremonies, friendly villages and coral reefs, especially out in the Yasawa Islands.",
    route: "Nadi, then island-hop the Yasawas. 10 days.",
    places: [
      ["yasawas", "Yasawa Islands", [40, 0, 15, 10], "beach nature", "Hop between budget island resorts with meals included, snorkel coral reefs and join a village kava ceremony.", "A Bula Pass covers ferries between islands. Island resort dorms usually include meals, so there is little else to pay for.", "Yasawa Islands"],
      ["taveuni", "Taveuni", [30, 12, 6, 10], "offbeat nature", "Fiji's 'garden island', with rainforest waterfalls at Bouma, the Rainbow Reef's soft corals and very few crowds.", "Snorkel Waitabu Marine Park with village guides. Local buses are cheap but infrequent, so plan your days around them.", "Taveuni"]
    ] },
  { id: "papua-new-guinea", name: "Papua New Guinea", region: "Oceania", currency: "Papua New Guinean kina (PGK)", best: [5, 6, 7, 8, 9, 10], w: "Kokoda Track",
    advisory: "Many governments advise a high degree of caution in Papua New Guinea because of crime, especially in cities, and tribal violence in parts of the Highlands.",
    blurb: "Hundreds of cultures, highland festivals and remote treks, hard and costly to reach, with real security risks best handled with local guides.",
    route: "Port Moresby, the Kokoda Track or the Highlands, then the Sepik River. 2 weeks.",
    places: [
      ["kokoda", "Kokoda Track", [20, 15, 20, 30], "offbeat trekking history", "A 96 km WWII trail over the Owen Stanley Range, through jungle villages and over steep, muddy ridges.", "Treks run with licensed operators, usually 8 to 10 days. Train beforehand, as the trail is much tougher than its length suggests.", "Kokoda Track"],
      ["highlands", "Mount Hagen & Goroka", [40, 15, 10, 15], "offbeat culture", "Highland sing-sing festivals, where dancers in face paint, shell necklaces and towering feather headdresses gather from villages across the region.", "Goroka Show is in September; Mount Hagen Show is in August. Book guesthouses and transfers early through a trusted local operator.", "Goroka Show"],
      ["sepik", "Sepik River", [30, 12, 20, 15], "offbeat culture nature", "Towering spirit houses and woodcarving villages along a wide, slow jungle river in remote northern Papua New Guinea.", "Travel by motor canoe with a local guide. Village guesthouses are basic, so bring a mosquito net and cash."]
    ] },
  { id: "samoa", name: "Samoa", region: "Oceania", currency: "Samoan tālā (WST)", best: [5, 6, 7, 8, 9, 10], w: "To Sua Ocean Trench",
    blurb: "Open-sided beach fale huts with meals included, freshwater swimming holes and traditional Polynesian village life on two green islands.",
    route: "Upolu, then ferry to Savai'i. 10 days.",
    places: [
      ["upolu", "Upolu", [40, 0, 6, 6], "beach culture", "Climb down a ladder into the To Sua Ocean Trench, then sleep in beach fales with meals included on the south coast.", "Beach fales usually include dinner and breakfast. Villages charge small fees for beaches and pools, so carry small change.", "To Sua Ocean Trench"],
      ["savaii", "Savai'i", [40, 0, 6, 4], "offbeat beach nature", "Black lava fields, the roaring Alofaaga Blowholes and quiet beaches on Samoa's bigger, sleepier island.", "Buses are cheap but run on 'island time'. Sharing a rental car with others lets you see more in a day.", "Savai'i"]
    ] },
  { id: "vanuatu", name: "Vanuatu", region: "Oceania", currency: "Vanuatu vatu (VUV)", best: [5, 6, 7, 8, 9, 10], w: "Mount Yasur",
    blurb: "An active volcano you can stand on, swimming blue holes and WWII wrecks, spread across friendly Melanesian islands.",
    route: "Port Vila, Tanna for Mount Yasur, then Espiritu Santo. 10 days.",
    places: [
      ["tanna", "Tanna & Mount Yasur", [40, 12, 15, 90], "offbeat nature", "Stand at the crater rim of an erupting volcano as lava bursts light up the sky, best seen at dusk.", "Volcano entry fees are high; bungalows near the volcano include tours. Book flights from Port Vila early, as seats are limited.", "Mount Yasur"],
      ["santo", "Espiritu Santo", [35, 12, 8, 8], "offbeat beach nature", "Champagne Beach, jungle blue holes for swimming and the SS President Coolidge, one of the world's great wreck dives.", "Rent a car with others to visit the blue holes. Island bungalows run by local families cost less than resorts.", "Espiritu Santo"]
    ] }
]);
