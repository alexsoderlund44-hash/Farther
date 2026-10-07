// Europe. Costs are rough budget-travel estimates in USD per person per day.
window.addCountries([
  { id: "portugal", name: "Portugal", region: "Europe", currency: "Euro (EUR)", best: [4, 5, 6, 9, 10], w: "Belém Tower",
    blurb: "Western Europe's best value on a budget: tiled Lisbon and Porto, Atlantic surf beaches, cheap wine and custard tarts, and friendly hostels in every town.",
    route: "Lisbon, Sintra, Porto, then down to the Algarve. 2 weeks.",
    places: [
      ["lisbon", "Lisbon", [30, 20, 6, 6], "city food history", "Rattle up steep hills on Tram 28, watch the sun set from a miradouro viewpoint and eat warm pastéis de nata in the lanes of Alfama.", "Eat the prato do dia (dish of the day) at lunch for the best value, and walk or ride trams instead of taking taxis.", "Alfama"],
      ["porto", "Porto", [27, 19, 4, 6], "city food", "Stroll Ribeira's riverside quay, cross the double-decker Dom Luís I bridge and sip tawny in the port cellars of Vila Nova de Gaia.", "Many port lodges in Gaia offer cheap tastings. Fill up on a francesinha sandwich or a bifana from a neighborhood café.", "Ribeira (Porto)"],
      ["algarve", "Lagos & the Algarve", [30, 20, 6, 5], "beach trekking", "Kayak into sea caves at Ponta da Piedade, swim below golden cliffs and hike the Seven Hanging Valleys trail along the Algarve coast.", "Visit in May, June or September for half-price beds in Lagos hostels and warm water without the August crowds.", "Ponta da Piedade"],
      ["azores", "Azores", [32, 20, 15, 5], "offbeat nature trekking", "Mid-Atlantic volcanic islands with the twin crater lakes of Sete Cidades, natural hot springs in Furnas and whale watching from São Miguel.", "Budget flights from Lisbon are often cheap. Rent a car to explore São Miguel, and soak in free hot springs where you find them.", "Sete Cidades"]
    ] },
  { id: "spain", name: "Spain", region: "Europe", currency: "Euro (EUR)", best: [4, 5, 6, 9, 10], w: "Alhambra",
    blurb: "Cheap tapas, Moorish palaces and long walking routes like the Camino, with good-value hostels in every city from Barcelona to Seville.",
    route: "Barcelona, Madrid, then Andalucía: Seville, Granada and Córdoba. 2 to 3 weeks.",
    places: [
      ["barcelona", "Barcelona", [40, 26, 6, 10], "city food beach", "Gaudí's Sagrada Família and Park Güell, the narrow lanes of the Gothic Quarter and an evening swim off Barceloneta beach.", "Book the Sagrada Família ahead online. Eat the menú del día at lunch, a set three courses for far less than dinner.", "Sagrada Família"],
      ["madrid", "Madrid", [35, 23, 5, 5], "city culture food", "Spend a morning in the Prado, row a boat in Retiro Park, then hop between tapas bars in La Latina until well after midnight.", "The big museums, including the Prado and Reina Sofía, are free in the last two hours most days.", "Plaza Mayor, Madrid"],
      ["seville", "Seville", [32, 21, 5, 7], "history culture food", "Wander the tiled courtyards of the Real Alcázar, catch live flamenco in Triana and linger in squares shaded by orange trees.", "Avoid July and August, when it regularly passes 40°C. Spring brings Feria and orange blossom, but book beds early.", "Plaza de España, Seville"],
      ["granada-spain", "Granada", [29, 17, 5, 8], "history culture", "The Alhambra glows above the city at sunset, and down below the bars still bring free tapas with every drink you order.", "Alhambra tickets sell out weeks ahead, so book early. Watch sunset free from the Mirador de San Nicolás in the Albaicín.", "Alhambra"],
      ["camino", "Camino de Santiago", [17, 21, 2, 2], "trekking offbeat", "Walk the Camino de Santiago, a 30-day pilgrimage across northern Spain, or just the last 100 km into Santiago de Compostela.", "Pilgrim albergues cost about $10 to $15 a night. Many villages offer a cheap pilgrim menu with wine included.", "Camino de Santiago"]
    ] },
  { id: "france", name: "France", region: "Europe", currency: "Euro (EUR)", best: [5, 6, 9, 10], w: "Mont-Saint-Michel",
    blurb: "Expensive in Paris, much cheaper in the regions, with bakeries, cheese markets and set lunches that feed you well on a budget.",
    route: "Paris, Lyon, Provence and the Alps around Chamonix. 2 weeks.",
    places: [
      ["paris", "Paris", [49, 26, 6, 10], "city culture food", "See the Louvre and the Eiffel Tower, climb the steps of Montmartre and picnic on baguettes and cheese along the banks of the Seine.", "Museums are free on some first Sundays, and for under-26 EU residents. Bakery sandwiches and market picnics beat café prices.", "Eiffel Tower"],
      ["lyon", "Lyon", [38, 23, 5, 5], "food city history", "France's food capital, with cozy bouchon restaurants, secret traboule passageways through Vieux Lyon and Roman theatres on Fourvière hill.", "Lunch set menus are much cheaper than dinner, even at well-known bouchons. Browse Les Halles Paul Bocuse for picnic treats.", "Vieux Lyon"],
      ["provence", "Provence", [38, 21, 10, 4], "nature culture", "Purple lavender fields, hilltop villages like Gordes and the turquoise river of the Verdon Gorge, a great place to hike or kayak.", "Lavender blooms late June to July. Regional buses are cheap, and village markets sell everything you need for a picnic.", "Gorges du Verdon"],
      ["chamonix", "Chamonix", [43, 23, 6, 10], "mountains trekking", "Wake up to Mont Blanc views in a mountain town that marks the start of the Tour du Mont Blanc, the Alps' classic long hike.", "Mountain refuges and campsites are the budget beds. Many valley hikes start straight from town, no cable car needed.", "Chamonix"]
    ] },
  { id: "italy", name: "Italy", region: "Europe", currency: "Euro (EUR)", best: [4, 5, 6, 9, 10], w: "Colosseum",
    blurb: "Art, ruins and food everywhere, more affordable in the south and outside peak summer, with hostels, trains and pizza that keep costs low.",
    route: "Rome, Florence, Cinque Terre and Venice, or Naples and Sicily for less money. 2 to 3 weeks.",
    places: [
      ["rome", "Rome", [38, 25, 5, 10], "history city food", "Walk through 2,000 years at the Colosseum and Roman Forum, see the Vatican, then eat cacio e pepe in the trattorias of Trastevere.", "Free water fountains are everywhere, so carry a bottle. Standing at the bar makes coffee cheaper than sitting down.", "Colosseum"],
      ["florence", "Florence", [38, 25, 5, 10], "history culture", "Climb the Duomo, stand before Botticelli in the Uffizi and watch sunset turn the rooftops gold from Piazzale Michelangelo.", "Book the Uffizi ahead, or go on a free first Sunday. A lampredotto or schiacciata sandwich makes a cheap lunch.", "Florence Cathedral"],
      ["cinque-terre", "Cinque Terre", [44, 25, 10, 8], "trekking beach", "Five pastel fishing villages clinging to sea cliffs, linked by hiking trails, little trains and swimming spots off the rocks.", "Stay in La Spezia for cheaper beds, then hop on the regional train to the villages. Pack focaccia for the trail.", "Cinque Terre"],
      ["naples", "Naples & Pompeii", [31, 16, 5, 10], "food history", "The best pizza in the world for a few euros, chaotic street life, and a day trip to the ruins of Pompeii under Vesuvius.", "Pizza margherita at the classic pizzerias costs about €5. Take the cheap Circumvesuviana train to Pompeii.", "Pompeii"],
      ["sicily", "Sicily", [31, 19, 8, 6], "food history beach offbeat", "Baroque towns like Noto, hikes on the slopes of Mount Etna and arancini and panelle from the street food stalls of Palermo's markets.", "Buses are cheaper than trains on most routes. Street food in Ballarò market makes a filling, cheap lunch.", "Mount Etna"]
    ] },
  { id: "greece", name: "Greece", region: "Europe", currency: "Euro (EUR)", best: [5, 6, 9, 10], w: "Acropolis of Athens",
    blurb: "Ancient ruins, slow island ferries and gyros for a few euros, with cheap guesthouses and quiet beaches once you leave the famous islands.",
    route: "Athens, Meteora, then ferries to Naxos and Crete. 2 to 3 weeks.",
    places: [
      ["athens", "Athens", [28, 18, 5, 10], "history city food", "Climb to the Parthenon on the Acropolis, wander the old lanes of Plaka and toast the floodlit ruins from a rooftop bar.", "Gyros cost about €4. Many sites are free on some winter Sundays, so plan museum days around them if you can.", "Acropolis of Athens"],
      ["meteora", "Meteora", [28, 17, 6, 5], "history trekking", "Byzantine monasteries perched on top of giant sandstone pillars above Kalambaka, with old footpaths winding between them.", "Walk the old footpaths between monasteries instead of taking a tour. Each monastery has its own closing day, so check before you go.", "Meteora"],
      ["naxos", "Naxos", [31, 19, 8, 4], "beach history", "Long sandy beaches like Plaka and Agios Prokopios, marble mountain villages and local cheese, all cheaper than Mykonos or Santorini.", "Book slow ferries rather than fast ones to save money. Local buses reach the beaches and mountain villages cheaply.", "Naxos"],
      ["crete", "Crete", [28, 18, 8, 6], "beach trekking", "Hike the Samaria Gorge down to the Libyan Sea, wade into the turquoise Balos lagoon and explore the Minoan palace of Knossos.", "Hike Samaria Gorge from May to October, when it is open. Public KTEL buses link the main towns and trailheads cheaply.", "Samaria Gorge"]
    ] },
  { id: "germany", name: "Germany", region: "Europe", currency: "Euro (EUR)", best: [5, 6, 7, 8, 9], w: "Neuschwanstein Castle",
    blurb: "Big-city culture at fair prices, fairytale castles, beer gardens and cheap regional train tickets that make Germany easy on a budget.",
    route: "Berlin, Dresden, Munich and the Bavarian Alps. 2 weeks.",
    places: [
      ["berlin", "Berlin", [30, 20, 6, 6], "city history culture", "Trace the Berlin Wall at the East Side Gallery, spend a day on Museum Island and dive into a nightlife scene that runs until Monday.", "Döner kebabs and Späti corner shops keep food cheap. Many Wall memorials and free walking tours cost nothing.", "Brandenburg Gate"],
      ["munich", "Munich & Bavaria", [35, 24, 6, 8], "city culture mountains", "Shady beer gardens, the turrets of Neuschwanstein Castle and easy day trips from Munich into the Bavarian Alps.", "The Bayern-Ticket covers a whole day of regional trains, and it gets cheaper per person for small groups.", "Neuschwanstein Castle"],
      ["saxon-switzerland", "Saxon Switzerland", [28, 20, 5, 2], "offbeat trekking nature", "Sandstone towers, forest hikes and the famous Bastei Bridge, an easy day trip from Dresden along the Elbe.", "Trains from Dresden take under an hour. Hike the Malerweg trail and sleep in simple guesthouses to stay cheap.", "Bastei"]
    ] },
  { id: "uk", name: "United Kingdom", region: "Europe", currency: "Pound sterling (GBP)", best: [5, 6, 7, 8, 9], w: "Isle of Skye",
    blurb: "Pricey, but free museums, hostels, long-distance trails and cheap advance train and coach tickets make the UK doable on a budget.",
    route: "London, York, Edinburgh and the Scottish Highlands. 2 weeks.",
    places: [
      ["london", "London", [43, 26, 13, 3], "city culture history", "Free world-class museums, Borough and Camden markets, royal parks and walks along the Thames past Tower Bridge.", "The British Museum, National Gallery and Tate are free. Use contactless on the Tube and buses, since daily fares are capped.", "Tower Bridge"],
      ["edinburgh", "Edinburgh", [38, 23, 5, 6], "history city", "Edinburgh Castle on its volcanic rock, the cobbles of the Royal Mile and a short hike up Arthur's Seat for city views.", "Avoid August if you don't want festival prices. The National Museum of Scotland and Arthur's Seat are both free.", "Edinburgh Castle"],
      ["skye", "Isle of Skye & the Highlands", [38, 23, 16, 3], "nature trekking mountains", "Hike to the Old Man of Storr, walk the strange ridges of the Quiraing and drive through moody Glencoe in the Scottish Highlands.", "Wild camping is legal in Scotland. Book hostels early in summer, as beds on Skye fill up fast.", "Isle of Skye"],
      ["lake-district", "Lake District", [38, 21, 10, 2], "trekking nature", "Green fells, quiet lakes like Buttermere and walking from hostel to hostel through England's best hiking country.", "YHA hostels are well placed for fell walking. Buses link the main villages, so you can skip the car.", "Lake District"]
    ] },
  { id: "ireland", name: "Ireland", region: "Europe", currency: "Euro (EUR)", best: [5, 6, 7, 8, 9], w: "Cliffs of Moher",
    blurb: "Sea cliffs, green valleys and live music in pubs, with high prices offset by hostels, cheap buses and free museums.",
    route: "Dublin, Galway, the Cliffs of Moher and the Ring of Kerry. 10 days.",
    places: [
      ["dublin", "Dublin", [48, 25, 6, 6], "city history", "See the Book of Kells at Trinity College, stroll Georgian squares and join a trad music session in a traditional pub.", "Many museums are free, including the National Museum and National Gallery. Pub music sessions cost only a pint.", "Trinity College Dublin"],
      ["galway", "Galway & Connemara", [42, 22, 9, 4], "culture nature", "Live trad music spills out of pubs in this seaside town, the base for day trips to the Cliffs of Moher, Connemara and the Aran Islands.", "Bus Éireann and Expressway buses are cheap if booked online. Rent a bike on Inis Mór to see the island.", "Cliffs of Moher"],
      ["kerry", "Ring of Kerry", [38, 22, 12, 3], "nature trekking", "Wild coastal roads on the Ring of Kerry, the mountain pass of the Gap of Dunloe and boat trips to Skellig Michael.", "Cycle the Gap of Dunloe from Killarney, which has several good hostels and is the cheapest base for the area.", "Gap of Dunloe"]
    ] },
  { id: "netherlands", name: "Netherlands", region: "Europe", currency: "Euro (EUR)", best: [4, 5, 6, 9], w: "Kinderdijk",
    blurb: "Canals, bikes and windmills in a compact, flat country, easy to cover by train with a cheaper city base than Amsterdam.",
    route: "Amsterdam, Utrecht, Rotterdam and Kinderdijk. 5 days.",
    places: [
      ["amsterdam", "Amsterdam", [59, 25, 6, 8], "city culture", "Cycle along canals lined with gabled houses, see Rembrandt at the Rijksmuseum and visit the Anne Frank House.", "Book the Anne Frank House online weeks ahead. Rent a bike, and picnic in Vondelpark instead of eating out.", "Amsterdam"],
      ["utrecht", "Utrecht", [46, 22, 5, 3], "city offbeat", "Wharf-level canals lined with cafés and the tall Dom Tower, a student city without the Amsterdam crowds or prices.", "A cheaper base than Amsterdam, 25 minutes away by train. Climb the Dom Tower for views over the old town.", "Utrecht"],
      ["rotterdam", "Rotterdam & Kinderdijk", [42, 22, 6, 6], "city history", "Bold modern architecture like the Cube Houses and Markthal, plus the 18th-century windmills of Kinderdijk nearby.", "The waterbus to Kinderdijk is the fun way there. Walking among the windmills is free; only the museum mills charge.", "Kinderdijk"]
    ] },
  { id: "belgium", name: "Belgium", region: "Europe", currency: "Euro (EUR)", best: [4, 5, 6, 9], w: "Grand-Place",
    blurb: "Medieval squares, frites, waffles and Trappist beer, all a short and cheap train ride apart.",
    route: "Brussels, Ghent and Bruges. 4 days.",
    places: [
      ["brussels", "Brussels", [35, 21, 5, 4], "city food", "The gilded Grand-Place, comic strip murals around the old town and paper cones of frites with mayonnaise.", "Weekend train tickets are often half price. Frites stands and waffle shops make cheap meals between museums.", "Grand-Place"],
      ["bruges", "Bruges & Ghent", [38, 21, 5, 5], "history", "Canal-lined medieval towns of belfries and gabled houses, with Ghent cheaper and livelier than storybook Bruges.", "Stay in Ghent and day trip to Bruges. Ghent's hostels cost less, and the train between them is quick.", "Bruges"]
    ] },
  { id: "switzerland", name: "Switzerland", region: "Europe", currency: "Swiss franc (CHF)", best: [6, 7, 8, 9], w: "Matterhorn",
    blurb: "The most expensive country in Europe, but the hiking is free, the trains are scenic and Coop and Migros supermarkets keep food affordable.",
    route: "Lucerne, Interlaken and Lauterbrunnen, then Zermatt. 1 week.",
    places: [
      ["lauterbrunnen", "Lauterbrunnen & Interlaken", [58, 35, 24, 5], "mountains trekking nature", "A valley of 72 waterfalls under the Jungfrau, with Staubbach Falls by the village and alpine trails to Mürren and Wengen.", "Buy food at Coop or Migros. A Half Fare Card halves most transport, including mountain trains and cable cars.", "Lauterbrunnen"],
      ["lucerne", "Lucerne", [58, 35, 13, 6], "city mountains", "Walk across the wooden Chapel Bridge, take a boat trip on Lake Lucerne and look out over the Alps from Rigi or Pilatus.", "Hike up Rigi or Pilatus instead of taking the cog railway, then ride down if your legs give out.", "Chapel Bridge"],
      ["zermatt", "Zermatt", [71, 39, 16, 5], "mountains trekking", "A car-free village under the Matterhorn, with high alpine trails, glacier views and the five lakes walk.", "Stay in Täsch and take the shuttle in. Hiking trails from the village are free and some of the best in the Alps.", "Matterhorn"]
    ] },
  { id: "austria", name: "Austria", region: "Europe", currency: "Euro (EUR)", best: [5, 6, 7, 8, 9], w: "Hallstatt",
    blurb: "Imperial Vienna, Alpine lakes and hut-to-hut hiking, with cheap opera tickets and good regional trains.",
    route: "Vienna, Salzburg, Hallstatt and the Tyrol. 10 days.",
    places: [
      ["vienna", "Vienna", [30, 23, 6, 8], "city culture history", "Imperial palaces like Schönbrunn, grand coffee houses serving Sachertorte and cheap standing tickets at the State Opera.", "Opera standing places cost about €15 and go on sale online the day before. Schönbrunn's gardens are free to walk.", "Schönbrunn Palace"],
      ["salzburg", "Salzburg & Hallstatt", [32, 23, 10, 6], "history nature", "Mozart's baroque old town in Salzburg, then Hallstatt, a lakeside village squeezed under steep mountains.", "Visit Hallstatt early or late to avoid tour groups. Stay in Salzburg or Bad Ischl for cheaper beds.", "Hallstatt"],
      ["tyrol", "Innsbruck & the Tyrol", [35, 23, 10, 4], "mountains trekking", "Alpine huts, cable cars and summer hiking straight from Innsbruck, a lively university city ringed by mountains.", "Alpine club membership gets discounts in huts. Ask your hotel or hostel about the local guest card, which often includes free buses.", "Innsbruck"]
    ] },
  { id: "czechia", name: "Czechia", region: "Europe", currency: "Czech koruna (CZK)", best: [5, 6, 7, 8, 9], w: "Charles Bridge",
    blurb: "Fairytale old towns, cheap Czech beer and sandstone national parks, an easy and affordable trip from Prague.",
    route: "Prague, Český Krumlov and Bohemian Switzerland. 1 week.",
    places: [
      ["prague", "Prague", [25, 16, 5, 6], "city history", "Cross Charles Bridge at dawn before the crowds, climb to Prague Castle and share long tables in old beer halls.", "Eat a lunch menu (polední menu) and avoid Old Town Square restaurants. A pint of Czech lager is often cheaper than water.", "Charles Bridge"],
      ["cesky-krumlov", "Český Krumlov", [25, 15, 6, 5], "history", "A storybook castle town wrapped around a bend of the Vltava, with painted towers, cobbled lanes and riverside pubs.", "Float the Vltava by canoe or raft. Come as an overnight stay rather than a day trip, when the lanes empty out.", "Český Krumlov"],
      ["bohemian-switzerland", "Bohemian Switzerland", [25, 15, 6, 4], "offbeat trekking nature", "Hike to Pravčická Gate, the largest natural sandstone arch in Europe, and take a boat through the Kamenice gorges.", "Day trip from Prague, or stay in Hřensko. Guesthouses in nearby villages are cheaper than in Prague."]
    ] },
  { id: "slovakia", name: "Slovakia", region: "Europe", currency: "Euro (EUR)", best: [6, 7, 8, 9], w: "High Tatras",
    blurb: "Castles and big mountains at Central Europe's lower prices, with mountain huts, cheap trains and some of the region's best hiking.",
    route: "Bratislava, the High Tatras and Slovak Paradise. 1 week.",
    places: [
      ["bratislava", "Bratislava", [22, 15, 4, 4], "city history", "Pastel squares, quirky bronze statues and a white castle overlooking the Danube fill this compact, walkable old town.", "An easy cheap stop between Vienna and Budapest, with trains and buses linking all three for little money.", "Bratislava Castle"],
      ["high-tatras", "High Tatras", [22, 15, 5, 3], "mountains trekking", "Hike between alpine lakes like Štrbské Pleso and cozy huts in Europe's smallest high mountain range.", "Mountain huts serve cheap hot meals. The little electric train links the resorts, so you don't need a car.", "High Tatras"],
      ["slovak-paradise", "Slovak Paradise", [20, 14, 5, 3], "offbeat trekking nature", "Climb ladders and chains up narrow gorges beside waterfalls, the most fun day hike in Slovakia's national parks.", "Trails are one-way in places; follow the arrows. Stay in a guesthouse in Podlesok or Čingov for easy trail access.", "Slovak Paradise National Park"]
    ] },
  { id: "hungary", name: "Hungary", region: "Europe", currency: "Hungarian forint (HUF)", best: [4, 5, 6, 9, 10], w: "Hungarian Parliament Building",
    blurb: "Thermal baths, ruin bars and wine country, with cheap set lunches and some of the best-value cities in Central Europe.",
    route: "Budapest, Eger and Lake Balaton. 1 week.",
    places: [
      ["budapest", "Budapest", [24, 16, 5, 8], "city history", "Soak in the Széchenyi thermal bath, gaze across the Danube at the Parliament and drink in the ruin bars of the Jewish Quarter.", "Lunch menus (napi menü) are the cheap way to eat. Walk up to Fisherman's Bastion and Gellért Hill for free views.", "Széchenyi thermal bath"],
      ["eger", "Eger", [22, 15, 5, 4], "history food offbeat", "Baroque streets, a famous castle and wine cellars carved into the hillside at the Valley of Beautiful Women.", "Cellar wine tastings cost very little. Bring a bottle to fill with Bull's Blood straight from the barrel.", "Eger"],
      ["balaton", "Lake Balaton", [24, 16, 6, 4], "beach nature", "Swim in Central Europe's largest lake, then walk the lavender fields and abbey of the Tihany peninsula.", "Visit in June or September for lower prices. Many beaches charge a small fee, but some free public strands exist.", "Lake Balaton"]
    ] },
  { id: "slovenia", name: "Slovenia", region: "Europe", currency: "Euro (EUR)", best: [5, 6, 7, 8, 9], w: "Lake Bled",
    blurb: "Alpine lakes, show caves and a green little capital, easy to see in a week by bus with hostels and guesthouses everywhere.",
    route: "Ljubljana, Bled, Bohinj, the Soča valley and Piran. 1 week.",
    places: [
      ["ljubljana", "Ljubljana", [30, 18, 4, 4], "city", "A car-free riverside old town under a hilltop castle, full of bridges, café terraces and a weekly open-air food market.", "Many hostels include breakfast. In warm months, the Friday Open Kitchen food market is a cheap way to eat well.", "Ljubljana"],
      ["bled", "Bled & Bohinj", [32, 19, 6, 6], "nature trekking mountains", "Row out to the island church on Lake Bled, then swim and hike around quieter, wilder Lake Bohinj in the Julian Alps.", "Stay at Bohinj for lower prices. Try the cream cake in Bled and hike to Ojstrica viewpoint for free.", "Lake Bled"],
      ["soca", "Soča Valley", [30, 18, 8, 6], "offbeat nature trekking", "Go rafting or swim in the emerald Soča river, then walk to Kozjak waterfall inside its narrow rocky gorge.", "Base yourself in Bovec or Kobarid, where campsites and guesthouses are cheaper than around Lake Bled.", "Soča"]
    ] },
  { id: "croatia", name: "Croatia", region: "Europe", currency: "Euro (EUR)", best: [5, 6, 9, 10], w: "Plitvice Lakes National Park",
    blurb: "Island-hopping, old stone towns and the waterfall lakes of Plitvice, much cheaper outside July and August.",
    route: "Zagreb, Plitvice, Split, Hvar and Dubrovnik. 2 weeks.",
    places: [
      ["split", "Split", [32, 21, 6, 4], "history beach", "A lively city built inside a Roman emperor's palace, where locals still live, drink coffee and shop among ancient walls.", "Catamarans to the islands are cheaper booked early. Walk up Marjan hill for free views and swimming coves.", "Diocletian's Palace"],
      ["dubrovnik", "Dubrovnik", [43, 24, 6, 12], "history beach", "Walk the old city walls above the Adriatic, then swim off the rocks below the cliffs of the old town.", "Stay outside the old town in Lapad. Hike or take the bus up Mount Srđ instead of riding the cable car.", "Dubrovnik"],
      ["plitvice", "Plitvice Lakes", [32, 20, 10, 20], "nature", "Sixteen terraced lakes joined by waterfalls, crossed on wooden boardwalks through forest in Croatia's most famous national park.", "Tickets are cheaper outside June to September. Arrive at opening time for quieter boardwalks.", "Plitvice Lakes National Park"],
      ["vis", "Vis", [32, 20, 8, 5], "offbeat beach", "A remote island of quiet coves, family wineries and old military tunnels, with the Blue Cave on nearby Biševo.", "Ferries from Split run a couple of times a day. Rent a scooter to reach the beaches.", "Vis (island)"]
    ] },
  { id: "serbia", name: "Serbia", region: "Europe", currency: "Serbian dinar (RSD)", best: [5, 6, 7, 8, 9], w: "Belgrade Fortress",
    blurb: "Nightlife, river fortresses and some of Europe's lowest prices, with hearty grilled food and cheap hostels in Belgrade.",
    route: "Belgrade, Novi Sad, then the Drina and Tara mountains. 1 week.",
    places: [
      ["belgrade", "Belgrade", [15, 13, 3, 4], "city food", "Watch the sun set over two rivers from Belgrade Fortress, then party on splav nightclubs floating on the water.", "Grilled meat at kafanas is cheap and filling. Try ćevapi or a pljeskavica for the cost of a coffee back home.", "Belgrade Fortress"],
      ["novi-sad", "Novi Sad", [15, 13, 3, 3], "city culture", "Cafés spill onto the pastel streets of a relaxed old town, while Petrovaradin Fortress looks over the Danube.", "The EXIT festival in July makes prices jump. Otherwise, hostels here are cheaper than in Belgrade."],
      ["tara", "Tara National Park", [15, 12, 10, 2], "offbeat nature", "Look down into the Drina river canyon from forest viewpoints and see the famous little house on a rock in the river.", "Rent a car or join a tour from Belgrade. Mountain guesthouses serve home cooking at low prices.", "Tara National Park"]
    ] },
  { id: "kosovo", name: "Kosovo", region: "Europe", currency: "Euro (EUR)", best: [5, 6, 7, 8, 9], w: "Prizren",
    blurb: "Europe's youngest country, with Ottoman towns, strong macchiato, mountain trails and very low prices.",
    route: "Pristina, Prizren and the Rugova Canyon. 4 to 5 days.",
    places: [
      ["prizren", "Prizren", [13, 10, 3, 2], "history culture", "Ottoman mosques, an old stone bridge over the river and a hilltop fortress with views across the red rooftops.", "Try flija, a layered pancake, and macchiato for under €1. Climb to the fortress at sunset; it's free.", "Prizren"],
      ["pristina", "Pristina", [13, 10, 3, 2], "city offbeat", "Kosovo's capital runs on a young, buzzing café culture, with the Newborn monument and the striking National Library to see.", "One of the cheapest capitals in Europe, with good coffee and cheap hostels. Use it as a base for day trips."],
      ["rugova", "Rugova Canyon & Peja", [13, 10, 6, 3], "offbeat trekking mountains", "A deep limestone canyon near Peja, with via ferrata routes and a section of the Peaks of the Balkans hike.", "The Peaks of the Balkans trail crosses into Albania and Montenegro, so carry your passport and check border permits.", "Rugova Canyon"]
    ] },
  { id: "moldova", name: "Moldova", region: "Europe", currency: "Moldovan leu (MDL)", best: [5, 6, 9, 10], w: "Orheiul Vechi",
    blurb: "Europe's least-visited country, with enormous underground wine cellars, cliffside cave monasteries and very low prices.",
    route: "Chișinău, Orheiul Vechi and the Cricova or Mileștii Mici cellars. 4 days.",
    places: [
      ["chisinau", "Chișinău", [13, 10, 2, 3], "city offbeat", "Soviet-era architecture, leafy parks and a lively central market selling cheese, pickles and homemade wine in Moldova's capital.", "Minibuses cost cents across the city. Eat plăcinte, stuffed pastries, from bakeries for a filling cheap snack.", "Chișinău"],
      ["orheiul-vechi", "Orheiul Vechi", [16, 10, 4, 3], "offbeat history nature", "A cave monastery cut into a limestone cliff above a sweeping bend of the Răut river, surrounded by quiet countryside.", "Stay in a village guesthouse in Butuceni, where hosts often cook home meals with local wine.", "Orheiul Vechi"],
      ["cricova", "Cricova & Mileștii Mici", [13, 10, 4, 15], "offbeat food", "Underground wine cities with streets of cellars stretching for kilometers, holding millions of bottles beneath the countryside.", "Tours must be booked ahead. Group tours from Chișinău are often cheaper than going alone by taxi.", "Mileștii Mici (winery)"]
    ] },
  { id: "ukraine", name: "Ukraine", region: "Europe", currency: "Ukrainian hryvnia (UAH)", best: [5, 6, 9, 10], w: "Saint Sophia Cathedral, Kyiv",
    advisory: "Ukraine is at war after Russia's full-scale invasion. Most governments advise against all travel, and air travel is suspended.",
    blurb: "Golden-domed Kyiv, café-filled Lviv and the Carpathian mountains, a trip to plan for when travel is safe again.",
    route: "Lviv, Kyiv and the Carpathian mountains. 10 days, if travel becomes safe.",
    places: [
      ["kyiv", "Kyiv", [15, 10, 2, 4], "city history", "Golden-domed monasteries, Saint Sophia Cathedral and the candlelit cave passages of the Kyiv Pechersk Lavra.", "Air-raid alerts are frequent; follow local instructions. Check your government's travel advice before making any plans.", "Kyiv Pechersk Lavra"],
      ["lviv", "Lviv", [15, 10, 2, 4], "city history food", "Historic coffee houses, chocolate shops and a UNESCO-listed old town of churches and cobbled squares in western Ukraine.", "Lviv is reached by train from Poland. Check current travel advice first, since most governments advise against all travel.", "Lviv"],
      ["carpathians", "Ukrainian Carpathians", [12, 8, 4, 2], "mountains trekking offbeat", "Hoverla, the country's highest peak, wooden churches and Hutsul villages in the green Ukrainian Carpathians.", "Base yourself in Yaremche or Vorokhta once travel is advised again. Village guesthouses are the budget option.", "Hoverla"]
    ] },
  { id: "russia", name: "Russia", region: "Europe", currency: "Russian ruble (RUB)", best: [6, 7, 8, 9], w: "Saint Basil's Cathedral",
    advisory: "Most Western governments advise against all travel to Russia because of the war in Ukraine and the risk of arbitrary detention. Western bank cards don't work there.",
    blurb: "Moscow, St Petersburg and the Trans-Siberian railway, currently off-limits for many travelers because of official travel warnings.",
    route: "St Petersburg, Moscow and the Trans-Siberian to Lake Baikal. 3 weeks, if travel becomes viable.",
    places: [
      ["moscow", "Moscow", [20, 12, 2, 6], "city history", "Red Square, the onion domes of St Basil's Cathedral and metro stations decorated like palaces.", "Ride the metro to see the stations; one fare covers any distance. Check your government's travel advice before planning.", "Red Square"],
      ["st-petersburg", "St Petersburg", [20, 12, 2, 8], "city culture history", "The Hermitage's vast art collection, canals lined with palaces and the long white nights of June.", "The Hermitage is free on certain days. Note that Western bank cards don't work in Russia.", "Hermitage Museum"],
      ["baikal", "Lake Baikal", [20, 10, 10, 4], "offbeat nature", "The world's deepest lake, ringed by taiga and frozen so clear in winter that you can see through the ice.", "Olkhon Island is the classic base, with simple guesthouses. Check current travel advice before considering a trip.", "Lake Baikal"]
    ] },
  { id: "belarus", name: "Belarus", region: "Europe", currency: "Belarusian ruble (BYN)", best: [5, 6, 7, 8, 9], w: "Mir Castle Complex",
    advisory: "Many governments advise against all travel to Belarus because of its role in the war in Ukraine and the risk of arbitrary detention.",
    blurb: "Soviet-era Minsk, restored castles and old-growth forest, rarely visited and currently under strong travel warnings.",
    route: "Minsk, Mir and Nesvizh castles, then Brest. 5 days.",
    places: [
      ["minsk", "Minsk", [15, 10, 2, 3], "city offbeat", "Grand Stalinist avenues, spotless parks and Soviet-era monuments in a capital few travelers have seen.", "Bring cash; foreign cards often don't work. Check your government's travel advice before planning any visit.", "Minsk"],
      ["mir", "Mir & Nesvizh Castles", [15, 9, 5, 5], "history offbeat", "Two restored castles of the Radziwiłł family, Mir with its red-brick towers and Nesvizh with its palace and parkland.", "Visit both on one day trip from Minsk. Buses run to both towns, but a tour saves time.", "Mir Castle Complex"],
      ["brest", "Brest", [15, 9, 3, 3], "history offbeat", "The WWII Brest Fortress memorial and the edge of Belovezhskaya Pushcha, an old-growth forest home to European bison.", "The forest is shared with Poland's Białowieża, which is a safer and easier way to see it under current advice."]
    ] },
  { id: "lithuania", name: "Lithuania", region: "Europe", currency: "Euro (EUR)", best: [5, 6, 7, 8, 9], w: "Trakai Island Castle",
    blurb: "Baroque Vilnius, a red-brick island castle and the sand dunes of the Curonian Spit, all at friendly Baltic prices.",
    route: "Vilnius, Trakai and the Curonian Spit. 5 days.",
    places: [
      ["vilnius", "Vilnius", [20, 16, 3, 4], "city history", "Church spires and baroque courtyards fill the old town, and across the river lies Užupis, the self-declared artists' republic.", "Try cepelinai, potato dumplings, in local canteens. Free walking tours are a good first-day introduction.", "Vilnius Old Town"],
      ["trakai", "Trakai", [20, 16, 5, 5], "history nature", "A red-brick Gothic castle on a lake island, reached by wooden footbridges, with Karaim kibinai pastries to eat by the water.", "Easy day trip by bus from Vilnius. Walk around the lakeshore for free views of the castle.", "Trakai Island Castle"],
      ["curonian-spit", "Curonian Spit", [25, 19, 8, 4], "offbeat nature beach", "Huge drifting sand dunes, pine forests and empty Baltic beaches on a thin strip of land between lagoon and sea.", "Rent a bike in Nida and ride the forest cycle paths. Stay in Nida guesthouses outside July and August.", "Curonian Spit"]
    ] },
  { id: "latvia", name: "Latvia", region: "Europe", currency: "Euro (EUR)", best: [5, 6, 7, 8, 9], w: "Riga",
    blurb: "Art nouveau Riga, Baltic beaches at Jūrmala and the forests and castles of Gauja National Park, all on a budget.",
    route: "Riga, Jūrmala and Gauja National Park. 4 days.",
    places: [
      ["riga", "Riga", [20, 16, 3, 4], "city history", "Ornate art nouveau facades and a huge central market housed in old Zeppelin hangars, selling smoked fish and rye bread.", "Eat at Lido buffets for cheap Latvian food. The Central Market sells picnic supplies for much less.", "Riga Central Market"],
      ["gauja", "Gauja National Park", [20, 16, 6, 4], "offbeat nature trekking", "Sandstone cliffs, medieval castles at Sigulda and Turaida, and lazy canoe trips down the Gauja river.", "Trains from Riga take about an hour. Hiking trails between the castles are free to walk.", "Gauja National Park"]
    ] },
  { id: "estonia", name: "Estonia", region: "Europe", currency: "Euro (EUR)", best: [5, 6, 7, 8, 9], w: "Tallinn Old Town",
    blurb: "A medieval walled capital, boardwalk bog walks and windmill-dotted islands, cheaper than its Nordic neighbors.",
    route: "Tallinn, Lahemaa and Saaremaa. 5 days.",
    places: [
      ["tallinn", "Tallinn", [28, 18, 2, 4], "city history", "One of Europe's best-preserved medieval old towns, with city walls, towers and rooftop views from Toompea hill.", "Public transport is free for residents and cheap for visitors. Walk the Old Town; it's compact and free to explore.", "Tallinn Old Town"],
      ["lahemaa", "Lahemaa & Soomaa", [25, 17, 5, 3], "offbeat nature trekking", "Boardwalk trails across raised bogs, old manor houses and a forest coast strewn with boulders.", "Soomaa's 'fifth season' floods in spring are best seen by canoe. Lahemaa's bog trails are free to walk.", "Lahemaa National Park"],
      ["saaremaa", "Saaremaa", [28, 17, 5, 3], "offbeat nature", "Windmills, juniper meadows, a meteorite crater at Kaali and the stone castle of Kuressaare on Estonia's biggest island.", "Buses connect with the ferry from the mainland. Rent a bike in Kuressaare to explore the flat island.", "Saaremaa"]
    ] },
  { id: "finland", name: "Finland", region: "Europe", currency: "Euro (EUR)", best: [6, 7, 8, 12, 1, 2, 3], w: "Aurora borealis",
    blurb: "Saunas, lakes and Lapland's northern lights, best done on a budget with free camping, wilderness huts and cooking your own meals.",
    route: "Helsinki, the Lakeland and Lapland. 10 days.",
    places: [
      ["helsinki", "Helsinki", [38, 25, 6, 4], "city culture", "Nordic design shops, public saunas by the sea and a ferry out to the Suomenlinna island fortress.", "Public saunas like Löyly or Allas are worth a visit. The Suomenlinna ferry is part of the regular public transport network.", "Suomenlinna"],
      ["lapland", "Rovaniemi & Lapland", [43, 28, 16, 15], "nature offbeat", "Northern lights over snowy forest in winter, reindeer farms and the midnight sun in summer around Rovaniemi.", "Everyman's right lets you camp almost anywhere. Hunt for the aurora yourself just outside town instead of booking a tour.", "Rovaniemi"],
      ["lakeland", "Finnish Lakeland", [38, 22, 10, 3], "nature trekking", "Thousands of lakes, forest cabins and kayaking, with the classic view over Lake Pielinen from Koli National Park.", "Free wilderness huts are open to hikers. Pick wild berries in late summer, which everyman's right allows.", "Koli National Park"]
    ] },
  { id: "sweden", name: "Sweden", region: "Europe", currency: "Swedish krona (SEK)", best: [6, 7, 8], w: "Gamla stan",
    blurb: "Archipelagos, forests and right-to-roam camping in a pricey country, made affordable with lunch deals and free nature.",
    route: "Stockholm, Gothenburg and the Kungsleden trail in Lapland. 10 days.",
    places: [
      ["stockholm", "Stockholm", [43, 28, 8, 6], "city history", "Wander the old lanes of Gamla Stan, then ride public ferries out to the islands of the Stockholm archipelago.", "Lunch specials (dagens lunch) are the cheap way to eat out, often with salad, bread and coffee included.", "Gamla stan"],
      ["kungsleden", "Kungsleden", [22, 28, 16, 5], "trekking mountains offbeat", "The King's Trail, a classic hut-to-hut hike through the mountains, valleys and birch forests of Arctic Lapland.", "Free camping is allowed; huts charge a fee. Carry your food, as hut shops are limited and expensive.", "Kungsleden"],
      ["gothenburg", "Gothenburg", [38, 25, 6, 4], "city beach", "A relaxed port city of cafés and fika, with car-free archipelago islands for swimming and rocky coastal walks.", "Tram tickets include the archipelago ferries, so an island day trip costs no more than a ride across town.", "Gothenburg archipelago"]
    ] },
  { id: "norway", name: "Norway", region: "Europe", currency: "Norwegian krone (NOK)", best: [6, 7, 8], w: "Preikestolen",
    blurb: "The most dramatic fjords anywhere, at very high prices, so camping, cooking and free hiking help a lot on a budget.",
    route: "Oslo, Bergen and the fjords, then the Lofoten Islands. 2 weeks.",
    places: [
      ["bergen", "Bergen & the Fjords", [48, 30, 16, 6], "nature trekking", "Colorful Bryggen wharf, Norway in a Nutshell fjord scenery and the famous hikes to Preikestolen and Trolltunga.", "Buy groceries and cook. Hiking is free, and Bergen's hills like Fløyen can be climbed on foot.", "Preikestolen"],
      ["lofoten", "Lofoten Islands", [43, 30, 16, 4], "nature trekking offbeat", "Jagged peaks rising straight from the sea above red fishing cabins, white beaches and drying racks of cod.", "Wild camping is free; rorbu cabins are expensive. Hike Reinebringen for the classic view without paying a cent.", "Lofoten"],
      ["tromso", "Tromsø", [48, 30, 10, 15], "nature city", "An Arctic city famous for northern lights in winter and midnight sun in summer, ringed by fjords and mountains.", "Chase the aurora yourself by bus to dark spots outside town. Hike up to the Fjellheisen viewpoint instead of riding.", "Tromsø"]
    ] },
  { id: "denmark", name: "Denmark", region: "Europe", currency: "Danish krone (DKK)", best: [5, 6, 7, 8, 9], w: "Nyhavn",
    blurb: "Bikes, harbor swims and Danish design in an expensive but easy country, with free nature shelters for camping.",
    route: "Copenhagen and the white cliffs of Møn. 4 days.",
    places: [
      ["copenhagen", "Copenhagen", [50, 30, 6, 4], "city food", "Colorful Nyhavn harbor, free harbor baths for a swim and the alternative streets of Christiania.", "Swim in the free harbor baths. Street food markets are cheaper than restaurants, and bikes beat public transport.", "Nyhavn"],
      ["mon", "Møns Klint", [44, 27, 13, 2], "offbeat nature", "White chalk cliffs above a turquoise Baltic sea, beech forest trails and dark sky stargazing on the island of Møn.", "Free basic wooden shelters across Denmark can be used for overnight camping. Bring food, as shops are few.", "Møns Klint"]
    ] },
  { id: "iceland", name: "Iceland", region: "Europe", currency: "Icelandic króna (ISK)", best: [6, 7, 8, 9], w: "Skógafoss",
    blurb: "Waterfalls, glaciers and hot rivers, very expensive but possible on a budget with campsites, supermarkets and road trips.",
    route: "Reykjavík, the Golden Circle and the south coast, or the full Ring Road. 10 days.",
    places: [
      ["reykjavik", "Reykjavík", [68, 34, 10, 6], "city", "A colorful small capital with geothermal pools, the Hallgrímskirkja church and the start of every Ring Road trip.", "Shop at Bónus supermarkets. Bring a water bottle; tap water is excellent. Local swimming pools are cheap.", "Reykjavík"],
      ["south-coast", "Iceland's South Coast", [41, 27, 31, 3], "nature trekking", "Walk behind Seljalandsfoss, stand on black sand beaches at Reynisfjara and watch icebergs drift in Jökulsárlón glacier lagoon.", "Campervans or campsites save a lot over guesthouses. Cook your own food, as roadside restaurants are expensive.", "Jökulsárlón"],
      ["landmannalaugar", "Landmannalaugar", [41, 27, 19, 3], "offbeat trekking nature", "Rhyolite mountains streaked in red and gold, a natural hot spring to soak in and the start of the Laugavegur trail.", "Highland buses run only in summer. Camp at Landmannalaugar and bring your own food, since there's little to buy.", "Landmannalaugar"]
    ] },
  { id: "malta", name: "Malta", region: "Europe", currency: "Euro (EUR)", best: [4, 5, 6, 9, 10], w: "Valletta",
    blurb: "A tiny island nation of golden stone cities, prehistoric temples and clear-water swimming spots, easy to explore by bus.",
    route: "Valletta, Mdina and a few days on Gozo. 5 days.",
    places: [
      ["valletta", "Valletta", [28, 18, 4, 6], "history city", "Honey-colored stone, baroque churches and fortress walls, with the Upper Barrakka Gardens looking over the Grand Harbour.", "Buses go everywhere for a flat fare. Eat pastizzi, flaky cheese or pea pastries, for a cheap snack.", "Valletta"],
      ["gozo", "Gozo", [28, 18, 4, 3], "offbeat beach nature", "Quiet coves, centuries-old salt pans, the Ġgantija temples and some of the Mediterranean's best diving.", "The ferry from Ċirkewwa is cheap and frequent. Stay in a farmhouse guesthouse for better value than Malta's resorts.", "Gozo"]
    ] },
  { id: "cyprus", name: "Cyprus", region: "Europe", currency: "Euro (EUR)", best: [4, 5, 6, 9, 10], w: "Kourion",
    blurb: "Beaches, Roman mosaics and painted mountain churches on a divided island with cheap buses and good-value food.",
    route: "Nicosia, the Troodos mountains and Paphos. 1 week.",
    places: [
      ["nicosia", "Nicosia", [28, 18, 4, 3], "city history offbeat", "Split between two sides and crossable on foot, this walled capital has Venetian ramparts, old caravanserais and busy markets.", "Bring your passport for the Ledra Street crossing. Food on the northern side is often cheaper.", "Nicosia"],
      ["paphos", "Paphos", [31, 19, 5, 5], "history beach", "Roman floor mosaics in the archaeological park, sea caves along the coast and the rock-cut Tombs of the Kings.", "Intercity buses are cheap. The sea caves and many beaches are free to visit.", "Paphos Archaeological Park"],
      ["troodos", "Troodos Mountains", [28, 18, 8, 3], "offbeat trekking", "Painted Byzantine churches hidden in mountain villages and cool pine forest trails near Mount Olympus.", "Rent a car to see the villages. Village tavernas serve meze at fair prices.", "Troodos Mountains"]
    ] }
]);
