// Africa. Costs are rough budget-travel estimates in USD per person per day.
window.addCountries([
  { id: "algeria", name: "Algeria", region: "North Africa", currency: "Algerian dinar (DZD)", best: [10, 11, 12, 1, 2, 3, 4], w: "Tassili n'Ajjer",
    blurb: "Africa's biggest country pairs Roman ruins like Timgad with the Sahara's wildest scenery, from Algiers' old casbah to the rock art and dunes of Tassili n'Ajjer, all with very few tourists.",
    route: "Algiers, Constantine, Timgad, then fly south to Djanet. 2 weeks.",
    places: [
      ["algiers", "Algiers", [25, 8, 3, 4], "city history offbeat", "Whitewashed Ottoman lanes of the Casbah of Algiers tumble down to the bay, past old palaces, mosques and tiny cafés serving strong mint tea.", "Bring cash in euros and change it once you arrive, since cards are rarely accepted. A local guide makes the Casbah's maze far easier to navigate.", "Casbah of Algiers"],
      ["djanet", "Djanet & Tassili n'Ajjer", [30, 10, 20, 20], "offbeat nature trekking", "Deep in the Sahara, Tassili n'Ajjer hides thousands of prehistoric rock paintings among sandstone forests, arches and rolling orange dunes.", "A licensed agency must arrange your desert trip. Join a small group departure from Djanet so the guide, cook and 4x4 costs are shared.", "Tassili n'Ajjer"],
      ["timgad", "Timgad & Constantine", [25, 8, 6, 4], "history offbeat", "Walk the near-complete Roman grid streets of Timgad, then cross the dizzying bridges that span the gorge running through Constantine.", "Few tourists visit, so sites are often empty. Base yourself in Batna for cheap hotels and take a shared taxi out to the ruins.", "Timgad"]
    ] },
  { id: "libya", name: "Libya", region: "North Africa", currency: "Libyan dinar (LYD)", best: [10, 11, 12, 1, 2, 3], w: "Leptis Magna",
    advisory: "Most governments advise against all travel to Libya because of armed conflict, terrorism and kidnapping.",
    blurb: "Libya holds some of the best-preserved Roman cities in the world, including Leptis Magna, and the oasis town of Ghadames. Travel is currently advised against, so check official guidance first.",
    route: "Tripoli, Leptis Magna and Ghadames, only with a specialist operator.",
    places: [
      ["leptis-magna", "Leptis Magna", [30, 10, 15, 10], "history offbeat", "A vast Roman city on the Mediterranean shore, with a seaside theatre, a grand basilica and marble-paved streets that see almost no visitors.", "Visits are arranged through specialist operators. Check your government's travel advice first, as most currently advise against all travel to Libya.", "Leptis Magna"],
      ["ghadames", "Ghadames", [30, 10, 20, 5], "history offbeat", "Known as the 'pearl of the desert', this covered mud-brick oasis town has shaded passageways and rooftop walkways once used only by women.", "Access depends on the security situation. Only consider going with a licensed operator once official travel advice allows it.", "Ghadames"]
    ] },
  { id: "sudan", name: "Sudan", region: "North Africa", currency: "Sudanese pound (SDG)", best: [11, 12, 1, 2], w: "Meroë",
    advisory: "Sudan is in civil war, and most governments advise against all travel.",
    blurb: "Sudan has more pyramids than Egypt, standing alone in the desert at Meroë and Jebel Barkal. The country is in civil war, so this is a trip for when travel is safe again.",
    route: "Khartoum, the Meroë pyramids and Karima. 10 days, if travel becomes safe.",
    places: [
      ["meroe", "Meroë Pyramids", [20, 8, 15, 10], "history offbeat", "Over 200 steep Nubian pyramids rise from the sand dunes at Meroë, the royal burial ground of the ancient Kingdom of Kush.", "Visits depend entirely on the security situation. Sudan is in civil war and most governments advise against all travel, so wait until that changes.", "Meroë"],
      ["karima", "Karima & Jebel Barkal", [20, 8, 10, 5], "history offbeat", "Jebel Barkal, a flat-topped sacred mountain, watches over Egyptian-era temples and a field of royal Kushite pyramids beside the Nile.", "Usually visited with Meroë on a loop from Khartoum, but only once official travel advice says it is safe to go.", "Jebel Barkal"]
    ] },
  { id: "kenya", name: "Kenya", region: "Sub-Saharan Africa", currency: "Kenyan shilling (KES)", best: [1, 2, 7, 8, 9, 10], w: "Maasai Mara",
    blurb: "Classic safari country on a budget, with cheap camping safaris to the Maasai Mara, cycling among zebras at Hell's Gate and a laid-back Swahili coast in Lamu and Diani.",
    route: "Nairobi, a camping safari in the Maasai Mara, then the coast at Diani and Lamu. 2 weeks.",
    places: [
      ["nairobi", "Nairobi", [15, 8, 4, 6], "city nature", "Giraffes graze against a skyline backdrop in Nairobi National Park, and baby elephants come in for their morning feed at the elephant orphanage.", "Use matatus (minibuses) by day and taxis at night. Book the elephant orphanage's morning visiting hour ahead, as it is short and popular.", "Nairobi National Park"],
      ["maasai-mara", "Maasai Mara", [25, 10, 20, 130], "nature", "Lions, cheetahs and leopards stalk the open savanna, and the wildebeest migration thunders across the Mara River from July to October.", "Budget camping safaris from Nairobi include food and park fees. Three-day trips are the best value, as the long drive eats into shorter ones.", "Maasai Mara"],
      ["lamu", "Lamu", [18, 8, 4, 4], "offbeat culture beach", "No cars here, just donkeys, dhows and carved wooden doors on coral-stone houses in a centuries-old Swahili town on the Indian Ocean.", "Dhow sailing trips are cheap if you share. Join other travellers for a sunset sail or a snorkeling day with a grilled fish lunch.", "Lamu Old Town"],
      ["hells-gate", "Hell's Gate & Naivasha", [15, 8, 5, 25], "nature offbeat", "Ride a bike past zebras, buffalo and giraffes, then hike down into a red-walled gorge, an easy day trip from Lake Naivasha.", "One of the few parks you can explore by bike. Rent one at the gate or in Naivasha instead of hiring a car.", "Hell's Gate National Park"]
    ] },
  { id: "tanzania", name: "Tanzania", region: "Sub-Saharan Africa", currency: "Tanzanian shilling (TZS)", best: [1, 2, 6, 7, 8, 9, 10], w: "Mount Kilimanjaro",
    blurb: "Climb Kilimanjaro, watch the Serengeti's great herds and wander Zanzibar's Stone Town. Park fees are the main cost, so shared camping safaris from Arusha keep Tanzania affordable.",
    route: "Arusha, a safari to Ngorongoro and Tarangire, then Zanzibar. 2 weeks.",
    places: [
      ["zanzibar", "Zanzibar", [18, 10, 4, 6], "beach culture history", "Get lost in Stone Town's carved-door alleys and spice markets, then head to the powder-white beaches and turquoise lagoons of the east coast.", "Eat at the Forodhani night food market for cheap grilled seafood and Zanzibar pizza. Shared dala-dala minibuses reach the beaches for very little.", "Stone Town"],
      ["ngorongoro", "Ngorongoro & Serengeti", [25, 10, 25, 140], "nature", "Black rhinos, lions and flamingos crowd the floor of Ngorongoro Crater, while the endless Serengeti plains host the great wildebeest migration.", "Park fees are high. Budget camping safaris start in Arusha, and joining a group to fill the vehicle cuts the cost per person.", "Ngorongoro Crater"],
      ["kilimanjaro", "Kilimanjaro", [10, 10, 5, 250], "trekking mountains", "Africa's highest peak, 5,895 m, climbed in 6 to 8 days from rainforest through alpine desert to the glaciers near Uhuru Peak.", "Total cost is usually $1,800 or more with fees, guides and porters. Pick a licensed operator that treats porters fairly, and take a longer route for acclimatization.", "Mount Kilimanjaro"],
      ["usambara", "Usambara Mountains", [12, 7, 4, 6], "offbeat trekking", "Hike between farming villages and dramatic viewpoints in cool, green hills, a refreshing break from safari dust and coastal heat.", "Lushoto has community-run guides and cheap lodges. Guided village walks support local projects and cost less than most safari add-ons.", "Usambara Mountains"]
    ] },
  { id: "uganda", name: "Uganda", region: "Sub-Saharan Africa", currency: "Ugandan shilling (UGX)", best: [6, 7, 8, 12, 1, 2], w: "Murchison Falls",
    blurb: "Track mountain gorillas in Bwindi, raft the Nile near its source at Jinja and swim in Fort Portal's crater lakes. Uganda is green, friendly and good value outside the permit fees.",
    route: "Jinja, Murchison Falls, Fort Portal, then Bwindi for gorillas. 2 weeks.",
    places: [
      ["jinja", "Jinja", [12, 7, 3, 15], "nature", "Big-volume white-water rafting on the Nile near its source, plus kayaking, river tubing and sunset cruises from riverside camps.", "Rafting trips usually include lunch and a free dorm night. Book directly with a Jinja operator rather than through an agent in Kampala.", "Jinja, Uganda"],
      ["bwindi", "Bwindi", [20, 10, 15, 15], "nature trekking", "Push through steep, misty rainforest to spend a quiet hour beside a family of mountain gorillas in Bwindi Impenetrable National Park.", "The gorilla permit is a one-off $800 on top of daily costs; add it as an experience and book well ahead. Community-run guesthouses near the park gates are cheapest.", "Bwindi Impenetrable National Park"],
      ["fort-portal", "Fort Portal crater lakes", [12, 7, 4, 4], "offbeat nature", "Swim in clear crater lakes ringed by tea plantations, then track chimpanzees in Kibale's forest just down the road.", "Stay at a lakeside camp near Kasenda. Walking or cycling between the crater lakes costs nothing and the views are excellent.", "Fort Portal"]
    ] },
  { id: "rwanda", name: "Rwanda", region: "Sub-Saharan Africa", currency: "Rwandan franc (RWF)", best: [6, 7, 8, 12, 1, 2], w: "Lake Kivu",
    blurb: "Clean, compact and green, Rwanda packs gorillas, volcanoes, chimp forests and lakeside towns into short bus rides, with Kigali's calm, hilly streets as an easy, safe base.",
    route: "Kigali, Lake Kivu and Nyungwe Forest. 1 week.",
    places: [
      ["kigali", "Kigali", [15, 8, 3, 3], "city history", "The moving Kigali Genocide Memorial anchors a calm, spotless capital of green hills, craft coffee shops and lively Kimironko market.", "Moto taxis are cheap; drivers carry a spare helmet. Entry to the Genocide Memorial is free, though a donation is appreciated.", "Kigali Genocide Memorial"],
      ["lake-kivu", "Lake Kivu", [15, 8, 4, 4], "nature beach", "Swim, kayak and watch fishermen sing as they row out at dusk from Gisenyi and Kibuye, linked by the hilly Congo Nile Trail.", "Hike or bike sections of the Congo Nile Trail, sleeping in simple guesthouses along the way. Public buses link the lakeside towns cheaply.", "Lake Kivu"],
      ["nyungwe", "Nyungwe Forest", [20, 10, 8, 50], "nature trekking offbeat", "Sway on a canopy walkway high above old-growth rainforest, and track chimpanzees and colobus monkeys on misty morning trails.", "Activities are priced per person; book through the park. Pick one headline activity, then add free-to-walk trails for the rest of your stay.", "Nyungwe National Park"]
    ] },
  { id: "south-africa", name: "South Africa", region: "Sub-Saharan Africa", currency: "South African rand (ZAR)", best: [10, 11, 12, 1, 2, 3, 4], w: "Table Mountain",
    blurb: "Hike Table Mountain in Cape Town, drive the Garden Route, climb into the Drakensberg and self-drive safari in Kruger. South Africa has great hostels and is easy on a budget.",
    route: "Cape Town, the Garden Route, Drakensberg and Kruger. 3 weeks.",
    places: [
      ["cape-town", "Cape Town", [22, 14, 6, 6], "city nature trekking", "Climb Table Mountain, drive out to Cape Point's penguins and cliffs, and wander the candy-colored houses of Bo-Kaap.", "Hike Table Mountain instead of taking the cable car. Platteklip Gorge is the classic route; go early, with water and a friend.", "Table Mountain"],
      ["garden-route", "Garden Route", [20, 14, 12, 6], "nature beach", "Coastal forests, lagoons and wild beaches line this famous road trip, home to the multi-day Otter Trail hike and Tsitsikamma's suspension bridge.", "The Baz Bus hop-on service links hostels along the route. Book the Otter Trail months ahead, as permits sell out.", "Garden Route"],
      ["drakensberg", "Drakensberg", [18, 12, 10, 5], "trekking mountains", "Hike beneath the towering Amphitheatre cliffs, find ancient San rock art in sandstone shelters and cool off in mountain streams.", "Hike the Tugela Falls chain ladders from Sentinel car park. Hostels at the foot of the range offer cheap shuttles to the trailheads.", "Drakensberg"],
      ["kruger", "Kruger National Park", [22, 14, 25, 30], "nature", "Self-drive safaris with all of the Big Five, from sunrise game drives to braai dinners at fenced rest camps.", "Rent a car and stay in park campsites. Bring your own food from a supermarket outside the gate, as camp shops are pricier.", "Kruger National Park"]
    ] },
  { id: "namibia", name: "Namibia", region: "Sub-Saharan Africa", currency: "Namibian dollar (NAD)", best: [5, 6, 7, 8, 9, 10], w: "Deadvlei",
    blurb: "Red dunes at Sossusvlei, rhinos at Etosha's waterholes and long empty roads. Namibia is best seen on a budget by splitting a rental car and camping under huge desert skies.",
    route: "Windhoek, Sossusvlei, Swakopmund and Etosha. 2 weeks.",
    places: [
      ["sossusvlei", "Sossusvlei", [20, 12, 30, 10], "nature", "Climb towering red dunes at sunrise, then walk across the cracked white clay of Deadvlei among its ghostly, centuries-old dead trees.", "Camp inside the park gate to reach the dunes for sunrise. Bring plenty of water, as the walk into Deadvlei gets hot fast.", "Sossusvlei"],
      ["swakopmund", "Swakopmund", [18, 12, 6, 10], "beach nature", "Sandboard down coastal dunes, kayak with seals and spot shipwrecks on the Skeleton Coast from a breezy town of German-era buildings.", "Book adventure activities through your hostel, which often get group rates. Stock up on supplies here before heading back inland.", "Swakopmund"],
      ["etosha", "Etosha", [20, 12, 30, 8], "nature", "Elephants, black rhinos and lions gather at the waterholes on a vast white salt pan, perfect for slow self-drive safaris.", "Floodlit waterholes at the rest camps are great at night, and watching from a bench costs nothing extra once you're staying inside.", "Etosha National Park"]
    ] },
  { id: "botswana", name: "Botswana", region: "Sub-Saharan Africa", currency: "Botswana pula (BWP)", best: [5, 6, 7, 8, 9, 10], w: "Okavango Delta",
    blurb: "Botswana is high-end safari country, but budget mokoro trips into the Okavango Delta, self-drive camping in Chobe and tours to the salt pans keep it within reach.",
    route: "Maun and the Okavango Delta, then Chobe. 10 days.",
    places: [
      ["okavango", "Okavango Delta", [20, 10, 10, 60], "nature offbeat", "Glide through papyrus channels in a dugout mokoro canoe, camping on islands and walking with a guide to spot elephants and hippos.", "Budget mokoro trips leave from Maun and include camping. Bring your own food and sleeping bag to keep the price down.", "Okavango Delta"],
      ["chobe", "Chobe & Kasane", [20, 12, 6, 40], "nature", "Huge elephant herds come down to drink while you drift past on a Chobe River sunset cruise, often with hippos and crocodiles nearby.", "Kasane is a short trip from Victoria Falls. Riverfront boat cruises are usually cheaper than game drives and get closer to the elephants.", "Chobe National Park"],
      ["makgadikgadi", "Makgadikgadi Pans", [25, 12, 20, 20], "offbeat nature", "Endless white salt pans stretch to the horizon, with habituated meerkat colonies and nights sleeping out under a sky full of stars.", "Easier with a tour from Gweta. Visit in the dry season, when the pans are firm and the meerkats are most active.", "Makgadikgadi Pan"]
    ] },
  { id: "zimbabwe", name: "Zimbabwe", region: "Sub-Saharan Africa", currency: "US dollar and ZiG (ZWG)", best: [5, 6, 7, 8, 9, 10], w: "Victoria Falls",
    blurb: "Zimbabwe has the best views of Victoria Falls, the medieval stone city of Great Zimbabwe and some of Africa's finest walking safaris along the Zambezi at Mana Pools.",
    route: "Victoria Falls, Hwange and Great Zimbabwe. 10 days.",
    places: [
      ["vic-falls", "Victoria Falls", [18, 12, 4, 30], "nature", "One of the world's largest waterfalls, seen from rainforest paths opposite the main falls as spray drifts across the gorge.", "The KAZA visa covers Zimbabwe and Zambia. Bring a rain jacket or expect to get soaked in high-water season.", "Victoria Falls"],
      ["great-zimbabwe", "Great Zimbabwe", [15, 8, 8, 15], "history offbeat", "Massive dry-stone walls, a mysterious conical tower and a hilltop complex reveal a medieval city that once traded gold across the Indian Ocean.", "Stay near Masvingo, or camp at the site itself for quiet early-morning walks. A local guide adds a lot of context.", "Great Zimbabwe"],
      ["mana-pools", "Mana Pools", [25, 10, 25, 25], "offbeat nature", "Walking safaris along the Zambezi floodplain, where elephants stand on hind legs to reach acacia pods.", "Self-drive and camp, or join a tour from Harare. Book campsites well ahead, as numbers are limited.", "Mana Pools National Park"]
    ] },
  { id: "zambia", name: "Zambia", region: "Sub-Saharan Africa", currency: "Zambian kwacha (ZMW)", best: [5, 6, 7, 8, 9, 10], w: "South Luangwa National Park",
    blurb: "Zambia offers wild walking safaris in South Luangwa and the other side of Victoria Falls at Livingstone, with rafting, Devil's Pool swims and cheap camps by the parks.",
    route: "Livingstone, Lusaka and South Luangwa. 10 days.",
    places: [
      ["livingstone", "Livingstone", [15, 10, 4, 25], "nature", "Swim at the very lip of Victoria Falls in Devil's Pool, then raft or bungee the Zambezi gorge from this relaxed adventure town.", "Devil's Pool is only open in the dry season. Hostels in town run free shuttles to the falls and book activities at fair prices.", "Livingstone, Zambia"],
      ["south-luangwa", "South Luangwa", [20, 10, 15, 40], "nature offbeat", "The birthplace of the walking safari, rich in leopards, with hippo-packed lagoons and elephants wandering right through the camps.", "Budget camps sit just outside the park gate. Join their shared game drives, and night drives are the best chance to see leopards.", "South Luangwa National Park"]
    ] },
  { id: "mozambique", name: "Mozambique", region: "Sub-Saharan Africa", currency: "Mozambican metical (MZN)", best: [5, 6, 7, 8, 9, 10, 11], w: "Ilha de Moçambique",
    blurb: "Mozambique has long Indian Ocean beaches, whale sharks off Tofo, dhow trips to the Bazaruto islands and the historic coral-stone town of Ilha de Moçambique.",
    route: "Maputo, Tofo, Vilanculos and the Bazaruto islands. 2 weeks.",
    places: [
      ["tofo", "Tofo", [15, 10, 4, 25], "beach nature", "Diving and snorkeling with whale sharks and manta rays off a laid-back surf village with fresh seafood and beach-shack bars.", "Ocean safaris are cheaper than full dive trips and still find whale sharks. The fresh fish market in town is great for cheap meals.", "Tofo"],
      ["ilha", "Ilha de Moçambique", [15, 8, 5, 4], "offbeat history", "A coral-stone island town that was once the colonial capital, with crumbling palaces, a hulking fort and fishing dhows at sunset.", "Reached by a long bridge from the mainland. Stay in a small guesthouse in Stone Town and eat grilled fish at the local stalls.", "Island of Mozambique"],
      ["vilanculos", "Vilanculos & Bazaruto", [18, 10, 4, 20], "beach nature", "Sail a wooden dhow out to turquoise sandbanks and giant dunes in the Bazaruto Archipelago, snorkeling coral reefs along the way.", "Share a dhow trip to cut the cost. Day trips with lunch on the beach are much cheaper than staying on the islands.", "Bazaruto Archipelago"]
    ] },
  { id: "ghana", name: "Ghana", region: "Sub-Saharan Africa", currency: "Ghanaian cedi (GHS)", best: [11, 12, 1, 2, 3], w: "Cape Coast Castle",
    blurb: "Friendly, English-speaking and an easy start to West Africa, Ghana mixes Accra's markets and beach bars, the Cape Coast castles and the waterfalls and hills of the Volta Region.",
    route: "Accra, Cape Coast, Kakum and the Volta region. 2 weeks.",
    places: [
      ["accra", "Accra", [15, 8, 3, 4], "city food culture", "Bargain at Makola market, climb Jamestown's red-and-white lighthouse and finish at the beach bars with grilled tilapia and banku.", "Tro-tros (shared minibuses) cost very little. Street food like kelewele and waakye makes a filling, cheap lunch.", "Jamestown, Accra"],
      ["cape-coast", "Cape Coast", [15, 8, 3, 8], "history beach", "The slave castles of Cape Coast and Elmina tell a sobering history, while Kakum's canopy walkway sways high above the rainforest.", "Book a guided tour at the castle, which is included with entry. Kakum is an easy day trip from Cape Coast by tro-tro.", "Cape Coast Castle"],
      ["volta", "Volta Region", [12, 7, 4, 4], "offbeat nature trekking", "Hike to the twin Wli waterfalls, feed mona monkeys at Tafi Atome and climb Mount Afadja for views across the green hills.", "Hohoe is a good base. Community-run sanctuaries charge small fees that go straight back to the villages.", "Wli Waterfalls"]
    ] },
  { id: "senegal", name: "Senegal", region: "Sub-Saharan Africa", currency: "West African CFA franc (XOF)", best: [11, 12, 1, 2, 3, 4, 5], w: "Gorée",
    blurb: "Senegal blends mbalax music, Atlantic surf, the island of Gorée and the colonial charm of Saint-Louis, with mangrove channels in the Sine-Saloum Delta to slow things down.",
    route: "Dakar and Gorée, Saint-Louis, then the Sine-Saloum delta. 2 weeks.",
    places: [
      ["dakar", "Dakar & Gorée", [20, 8, 3, 4], "city history beach", "Catch live mbalax music after dark, surf the breaks at Ngor and Yoff, and wander the pastel colonial lanes of Gorée island.", "Ferries to Gorée are frequent and cheap. Eat thieboudienne, the national fish and rice dish, at local lunch spots.", "Gorée"],
      ["saint-louis", "Saint-Louis", [18, 8, 4, 4], "history offbeat", "A faded colonial island town of balconied houses, plus pelicans and flamingos by the thousand at the Djoudj bird reserve.", "Visit during the jazz festival in May, but book early. Horse-drawn carriage tours of the island are cheap if you bargain.", "Saint-Louis, Senegal"],
      ["sine-saloum", "Sine-Saloum Delta", [18, 8, 5, 6], "offbeat nature", "Paddle by pirogue through mangrove channels to shell islands, baobab-dotted villages and fishing communities where life moves with the tides.", "Arrange pirogue trips from Toubacouta or Palmarin. Simple campements with half board are the best-value places to stay.", "Sine-Saloum Delta"]
    ] },
  { id: "nigeria", name: "Nigeria", region: "Sub-Saharan Africa", currency: "Nigerian naira (NGN)", best: [11, 12, 1, 2], w: "Lekki Conservation Centre",
    advisory: "Many governments advise against travel to parts of Nigeria, especially the north and the Niger Delta, because of terrorism and kidnapping.",
    blurb: "Africa's most populous country offers Lagos's energy, Afrobeats and art scene, plus Yoruba heritage at the Osun sacred grove. Some regions carry travel warnings, so check current advice first.",
    route: "Lagos and Osogbo's sacred grove. 1 week.",
    places: [
      ["lagos", "Lagos", [25, 10, 5, 5], "city food culture", "Afrobeats nightlife, contemporary art galleries and the Lekki canopy walk, plus some of West Africa's best jollof and suya.", "Traffic is heavy, so plan short daily distances. Stick to well-known neighborhoods and use ride-hailing apps rather than street taxis.", "Lagos"],
      ["osogbo", "Osun-Osogbo Sacred Grove", [15, 6, 5, 5], "offbeat culture", "A forest of shrines and sculptures sacred to the Yoruba goddess Osun, along a quiet river, and a UNESCO World Heritage Site.", "Visit during the Osun festival in August for processions and drumming. Check current travel advice for the route from Lagos.", "Osun-Osogbo"]
    ] },
  { id: "cameroon", name: "Cameroon", region: "Sub-Saharan Africa", currency: "Central African CFA franc (XAF)", best: [11, 12, 1, 2, 3], w: "Mount Cameroon",
    advisory: "Many governments advise against travel to the north and English-speaking regions of Cameroon because of conflict.",
    blurb: "'Africa in miniature', with a volcano, black-sand beaches and rainforest. Parts of the country carry travel warnings, so stick to areas like Limbe and Kribi and check current advice.",
    route: "Douala, Limbe and Mount Cameroon, then Kribi. 10 days.",
    places: [
      ["limbe", "Limbe & Mount Cameroon", [15, 8, 4, 15], "offbeat trekking beach", "Black volcanic beaches and a 3-day climb of West Africa's highest peak, Mount Cameroon, through forest to its cratered summit.", "Guides for Mount Cameroon are arranged in Buea. Check travel advice first, as nearby English-speaking regions are affected by conflict.", "Mount Cameroon"],
      ["kribi", "Kribi", [15, 8, 4, 4], "beach offbeat", "Watch the Lobé Falls tumble straight into the sea, then laze on palm-fringed beaches in a relaxed fishing town.", "Fresh grilled fish on the beach is cheap. Pirogue trips upriver from the falls to a Bagyeli village are easy to arrange.", "Lobé Falls"]
    ] },
  { id: "benin", name: "Benin", region: "Sub-Saharan Africa", currency: "West African CFA franc (XOF)", best: [11, 12, 1, 2], w: "Ganvie",
    blurb: "Benin is the birthplace of vodun, with the stilt village of Ganvié, the python temple at Ouidah and the royal palaces of Abomey, all an easy trip from Togo.",
    route: "Cotonou, Ganvié, Ouidah and Abomey. 1 week, easy to pair with Togo.",
    places: [
      ["ganvie", "Ganvié", [15, 6, 5, 6], "offbeat culture", "Glide by pirogue through a huge village on stilts in Lake Nokoué, past floating markets, homes and churches.", "Book the boat at the official jetty in Abomey-Calavi to avoid touts and get fixed prices.", "Ganvie"],
      ["ouidah", "Ouidah", [15, 6, 3, 4], "history culture offbeat", "Walk the Route des Esclaves to the Door of No Return, visit the python temple and join the vodun festival in January.", "The vodun festival is held every 10 January. Book a room early, and use zemidjans (moto taxis) to reach the beach."],
      ["abomey", "Abomey", [12, 6, 4, 4], "history offbeat", "Explore the earthen royal palaces of the Kingdom of Dahomey, with bas-relief walls telling stories of kings and battles.", "Hire a guide at the palace museum, as there are few signs. Pair it with Ouidah on a cheap shared taxi loop.", "Royal Palaces of Abomey"]
    ] },
  { id: "togo", name: "Togo", region: "Sub-Saharan Africa", currency: "West African CFA franc (XOF)", best: [11, 12, 1, 2], w: "Koutammakou",
    blurb: "A thin sliver of a country with Lomé's fetish market, forest hikes and waterfalls around Kpalimé, and the mud tower houses of Koutammakou in the north.",
    route: "Lomé, Kpalimé and Koutammakou. 1 week.",
    places: [
      ["lome", "Lomé", [15, 6, 3, 3], "city offbeat", "Browse skulls, charms and herbs at the Akodessewa fetish market, then unwind on the long beach in this easygoing capital.", "Zemidjans (moto taxis) are the cheap way around. Agree on the fare before you hop on."],
      ["kpalime", "Kpalimé", [12, 6, 3, 3], "offbeat trekking nature", "Hike through butterfly-filled forest to waterfalls and cocoa farms, with craft workshops in the friendly market town.", "Local guides lead walks up Mount Agou for a small fee, and guesthouses in town are cheap.", "Kpalimé"],
      ["koutammakou", "Koutammakou", [12, 6, 8, 5], "offbeat history culture", "The Batammariba's two-storey mud tower houses, called takienta, stand across a UNESCO-listed landscape of fields and hills.", "Visit with a local guide from Kandé, who can introduce you to families and explain how the towers are used.", "Koutammakou"]
    ] },
  { id: "ivory-coast", name: "Côte d'Ivoire", region: "Sub-Saharan Africa", currency: "West African CFA franc (XOF)", best: [11, 12, 1, 2, 3], w: "Basilica of Our Lady of Peace of Yamoussoukro",
    blurb: "Côte d'Ivoire has booming Abidjan with its maquis food scene, surf beaches at Assinie and Grand-Bassam, and one of the largest churches in the world at Yamoussoukro.",
    route: "Abidjan, Grand-Bassam, Assinie and Yamoussoukro. 10 days.",
    places: [
      ["abidjan", "Abidjan", [25, 10, 4, 4], "city food", "Plateau's glassy skyline rises over the lagoon, while open-air maquis restaurants and late-night bars keep the city buzzing.", "Eat attiéké and grilled fish at a maquis for a filling, cheap meal. Shared woro-woro taxis beat metered cabs on price."],
      ["grand-bassam", "Grand-Bassam", [20, 8, 3, 3], "history beach", "A faded colonial capital on the beach, with peeling French-era buildings, craft stalls and a UNESCO-listed old quarter.", "An easy day trip or weekend from Abidjan. Beach guesthouses are cheaper midweek, and the current can be strong, so swim with care.", "Grand-Bassam"],
      ["yamoussoukro", "Yamoussoukro", [18, 8, 4, 4], "offbeat history", "A giant basilica modeled on St Peter's dominates the skyline, and crocodiles laze in the lakes around the presidential palace.", "Buses from Abidjan take about 3 hours. One night is plenty to see the basilica and the lakes."]
    ] },
  { id: "sierra-leone", name: "Sierra Leone", region: "Sub-Saharan Africa", currency: "Sierra Leonean leone (SLE)", best: [11, 12, 1, 2, 3, 4], w: "Banana Islands",
    blurb: "Sierra Leone has empty white beaches, the Tacugama chimp sanctuary and quiet islands like Banana Islands, a destination rebuilding steadily and still refreshingly uncrowded.",
    route: "Freetown, the peninsula beaches, Banana Islands and Tiwai. 10 days.",
    places: [
      ["freetown", "Freetown Peninsula", [20, 8, 4, 5], "beach offbeat", "Palm beaches like River No. 2 curve beside green hills, and rescued chimps live in the forest at the Tacugama sanctuary.", "Beach guesthouses often include meals. Shared taxis along the peninsula road are cheap, but leave early to beat Freetown's traffic.", "Freetown"],
      ["banana-islands", "Banana Islands", [20, 8, 8, 4], "offbeat beach", "Quiet island coves with snorkeling, fishing villages and old colonial ruins, reached by a short boat ride from the peninsula.", "Boats leave from Kent village. Share the boat with other travelers and stay in a simple island guesthouse with meals.", "Banana Islands"],
      ["tiwai", "Tiwai Island", [20, 8, 10, 15], "offbeat nature", "Rainforest with 11 primate species and pygmy hippos, explored on guided walks and night canoe trips along the Moa River.", "A community-run project; stay overnight. Night walks and early mornings give the best chances of seeing wildlife.", "Tiwai Island"]
    ] },
  { id: "gambia", name: "The Gambia", region: "Sub-Saharan Africa", currency: "Gambian dalasi (GMD)", best: [11, 12, 1, 2, 3, 4], w: "Gambia River",
    blurb: "The Gambia is a narrow river country of rich birdlife, Atlantic beaches and easygoing villages, with chimps and hippos upriver near Janjanbureh.",
    route: "The coast near Banjul, then upriver to Janjanbureh. 1 week.",
    places: [
      ["banjul-coast", "Banjul & the coast", [18, 8, 3, 3], "beach", "Watch fishing boats land their catch at Tanji, swim on Atlantic beaches and touch the sacred crocodiles at Kachikally pool.", "Bush taxis are the cheap way along the coast. Birding guides in the coastal reserves charge far less than hotel tours.", "Banjul"],
      ["janjanbureh", "Janjanbureh", [15, 6, 6, 6], "offbeat nature history", "River trips to see chimps and hippos, and historic slave-trade sites on a quiet island town deep up the Gambia River.", "Boat trips run along the river to the chimp islands. Riverside camps upriver are cheap and often include meals."]
    ] },
  { id: "mali", name: "Mali", region: "Sub-Saharan Africa", currency: "West African CFA franc (XOF)", best: [11, 12, 1, 2], w: "Great Mosque of Djenné",
    advisory: "Most governments advise against all travel to Mali because of terrorism, kidnapping and armed conflict.",
    blurb: "Mali is home to Djenné's mud mosque, the Dogon cliff villages and Timbuktu, but most governments currently advise against all travel there, so this is one to save for later.",
    route: "Bamako, Djenné and Dogon Country. 2 weeks, if travel becomes safe.",
    places: [
      ["djenne", "Djenné", [15, 6, 8, 5], "history offbeat", "The world's largest mud-brick building, re-plastered every year in a town-wide festival, rising over Djenné's Monday market.", "Not currently considered safe to visit. Most governments advise against all travel to Mali, so check official advice before planning anything.", "Great Mosque of Djenné"],
      ["dogon", "Dogon Country", [12, 6, 10, 8], "offbeat trekking culture", "Villages and granaries built into the Bandiagara cliffs, home to the Dogon people's distinctive culture and masked dances.", "Not currently considered safe to visit. Wait for official travel advice to change before considering a trek here.", "Cliff of Bandiagara"]
    ] },
  { id: "gabon", name: "Gabon", region: "Sub-Saharan Africa", currency: "Central African CFA franc (XAF)", best: [6, 7, 8, 9], w: "Loango National Park",
    blurb: "In Gabon rainforest meets the ocean, and forest elephants walk on beaches. Wildlife at Loango and Lopé is spectacular, though it is one of Africa's pricier places to travel.",
    route: "Libreville, then Loango or Lopé. 10 days.",
    places: [
      ["loango", "Loango National Park", [60, 20, 30, 40], "offbeat nature beach", "Forest elephants and hippos on the beach, and humpback whales breaching offshore, where Atlantic surf meets untouched rainforest.", "Access is by lodge packages, so it's expensive. Visit in the whale season from July to September to get the most from the cost.", "Loango National Park"],
      ["lope", "Lopé National Park", [35, 15, 15, 20], "offbeat nature", "Savanna and rainforest with mandrills, reached by the Transgabonais train, where guided hikes cross rolling grassland hills.", "The train from Libreville is the cheap way in. Book a seat in advance and stay at simple lodges near the station.", "Lopé National Park"]
    ] },
  { id: "dr-congo", name: "DR Congo", region: "Sub-Saharan Africa", currency: "Congolese franc (CDF)", best: [6, 7, 8, 9, 12, 1], w: "Nyiragongo",
    advisory: "Most governments advise against all travel to eastern DR Congo, including Virunga, because of armed conflict. Check current advice for all regions.",
    blurb: "DR Congo has a live lava lake and mountain gorillas in Virunga, plus Kinshasa's rumba scene. The east is closed by conflict, so check official advice for every region before travel.",
    route: "Goma, Nyiragongo and Virunga. 5 days, if travel becomes safe.",
    places: [
      ["nyiragongo", "Nyiragongo", [30, 15, 20, 300], "offbeat trekking", "An overnight climb to the rim of the world's largest lava lake, sleeping in summit huts above the glowing crater.", "Treks are run through Virunga National Park, which is currently closed. Only plan a visit once the park reopens and travel advice allows it.", "Mount Nyiragongo"],
      ["kinshasa", "Kinshasa", [30, 12, 6, 4], "city offbeat", "Huge, loud and musical, the home of Congolese rumba, with live bands, sapeur street style and markets along the Congo River.", "Go with a local contact; the city is hard to navigate alone. Check current travel advice before you book."]
    ] },
  { id: "angola", name: "Angola", region: "Sub-Saharan Africa", currency: "Angolan kwanza (AOA)", best: [5, 6, 7, 8, 9], w: "Kalandula Falls",
    blurb: "Angola is one of Africa's least-touristed countries, with the huge Kalandula Falls, the Tundavala cliffs near Lubango, the Serra da Leba road and a wild desert coast.",
    route: "Luanda, Kalandula Falls and the south around Lubango. 2 weeks.",
    places: [
      ["kalandula", "Kalandula Falls", [25, 10, 10, 3], "offbeat nature", "One of Africa's largest waterfalls by volume, a wide horseshoe of thundering water dropping into a rainforest gorge.", "Visit after the rains, from April to June, when the flow is strongest. A night in nearby Malanje keeps costs down.", "Kalandula Falls"],
      ["lubango", "Lubango & Tundavala", [25, 10, 8, 3], "offbeat nature mountains", "Peer over the Tundavala gap's 1,000 m drop and drive the hairpin bends of the Serra da Leba road.", "Rent a car with a driver to reach the viewpoints. Splitting it with others makes a day trip from Lubango affordable.", "Tundavala Gap"]
    ] },
  { id: "eswatini", name: "Eswatini", region: "Sub-Saharan Africa", currency: "Swazi lilangeni (SZL)", best: [4, 5, 6, 7, 8, 9], w: "Mlilwane Wildlife Sanctuary",
    blurb: "Eswatini is a small kingdom of game reserves, mountain hikes and cultural festivals, easy to reach from South Africa and cheap to explore on foot or by bike.",
    route: "Mbabane, Mlilwane and Hlane. 4 days, easy from South Africa.",
    places: [
      ["mlilwane", "Mlilwane", [15, 10, 4, 6], "nature trekking", "Walk, cycle or ride horses among zebras, warthogs and antelope in a peaceful sanctuary with no dangerous predators.", "Hostel huts inside the sanctuary are cheap, and guided walks or bike rentals cost far less than game drives elsewhere.", "Mlilwane Wildlife Sanctuary"],
      ["hlane", "Hlane Royal National Park", [20, 10, 6, 10], "nature offbeat", "Lions, rhinos and elephants at a small, affordable reserve, with a waterhole right by the camp's restaurant.", "Guided rhino walks cost little. Stay in the camp's simple huts, lit by lanterns since there is no electricity."]
    ] },
  { id: "lesotho", name: "Lesotho", region: "Sub-Saharan Africa", currency: "Lesotho loti (LSL)", best: [3, 4, 5, 9, 10, 11], w: "Sani Pass",
    blurb: "Lesotho is a mountain kingdom entirely above 1,000 m, with pony treks, village homestays, the Sani Pass and huge waterfalls, all surprisingly cheap to explore.",
    route: "Sani Pass, Semonkong and Malealea. 1 week.",
    places: [
      ["semonkong", "Semonkong", [15, 8, 5, 8], "offbeat trekking mountains", "Maletsunyane Falls plunges into a deep gorge, and pony treks with Basotho guides wind between remote mountain villages.", "Lodges arrange pony treks and village stays. Bring warm layers, as nights get cold at altitude even in summer.", "Maletsunyane Falls"],
      ["sani-pass", "Sani Pass", [20, 10, 15, 4], "offbeat mountains", "A switchback 4x4 road climbs into the mountains to a summit pub billed as Africa's highest, with huge views over the valley.", "Join a 4x4 tour from Underberg in South Africa. Bring your passport, as you cross the border at the top.", "Sani Pass"]
    ] },
  { id: "mauritius", name: "Mauritius", region: "Sub-Saharan Africa", currency: "Mauritian rupee (MUR)", best: [5, 6, 7, 8, 9, 10, 11], w: "Le Morne Brabant",
    blurb: "Mauritius is cheaper than its resort image, with turquoise lagoons, the Le Morne hike, rainforest trails in Black River Gorges and Port Louis street food like dholl puri.",
    route: "Port Louis, Le Morne and Black River Gorges. 1 week.",
    places: [
      ["le-morne", "Le Morne", [30, 12, 5, 4], "beach trekking", "Scramble up a UNESCO-listed mountain for views over turquoise lagoons, then watch kitesurfers carve across the reef below.", "Buses are cheap; guesthouses beat resorts on price. Start the Le Morne hike early to avoid the midday heat.", "Le Morne Brabant"],
      ["black-river", "Black River Gorges", [25, 12, 5, 3], "nature trekking", "Rainforest trails, waterfalls and the seven-coloured earths of Chamarel, with endemic birds and sweeping gorge viewpoints.", "Hike from Pétrin to Black River, downhill most of the way, then catch a local bus back. Pack water and snacks, as shops are scarce.", "Black River Gorges National Park"]
    ] },
  { id: "seychelles", name: "Seychelles", region: "Sub-Saharan Africa", currency: "Seychellois rupee (SCR)", best: [4, 5, 10, 11], w: "Anse Source d'Argent",
    blurb: "The Seychelles has granite boulder beaches on remote islands. It is pricey, but self-catering guesthouses, local buses and ferries make Mahé, Praslin and La Digue doable on a budget.",
    route: "Mahé, Praslin and La Digue. 1 week.",
    places: [
      ["la-digue", "La Digue", [60, 25, 6, 10], "beach", "Pedal past giant tortoises to Anse Source d'Argent's sculpted granite boulders on an island where bicycles replace cars.", "Self-catering guesthouses save a lot. Rent a bike for your whole stay and buy groceries and takeaway curries in La Passe.", "Anse Source d'Argent"],
      ["praslin", "Praslin", [60, 25, 6, 15], "beach nature", "Walk among giant coco de mer palms in the Vallée de Mai forest, then swim at the soft white curve of Anse Lazio beach.", "Local buses cost a few rupees and reach both the Vallée de Mai and Anse Lazio. Bring a picnic from a supermarket.", "Vallée de Mai"]
    ] },
  { id: "cape-verde", name: "Cape Verde", region: "Sub-Saharan Africa", currency: "Cape Verdean escudo (CVE)", best: [11, 12, 1, 2, 3, 4, 5, 6], w: "Santo Antão",
    blurb: "Cape Verde's volcanic islands offer mountain hikes on Santo Antão, a crater village on Fogo, soulful morna music in Mindelo and quiet Atlantic beaches.",
    route: "Santiago, then São Vicente and the hiking island of Santo Antão. 10 days.",
    places: [
      ["santo-antao", "Santo Antão", [25, 10, 5, 3], "offbeat trekking mountains", "Hike between terraced green valleys and cliff-hugging coastal trails, staying in small village guesthouses on Cape Verde's best walking island.", "Take the ferry from Mindelo; aluguers (shared vans) cover the island. Many hikes run downhill if you get dropped at the top.", "Santo Antão"],
      ["mindelo", "Mindelo", [25, 12, 3, 3], "culture city", "Live morna music fills the bars at night, and pastel colonial streets lead down to a busy harbor full of fishing boats.", "Visit for the February carnival, but book a room early. Many bars have free live music most nights.", "Mindelo"],
      ["fogo", "Fogo", [25, 10, 5, 5], "offbeat trekking mountains", "A village and vineyards sit inside the crater of an active volcano, with a steep dawn climb to the summit of Pico do Fogo.", "Stay in Chã das Caldeiras and climb at dawn with a local guide. Try the crater-grown wine at the village cooperative.", "Fogo, Cape Verde"]
    ] },
  { id: "djibouti", name: "Djibouti", region: "Sub-Saharan Africa", currency: "Djiboutian franc (DJF)", best: [11, 12, 1, 2], w: "Lake Assal",
    blurb: "Djibouti is a small, expensive country with otherworldly landscapes, from the salt flats of Lake Assal to the limestone chimneys of Lac Abbé, plus whale sharks in the bay.",
    route: "Djibouti City, Lake Assal, Lac Abbé and the bay for whale sharks. 5 days.",
    places: [
      ["lake-assal", "Lake Assal", [50, 15, 30, 5], "offbeat nature", "A salt lake 155 m below sea level, the lowest point in Africa, ringed by dazzling white salt crusts and dark lava fields.", "Tours from Djibouti City are the easiest way. Share a 4x4 with others to split the cost, and bring sandals for the sharp salt.", "Lake Assal (Djibouti)"],
      ["lac-abbe", "Lac Abbé", [50, 15, 30, 5], "offbeat nature", "Steaming limestone chimneys rise from a desert lakeshore, glowing pink and orange at dawn as flamingos feed in the shallows.", "Stay overnight at the Afar camp for sunrise. Meals are usually included, so bring little more than water and a warm layer.", "Lake Abbe"]
    ] },
  { id: "eritrea", name: "Eritrea", region: "Sub-Saharan Africa", currency: "Eritrean nakfa (ERN)", best: [10, 11, 12, 1, 2, 3], w: "Fiat Tagliero Building",
    blurb: "Eritrea preserves Asmara's 1930s Italian modernist architecture, frozen in time, with espresso cafés, art deco cinemas and a dramatic mountain road down to the Red Sea.",
    route: "Asmara and the mountain road down to Massawa. 5 days.",
    places: [
      ["asmara", "Asmara", [25, 8, 3, 4], "offbeat city history", "Sip macchiato in old Italian cafés, admire art deco cinemas and the wing-shaped Fiat Tagliero building in a UNESCO-listed modernist city.", "Permits are needed to travel outside Asmara. Apply at the tourism office soon after you arrive.", "Asmara"],
      ["massawa", "Massawa", [25, 8, 6, 4], "offbeat history beach", "A coral-stone Ottoman port town on the Red Sea, with arched arcades, war-scarred buildings and fresh fish grilled by the harbor.", "The old steam railway runs only occasionally, usually for groups. Otherwise take the bus down the spectacular mountain road from Asmara.", "Massawa"]
    ] },
  { id: "somalia", name: "Somalia", region: "Sub-Saharan Africa", currency: "Somali shilling (SOS)", best: [11, 12, 1, 2, 3], w: "Laas Geel",
    advisory: "Most governments advise against all travel to Somalia because of terrorism, kidnapping and armed conflict. Self-declared Somaliland is generally considered calmer, but check current advice.",
    blurb: "Somaliland's 5,000-year-old cave paintings at Laas Geel are the highlight. Most of Somalia is off-limits, and even Somaliland trips are best done with a guide after checking current advice.",
    route: "Hargeisa and Laas Geel in Somaliland. 4 days, usually with a guide.",
    places: [
      ["hargeisa", "Hargeisa", [25, 8, 5, 5], "offbeat city", "A bustling livestock market and money-changers with piles of cash on the street give Somaliland's capital a lively, unusual energy.", "Somaliland requires an armed escort for trips outside the city. Your hotel can arrange one, and check current travel advice first."],
      ["laas-geel", "Laas Geel", [25, 8, 20, 10], "offbeat history", "Some of the best-preserved Neolithic rock paintings in Africa, with vivid cattle and figures painted under granite overhangs.", "Visited as a day trip from Hargeisa. Arrange the required permit and escort through your hotel or a local guide.", "Laas Geel"]
    ] },
  { id: "sao-tome", name: "São Tomé and Príncipe", region: "Sub-Saharan Africa", currency: "São Tomé dobra (STN)", best: [6, 7, 8, 9], w: "Pico Cão Grande",
    blurb: "São Tomé and Príncipe are tiny cocoa islands on the equator, with jungle peaks like Pico Cão Grande, old plantation houses, nesting turtles and empty beaches.",
    route: "São Tomé, the south coast and Príncipe. 10 days.",
    places: [
      ["sao-tome-island", "São Tomé Island", [30, 12, 6, 4], "offbeat nature beach", "Explore old cocoa plantations, gaze up at the needle-like Pico Cão Grande and swim at empty palm beaches on the south coast.", "Stay in a roça (plantation house) for the history. Many offer simple rooms and meals at fair prices.", "Pico Cão Grande"],
      ["principe", "Príncipe", [40, 15, 8, 4], "offbeat nature beach", "A rainforest island with nesting turtles, deserted golden beaches and volcanic peaks rising from the jungle.", "Small planes connect the islands, so book early. Turtle nesting season runs roughly from November to February.", "Príncipe"]
    ] }
]);
