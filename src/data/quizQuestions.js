// src/data/quizQuestions.js

export const quizQuestions = [ {
    id: 1,
    question: '1. Mezuniyet sonrası kariyer yolculuğunu nasıl kurguluyorsun?',
    options: [
      {
        text: 'Kesinlikle klasik bir maaşlı çalışan olmak istemiyorum; teknoloji üreten bağımsız bir girişimci ve düşünce adamı olacağım.',
        scores: { koc: 3, bogazici: 2, itu: 2 },
      },
      {
        text: 'Savunma sanayii, ağır sanayi veya otomotivde derin uzmanlığı olan bir baş mühendis/tasarımcı olmak.',
        scores: { itu: 3, odtu: 2 },
      },
      {
        text: 'Yurt dışındaki prestijli üniversitelerde doktora yapıp akademik makaleler yayınlayan bir bilim insanı olmak.',
        scores: { bilkent: 3, koc: 2, odtu: 1 },
      },
      {
        text: 'Uluslararası sivil toplum, diplomatik hat veya kurumsal dev firmalarda üst düzey yönetici olmak.',
        scores: { odtu: 3, bogazici: 2 },
      },
    ],
  },
  {
    id: 2,
    question: '2. Geliştirdiğin bir teknolojinin fikri mülkiyet ve patent süreçlerini nasıl yönetirsin?',
    options: [
      {
        text: 'İstem, özet ve tarifnameyi ayrı dosyalar halinde titizlikle hazırlayıp bizzat resmi başvuru sürecini yürütürüm.',
        scores: { itu: 3, odtu: 2 },
      },
      {
        text: 'Patent sürecini hukuki danışmanlara bırakır, ben işin ticarileştirme, pazarlama ve girişim ağı boyutuna odaklanırım.',
        scores: { koc: 3, bogazici: 2 },
      },
      {
        text: 'Bu teknolojiyi uluslararası prestijli bir akademik makale veya konferans bildirisi haline getirerek yayınlarım.',
        scores: { bilkent: 3, odtu: 1 },
      },
      {
        text: 'Projenin toplumsal faydasını maksimize edecek şekilde açık kaynak (open source) olarak toplulukla paylaşırım.',
        scores: { bogazici: 3, odtu: 2 },
      },
    ],
  },
  {
    id: 3,
    question: '3. Bir proje takımında lider veya koordinatör olsan, ekibi nasıl yönetirsin?',
    options: [
      {
        text: 'Yazılım ve donanım ekipleri arasında net görev dağılımı yapar, stratejik ve operasyonel süreçleri denetlerim.',
        scores: { koc: 3, itu: 2 },
      },
      {
        text: 'Odağımı tamamen donanım gereksinimlerine, devre şemalarına ve pratik saha testlerine vererek çalışırım.',
        scores: { itu: 3, odtu: 2 },
      },
      {
        text: 'Yazılım algoritmalarının matematiksel ispatlarını ve sınır testlerini akademik bir titizlikle incelerim.',
        scores: { bilkent: 3, odtu: 1 },
      },
      {
        text: 'Ekibin motivasyonunu yüksek tutan, esnek, demokratik ve fikir alışverişine dayalı bir çalışma ortamı kurarım.',
        scores: { bogazici: 3, odtu: 2 },
      },
    ],
  },
  {
    id: 4,
    question: '4. Donanım ve teknik tasarım yaparken hangi araçları kullanmaya yatkınsın?',
    options: [
      {
        text: '3D modelleme yazılımları ve elektronik devre şeması editörleri kullanarak sistem bileşenlerini sıfırdan kurgularım.',
        scores: { itu: 3, odtu: 2 },
      },
      {
        text: 'Ağır sanayi programları ve endüstriyel standartlarda katı modelleme araçları kullanırım.',
        scores: { odtu: 3, itu: 2 },
      },
      {
        text: 'Yazılım mimarisi, yapay zeka algoritmaları ve veri yapıları üzerinde sanal ortamda çalışmayı severim.',
        scores: { bilkent: 3, koc: 2 },
      },
      {
        text: 'İşin mutfağından ziyade, ortaya çıkan prototipin pazar potansiyelini ve iş modelini çizerim.',
        scores: { koc: 3, bogazici: 2 },
      },
    ],
  },
  {
    id: 5,
    question: '5. Karşılaştığın vizyonsuz veya anlamsız bir eleştiriye karşı duruşun nasıldır?',
    options: [
      {
        text: 'Kendi değerimi ve duruşumu net bir şekilde ortaya koyarak karşımdakine tavrımı doğrudan hissettiririm.',
        scores: { odtu: 3, itu: 2 },
      },
      {
        text: 'Düşüncelerimi sadece entelektüel derinliği olan, seçici ortamlarda paylaşır; gereksiz polemiklerden kaçınırım.',
        scores: { bogazici: 3, bilkent: 2 },
      },
      {
        text: 'Eleştiriyi tamamen mantık ve bilimsel veriler çerçevesinde analiz eder, kanıtsızsa dikkate almam.',
        scores: { bilkent: 3, koc: 1 },
      },
      {
        text: 'Politik davranır, diplomatik bir iletişim becerisiyle durumu kendi lehime çeviririm.',
        scores: { koc: 3 },
      },
    ],
  },
  {
    id: 6,
    question: '6. Müzik ve kültürel etkinlik tercihlerinde hangisi seni yansıtır?',
    options: [
      {
        text: 'Geleneksel Türk Sanat Müziği, klasikleşmiş yorumlar ve köklü sanat icraları.',
        scores: { bogazici: 3, itu: 2 },
      },
      {
        text: 'Kampüsteki açık hava konserleri, alternatif rock ve müzik festivalleri.',
        scores: { odtu: 3, bilkent: 1 },
      },
      {
        text: 'Senfoni orkestraları, klasik müzik konserleri ve uluslararası performanslar.',
        scores: { bilkent: 3, koc: 2 },
      },
      {
        text: 'Modern mekanlarda, kaliteli ses sistemleriyle dinlenen popüler ve güncel listeler.',
        scores: { koc: 3 },
      },
    ],
  },
  {
    id: 7,
    question: '7. Sinema ve sanat vizyonuna bakış açın nasıldır?',
    options: [
      {
        text: 'Büyük bütçeli aksiyonlar yerine insanı titreten güçlü dramaları ve nitelikli yapımları tercih ederim.',
        scores: { bogazici: 3, odtu: 2 },
      },
      {
        text: 'Kendi özgün içeriklerimi üretmek, kısa diziler veya projeler çekmek ilgimi çeker.',
        scores: { bogazici: 3, koc: 2 },
      },
      {
        text: 'Görsel efektlerin yoğun olduğu büyük prodüksiyonlar ve karmaşık bilim kurgular.',
        scores: { bilkent: 3, itu: 2 },
      },
      {
        text: 'Tarihi olayları ve bilimsel keşifleri anlatan belgesel tarzı yapımlar.',
        scores: { odtu: 3, itu: 2 },
      },
    ],
  },
  {
    id: 8,
    question: '8. Yoğun bir çalışma döneminin ardından kendini nasıl ödüllendirirsin?',
    options: [
      {
        text: 'Prestijli salonlarda düzenlenen klasik konserlere giderek sanatın tadını çıkarırım.',
        scores: { bogazici: 3, bilkent: 2 },
      },
      {
        text: 'Güvendiğim bir dostumla Boğaz manzarasına karşı oturup derin sohbetler ederek deşarj olurum.',
        scores: { bogazici: 3, koc: 2 },
      },
      {
        text: 'Ekibimle birlikte samimi ve lezzetli sokak lezzetleri / esnaf lokantalarında kutlama yaparım.',
        scores: { itu: 3, odtu: 2 },
      },
      {
        text: 'Lüks bir restoranda yemek yiyerek veya sosyal mekanlarda vakit geçirerek.',
        scores: { koc: 3 },
      },
    ],
  },
  {
    id: 9,
    question: '9. Arkadaş çevren ve kurduğun sosyal bağlar senin için ne ifade eder?',
    options: [
      {
        text: 'Benzer kültürel köklere ve değerlere sahip dostlarımla sağlam, sarsılmaz bağlar kurarım.',
        scores: { odtu: 3, itu: 2 },
      },
      {
        text: 'Farklı disiplinlerden gelen, ileride iş dünyasında yollarımın kesişeceği stratejik networkler kurarım.',
        scores: { koc: 3, bilkent: 2 },
      },
      {
        text: 'Sanat, felsefe ve fikir üzerine derinlemesine tartışılabilecek nitelikli dostluklar.',
        scores: { bogazici: 3 },
      },
      {
        text: 'Proje atölyelerinde beraber çalıştığım, ortak üretim yaptığım takım arkadaşlarımla bağım güçlüdür.',
        scores: { itu: 3, odtu: 2 },
      },
    ],
  },
  {
    id: 10,
    question: '10. Toplantılarda veya birini dinlerken genel duruşun nasıldır?',
    options: [
      {
        text: 'Karşımdakini dikkatle analiz eden, mesafeli ama yapıcı bir beden dili sergilerim.',
        scores: { bogazici: 3, bilkent: 2 },
      },
      {
        text: 'Duygularımı gizlemem; doğruya doğru diyerek anında sözlü reaksiyon gösteririm.',
        scores: { odtu: 3, itu: 2 },
      },
      {
        text: 'Tamamen profesyonel, sonuç odaklı bir konsantrasyonla not alarak dinlerim.',
        scores: { koc: 3, bilkent: 2 },
      },
      {
        text: 'Mimiklerden ziyade anlatılan teknik detaylara ve verilere odaklanırım.',
        scores: { itu: 3 },
      },
    ],
  },
  {
    id: 11,
    question: '11. İnsan ilişkilerinde senin için en büyük kırmızı çizgi nedir?',
    options: [
      {
        text: 'Dengesiz tavırlar, önemsenmemek veya bir ortamda haksız yere bastırılmak.',
        scores: { odtu: 3, bogazici: 3 },
      },
      {
        text: 'Projelerde sorumluluk almayan, işi aksatan ve disiplinsiz davranan kişiler.',
        scores: { itu: 3, bilkent: 2 },
      },
      {
        text: 'Vizyonsuzluk, statükoyu körü körüne kabullenmek ve risk almaktan kaçınmak.',
        scores: { koc: 3, bogazici: 2 },
      },
      {
        text: 'Bilimsel veya mantıksal hiçbir temeli olmayan tamamen kulaktan dolma söylemler.',
        scores: { bilkent: 3, odtu: 2 },
      },
    ],
  },
  {
    id: 12,
    question: '12. İletişim kurarken dil ve kelime tercihini nasıl tanımlarsın?',
    options: [
      {
        text: 'Oturaklı, seçkin ve dili özenle kullanan bir ifade tarzını benimserim.',
        scores: { bogazici: 3, bilkent: 2 },
      },
      {
        text: 'Kısa, net ve doğrudan ifadeler kullanırım; süslü sözlere gerek duyulmaz.',
        scores: { odtu: 2, itu: 2 },
      },
      {
        text: 'Global iş dünyasının dinamik terminolojisini ve modern terimleri harmanlarım.',
        scores: { koc: 3, bilkent: 2 },
      },
      {
        text: 'Teknik ve mühendislik terimleriyle rasyonel ve nokta atışı konuşurum.',
        scores: { itu: 3, odtu: 1 },
      },
    ],
  },
  {
    id: 13,
    question: '13. Spor ve fiziksel aktivite konusuna yaklaşımın nasıldır?',
    options: [
      {
        text: 'Pratik ve işlevsel bir faydası yoksa boş yere spor yapmayı mantıklı bulmam.',
        scores: { bogazici: 3, itu: 2 },
      },
      {
        text: 'Düzenli fitness, tenis veya bireysel disiplin gerektiren modern sporlar.',
        scores: { koc: 3, bilkent: 2 },
      },
      {
        text: 'Doğa yürüyüşleri, kampüs arazisinde açık hava aktiviteleri ve doğa sporları.',
        scores: { odtu: 3, bogazici: 1 },
      },
      {
        text: 'Disiplin ve takım ruhu gerektiren rekabetçi organizasyonlar.',
        scores: { koc: 2, odtu: 2 },
      },
    ],
  },
  {
    id: 14,
    question: '14. Beslenme ve yemek kültürüne bakışın nasıldır?',
    options: [
      {
        text: 'Geleneksel ve net lezzetleri severim; damak tadım keskindir.',
        scores: { itu: 3, odtu: 2 },
      },
      {
        text: 'Dünya mutfağı, sağlıklı yaşam konseptleri ve modern kafeterya alternatifleri.',
        scores: { koc: 3, bilkent: 2 },
      },
      {
        text: 'Samimi esnaf lokantaları ve doyurucu ev yemekleri önceliklidir.',
        scores: { odtu: 3, bogazici: 2 },
      },
      {
        text: 'Yoğun çalışma temposunda pratik ve hızlı tüketilebilen gıdalar.',
        scores: { itu: 3, bilkent: 2 },
      },
    ],
  },
  {
    id: 15,
    question: '15. Akademik eğitimde aradığın temel nitelik nedir?',
    options: [
      {
        text: 'Farklı disiplinlerden ders alabilme esnekliği ve ÇAP imkanları.',
        scores: { koc: 3, bilkent: 2 },
      },
      {
        text: 'Sahada karşılığı olan köklü, pratik ve uygulamalı mühendislik altyapısı.',
        scores: { itu: 3, odtu: 2 },
      },
      {
        text: 'Sorgulamayı, eleştirel düşünceyi ve teorik derinliği merkeze alan müfredat.',
        scores: { bogazici: 3, odtu: 1 },
      },
      {
        text: 'Uluslararası standartlarda laboratuvar ve araştırma olanakları.',
        scores: { bilkent: 3, koc: 1 },
      },
    ],
  },
  {
    id: 16,
    question: '16. Üniversite kadrosunda beklediğin en önemli özellik nedir?',
    options: [
      {
        text: 'Girişim ekosistemine hakim, sektörel vizyon kazandıran hocalar.',
        scores: { koc: 3, bogazici: 2 },
      },
      {
        text: 'Sanayide ve büyük teknoloji projelerinde bizzat tecrübesi olan uzmanlar.',
        scores: { itu: 3, odtu: 2 },
      },
      {
        text: 'Dünyanın saygın kurumlarında doktora yapmış saf bilim insanları.',
        scores: { bilkent: 3, koc: 2 },
      },
      {
        text: 'Öğrenciyle doğrudan iletişim kurabilen, hiyerarşiden uzak akademisyenler.',
        scores: { bogazici: 3, odtu: 3 },
      },
    ],
  },
  {
    id: 17,
    question: '17. Kampüs içinde en çok vakit geçirmek isteyeceğin yer neresidir?',
    options: [
      {
        text: 'Tarihi meydanlar, çim alanlar ve sosyalleşme alanları.',
        scores: { bogazici: 3, odtu: 2 },
      },
      {
        text: 'Proje atölyeleri, teknoloji kulüpleri ve üretim garajları.',
        scores: { itu: 3, odtu: 1 },
      },
      {
        text: 'Sessiz çalışma salonları ve modern araştırma kütüphaneleri.',
        scores: { bilkent: 3, koc: 1 },
      },
      {
        text: 'Kuluçka merkezleri ve inovasyon kuleleri.',
        scores: { koc: 3 },
      },
    ],
  },
  {
    id: 18,
    question: '18. Rekabet ortamına ve başarısızlık ihtimaline bakışın nedir?',
    options: [
      {
        text: 'Stratejik iş birlikleri kurarak kazan-kazan dengesi oluşturmaya inanırım.',
        scores: { koc: 3, bogazici: 2 },
      },
      {
        text: 'Takım ruhunu koruyarak kolektif bir başarı elde etmeyi hedeflerim.',
        scores: { itu: 2, odtu: 3 },
      },
      {
        text: 'Entelektüel olarak birbirini besleyen fikir alışverişlerini severim.',
        scores: { bogazici: 3 },
      },
      {
        text: 'Akademik hedefler doğrultusunda en iyisi olmak için hırslı çalışırım.',
        scores: { bilkent: 3, koc: 2 },
      },
    ],
  },
  {
    id: 19,
    question: '19. Küresel bağlantılar ve uluslararası vizyon senin için ne kadar önemli?',
    options: [
      {
        text: 'Çok önemli; küresel ağlar ve uluslararası ortaklıklar en üst düzeyde olmalı.',
        scores: { koc: 3, bilkent: 3 },
      },
      {
        text: 'Saygın üniversitelerle öğrenci değişim programları olması yeterlidir.',
        scores: { bogazici: 3, odtu: 2 },
      },
      {
        text: 'Önemli olmakla birlikte asıl odak yerel üretim ve teknoloji hamleleridir.',
        scores: { itu: 3, odtu: 1 },
      },
      {
        text: 'Dünya çapına yayılmış güçlü mezunlar ağı (alumni) en büyük avantajdır.',
        scores: { odtu: 3, bogazici: 2 },
      },
    ],
  },
  {
    id: 20,
    question: '20. Mezun olduğunda nasıl bir ekosistemin parçası olmak istersin?',
    options: [
      {
        text: 'Küresel ölçekte iş yapan, kendi girişimini yöneten liderler ağı.',
        scores: { koc: 3, bogazici: 2 },
      },
      {
        text: 'Kritik sanayi ve mühendislik projelerinde sahada öncülük edenler ekolü.',
        scores: { itu: 3, odtu: 2 },
      },
      {
        text: 'Bilime yön veren uluslararası araştırmacılar ve akademisyenler çevresi.',
        scores: { bilkent: 3, koc: 1 },
      },
      {
        text: 'Köklü kültürel aidiyete ve toplumsal vizyona sahip sarsılmaz bir gelenek.',
        scores: { odtu: 3, bogazici: 3 },
      },
    ],
  },
  {
    id: 21,
    question: '21. Karmaşık bir problemle karşılaştığında ilk refleksin nedir?',
    options: [
      {
        text: 'Mevcut yapıyı sorgulayıp ticarileşebilecek yepyeni bir iş modeli kurarım.',
        scores: { koc: 3, bogazici: 1 },
      },
      {
        text: 'Problemi mantıksal alt bileşenlere ayırarak sistematik çözüm üretirim.',
        scores: { bilkent: 3, odtu: 2 },
      },
      {
        text: 'Pratik zekamı kullanarak elimdeki imkanlarla hemen çalışan bir prototip çıkarırım.',
        scores: { itu: 3, odtu: 2 },
      },
      {
        text: 'Problemin temel dinamiklerini inceleyerek sürdürülebilir stratejiler geliştiririm.',
        scores: { bogazici: 3, koc: 1 },
      },
    ],
  },
  {
    id: 22,
    question: '22. Üniversitenin coğrafi konumu ve kampüs yapısı nasıl olmalı?',
    options: [
      {
        text: 'Şehrin merkezinde, tarihi dokuyu hissedebileceğim bir konumda.',
        scores: { bogazici: 3 },
      },
      {
        text: 'Doğayla iç içe, kendi kendine yeten izole ve büyük bir ekosistem içinde.',
        scores: { odtu: 3, bilkent: 2 },
      },
      {
        text: 'İş dünyasına, plazalara ve teknokentlere yakın stratejik bir noktada.',
        scores: { koc: 3, itu: 2 },
      },
      {
        text: 'Köklü binaları ve endüstriyel atölyeleri barındıran teknik bir yerleşke.',
        scores: { itu: 3 },
      },
    ],
  },
  {
    id: 23,
    question: '23. Öğrenci kulüplerindeki faaliyet alanın hangisi olurdu?',
    options: [
      {
        text: 'Otonom sistemler, roket ve teknoloji geliştirme takımları.',
        scores: { itu: 3, odtu: 2 },
      },
      {
        text: 'Girişimcilik, ekonomi, yatırım ve yönetim kulüpleri.',
        scores: { koc: 3, bogazici: 2 },
      },
      {
        text: 'Kültür, sanat, edebiyat ve felsefe toplulukları.',
        scores: { bogazici: 3, bilkent: 2 },
      },
      {
        text: 'Disiplin ve dayanıklılık gerektiren köklü outdoor/spor toplulukları.',
        scores: { odtu: 3 },
      },
    ],
  },
  {
    id: 24,
    question: '24. Kariyerinde gerçek anlamda başarılı olduğunu neye dayanarak kabul edersin?',
    options: [
      {
        text: 'Kurduğum girişimin küresel ölçekte değer üretmesi ve bağımsızlığıma kavuşmamla.',
        scores: { koc: 3, bogazici: 2 },
      },
      {
        text: 'Tasarladığım teknik sistemlerin sahada kusursuz bir şekilde çalışmasıyla.',
        scores: { itu: 3, odtu: 2 },
      },
      {
        text: 'Ürettiğim akademik çalışmaların uluslararası düzeyde referans kabul edilmesiyle.',
        scores: { bilkent: 3, odtu: 1 },
      },
      {
        text: 'Toplumsal bir probleme kalıcı çözümler getiren yapılar inşa etmiş olmamla.',
        scores: { bogazici: 3, odtu: 2 },
      },
    ],
  },
  {
    id: 25,
    question: '25. Son olarak, eğitim hayatındaki temel rehber ilken nedir?',
    options: [
      {
        text: 'Bilimsel şüphecilik, derin araştırma ve kusursuz teorik altyapı.',
        scores: { bilkent: 3, odtu: 1 },
      },
      {
        text: 'Uygulanmayan fikir eksiktir; patent, inovasyon ve somut projeler dünyayı değiştirir.',
        scores: { itu: 3, koc: 1 },
      },
      {
        text: 'Sınırları zorlamak, risk almak ve girişimci vizyonla yeni yollar açmak.',
        scores: { koc: 3, bogazici: 2 },
      },
      {
        text: 'Özgür düşünce, köklü gelenek ve dayanışma ruhu.',
        scores: { bogazici: 3, odtu: 2 },
      },
    ],
  },
];
  // ... (App.jsx'teki 25 sorunun tamamını buraya kopyala)
