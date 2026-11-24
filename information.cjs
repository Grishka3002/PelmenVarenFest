const fs = require('node:fs');
const path = require('node:path');
const MAX_GALLERY_PHOTOS = 500;
const defaults = {
  revision: 0,
  title: 'Пельмень Варень — приморский фестиваль пельменей и вареников',
  description: 'Гастрофестиваль «Пельмень Варень» в Приморье: как прошёл первый фестиваль в 2026 году и что известно о новом сезоне. Билеты продаются только на площадке.',
  heading: 'Приморский фестиваль пельменей и вареников',
  lead: 'Команды лепят и варят на костре, гости пробуют, жюри выбирает лучших. Первый фестиваль прошёл 16 мая 2026 года в Лукьяновке у подножия Пидана. Сейчас готовим новый сезон: дату и место объявим здесь.',
  sections: [
    {id:'about', title:'О фестивале', text:'«Пельмень Варень» — праздник домашней кухни под открытым небом. Команды из Приморья — семьи, друзья, коллеги, кафе — привозят свои рецепты и готовят пельмени и вареники прямо на поляне, в котлах на костре. Гости пробуют, болеют за команды, играют на станциях, слушают концерт и гуляют по ярмарке.\n\nВ новом сезоне сохраняем идею первого фестиваля, а программу и организацию обновляем.'},
    {id:'program', title:'Новый сезон', text:'Дата — [дата]. Место проведения — [место]. Программа нового сезона формируется.'},
    {id:'past', title:'Как это было в 2026', text:'Первый Приморский гастрофестиваль «Пельмень Варень» прошёл 16 мая 2026 года в деревне Лукьяновке Шкотовского района, на территории центра активного отдыха «Подножие Пидана». Команды соревновались в шести номинациях, гости пробовали пельмени и вареники, играли на станциях и фотографировались в двух фотозонах.'},
    {id:'visit', title:'Информация гостям', text:'Билеты будут продаваться только на площадке фестиваля. Дату, адрес, стоимость входа, способы оплаты и возрастные условия объявим отдельно.'}
  ],
  // Прошлый фестиваль: по положению 2026 и материалам оргкомитета.
  archive: {
    facts: [
      {value:'16 мая 2026', text:'первый фестиваль в Лукьяновке, у подножия Пидана'},
      {value:'6 номинаций', text:'от классического пельменя до скоростной лепки'},
      {value:'5 человек', text:'в каждой команде. Участие для команд бесплатное'}
    ],
    photo: {src:'/images/season/festival-2026.webp', alt:'Участники и организаторы у баннера «Пельмень Варень» на поляне фестиваля', caption:'Команды и организаторы у баннера фестиваля, 16 мая 2026'},
    gallery: [
      {src:'/images/report-2026/IMG_3132.jpg', alt:'Баннер «Пельмень Варень» на лесной поляне'},
      {src:'/images/report-2026/B62A3284.jpg', alt:'Пельмени с маслом в подносе'},
      {src:'/images/report-2026/IMG_3188.jpg', alt:'Котёл над костром в лесу'},
      {src:'/images/report-2026/IMG_3152.jpg', alt:'Изделия в форме пельменей на деревянной подставке'},
      {src:'/images/report-2026/B62A2773.jpg', alt:'Украшения в виде кокошников и матрёшек на ярмарке'},
      {src:'/images/report-2026/IMG_3137.jpg', alt:'Ярмарочные нашивки с вышитыми надписями'},
      {src:'/images/report-2026/B62A2729.jpg', alt:'Кадр 1 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2737.jpg', alt:'Кадр 2 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2742.jpg', alt:'Кадр 3 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2749.jpg', alt:'Кадр 4 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2760.jpg', alt:'Кадр 5 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2763.jpg', alt:'Кадр 6 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2769.jpg', alt:'Кадр 7 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2774.jpg', alt:'Кадр 9 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2776.jpg', alt:'Кадр 10 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2777.jpg', alt:'Кадр 11 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2779.jpg', alt:'Кадр 12 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2781.jpg', alt:'Кадр 13 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2783.jpg', alt:'Кадр 14 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2784.jpg', alt:'Кадр 15 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2794.jpg', alt:'Кадр 16 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2797.jpg', alt:'Кадр 17 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2802.jpg', alt:'Кадр 18 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2803.jpg', alt:'Кадр 19 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2805.jpg', alt:'Кадр 20 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2806.jpg', alt:'Кадр 21 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2807.jpg', alt:'Кадр 22 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2808.jpg', alt:'Кадр 23 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2809.jpg', alt:'Кадр 24 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2811.jpg', alt:'Кадр 25 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2812.jpg', alt:'Кадр 26 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2813.jpg', alt:'Кадр 27 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2815.jpg', alt:'Кадр 28 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2822.jpg', alt:'Кадр 29 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2824.jpg', alt:'Кадр 30 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2825.jpg', alt:'Кадр 31 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2826.jpg', alt:'Кадр 32 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2827.jpg', alt:'Кадр 33 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2829.jpg', alt:'Кадр 34 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2835.jpg', alt:'Кадр 35 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2836.jpg', alt:'Кадр 36 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2839.jpg', alt:'Кадр 37 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2841.jpg', alt:'Кадр 38 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2842.jpg', alt:'Кадр 39 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2846.jpg', alt:'Кадр 40 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2855.jpg', alt:'Кадр 41 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2875.jpg', alt:'Кадр 42 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2933.jpg', alt:'Кадр 43 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2989.jpg', alt:'Кадр 44 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2993.jpg', alt:'Кадр 45 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2998.jpg', alt:'Кадр 46 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A2999.jpg', alt:'Кадр 47 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3004.jpg', alt:'Кадр 48 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3006.jpg', alt:'Кадр 49 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3028.jpg', alt:'Кадр 50 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3033.jpg', alt:'Кадр 51 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3037.jpg', alt:'Кадр 52 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3039.jpg', alt:'Кадр 53 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3048.jpg', alt:'Кадр 54 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3051.jpg', alt:'Кадр 55 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3057.jpg', alt:'Кадр 56 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3061.jpg', alt:'Кадр 57 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3072.jpg', alt:'Кадр 58 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3081.jpg', alt:'Кадр 59 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3094.jpg', alt:'Кадр 60 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3105.jpg', alt:'Кадр 61 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3109.jpg', alt:'Кадр 62 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3110.jpg', alt:'Кадр 63 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3111.jpg', alt:'Кадр 64 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3121.jpg', alt:'Кадр 65 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3135.jpg', alt:'Кадр 66 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3136.jpg', alt:'Кадр 67 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3138.jpg', alt:'Кадр 68 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3141.jpg', alt:'Кадр 69 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3150.jpg', alt:'Кадр 70 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3159.jpg', alt:'Кадр 71 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3164.jpg', alt:'Кадр 72 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3167.jpg', alt:'Кадр 73 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3170.jpg', alt:'Кадр 74 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3174.jpg', alt:'Кадр 75 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3185.jpg', alt:'Кадр 76 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3223.jpg', alt:'Кадр 77 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3251.jpg', alt:'Кадр 78 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3270.jpg', alt:'Кадр 79 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3271.jpg', alt:'Кадр 80 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3273.jpg', alt:'Кадр 81 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3274.jpg', alt:'Кадр 82 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3304.jpg', alt:'Кадр 84 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3307.jpg', alt:'Кадр 85 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3314.jpg', alt:'Кадр 86 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3328.jpg', alt:'Кадр 87 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3369.jpg', alt:'Кадр 88 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3370.jpg', alt:'Кадр 89 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3371.jpg', alt:'Кадр 90 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3376.jpg', alt:'Кадр 91 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3377.jpg', alt:'Кадр 92 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3392.jpg', alt:'Кадр 93 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3394.jpg', alt:'Кадр 94 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3396.jpg', alt:'Кадр 95 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3400.jpg', alt:'Кадр 96 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3401.jpg', alt:'Кадр 97 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3402.jpg', alt:'Кадр 98 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3403.jpg', alt:'Кадр 99 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3412.jpg', alt:'Кадр 100 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3415.jpg', alt:'Кадр 101 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3419.jpg', alt:'Кадр 102 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3421.jpg', alt:'Кадр 103 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3423.jpg', alt:'Кадр 104 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3430.jpg', alt:'Кадр 105 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3434.jpg', alt:'Кадр 106 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3438.jpg', alt:'Кадр 107 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3445.jpg', alt:'Кадр 108 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3449.jpg', alt:'Кадр 109 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3453.jpg', alt:'Кадр 110 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3461.jpg', alt:'Кадр 111 из фотоотчёта 2026'},
      {src:'/images/report-2026/B62A3468.jpg', alt:'Кадр 112 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3128.jpg', alt:'Кадр 113 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3129.jpg', alt:'Кадр 114 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3131.jpg', alt:'Кадр 115 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3140.jpg', alt:'Кадр 118 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3141.jpg', alt:'Кадр 119 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3144.jpg', alt:'Кадр 120 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3145.jpg', alt:'Кадр 121 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3146.jpg', alt:'Кадр 122 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3147.jpg', alt:'Кадр 123 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3148.jpg', alt:'Кадр 124 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3153.jpg', alt:'Кадр 126 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3156.jpg', alt:'Кадр 127 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3159.jpg', alt:'Кадр 128 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3166.jpg', alt:'Кадр 129 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3170.jpg', alt:'Кадр 130 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3173.jpg', alt:'Кадр 131 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3175.jpg', alt:'Кадр 132 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3180.jpg', alt:'Кадр 133 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3182.jpg', alt:'Кадр 134 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3184.jpg', alt:'Кадр 135 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3190.jpg', alt:'Кадр 137 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3193.jpg', alt:'Кадр 138 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3194.jpg', alt:'Кадр 139 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3197.jpg', alt:'Кадр 140 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3199.jpg', alt:'Кадр 141 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3200.jpg', alt:'Кадр 142 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3201.jpg', alt:'Кадр 143 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3202.jpg', alt:'Кадр 144 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3204.jpg', alt:'Кадр 145 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3205.jpg', alt:'Кадр 146 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3207.jpg', alt:'Кадр 147 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3209.jpg', alt:'Кадр 148 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3211.jpg', alt:'Кадр 149 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3215.jpg', alt:'Кадр 150 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3220.jpg', alt:'Кадр 151 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3222.jpg', alt:'Кадр 152 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3223.jpg', alt:'Кадр 153 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3224.jpg', alt:'Кадр 154 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3225.jpg', alt:'Кадр 155 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3226.jpg', alt:'Кадр 156 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3227.jpg', alt:'Кадр 157 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3230.jpg', alt:'Кадр 158 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3231.jpg', alt:'Кадр 159 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3233.jpg', alt:'Кадр 160 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3234.jpg', alt:'Кадр 161 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3235.jpg', alt:'Кадр 162 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3237.jpg', alt:'Кадр 163 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3240.jpg', alt:'Кадр 164 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3241.jpg', alt:'Кадр 165 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3242.jpg', alt:'Кадр 166 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3243.jpg', alt:'Кадр 167 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3245.jpg', alt:'Кадр 168 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3246.jpg', alt:'Кадр 169 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3247.jpg', alt:'Кадр 170 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3248.jpg', alt:'Кадр 171 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3249.jpg', alt:'Кадр 172 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3250.jpg', alt:'Кадр 173 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3251.jpg', alt:'Кадр 174 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3252.jpg', alt:'Кадр 175 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3253.jpg', alt:'Кадр 176 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3254.jpg', alt:'Кадр 177 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3255.jpg', alt:'Кадр 178 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3256.jpg', alt:'Кадр 179 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3259.jpg', alt:'Кадр 180 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3260.jpg', alt:'Кадр 181 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3278.jpg', alt:'Кадр 182 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3279.jpg', alt:'Кадр 183 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3280.jpg', alt:'Кадр 184 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3281.jpg', alt:'Кадр 185 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3282.jpg', alt:'Кадр 186 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3283.jpg', alt:'Кадр 187 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3284.jpg', alt:'Кадр 188 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3285.jpg', alt:'Кадр 189 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3286.jpg', alt:'Кадр 190 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3287.jpg', alt:'Кадр 191 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3288.jpg', alt:'Кадр 192 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3289.jpg', alt:'Кадр 193 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3290.jpg', alt:'Кадр 194 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3291.jpg', alt:'Кадр 195 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3294.jpg', alt:'Кадр 196 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3295.jpg', alt:'Кадр 197 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3296.jpg', alt:'Кадр 198 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3299.jpg', alt:'Кадр 199 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3300.jpg', alt:'Кадр 200 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3302.jpg', alt:'Кадр 201 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3305.jpg', alt:'Кадр 202 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3306.jpg', alt:'Кадр 203 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3308.jpg', alt:'Кадр 204 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3309.jpg', alt:'Кадр 205 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3313.jpg', alt:'Кадр 206 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3314.jpg', alt:'Кадр 207 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3315.jpg', alt:'Кадр 208 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3320.jpg', alt:'Кадр 209 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3321.jpg', alt:'Кадр 210 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3322.jpg', alt:'Кадр 211 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3323.jpg', alt:'Кадр 212 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3324.jpg', alt:'Кадр 213 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3326.jpg', alt:'Кадр 214 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3327.jpg', alt:'Кадр 215 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3328.jpg', alt:'Кадр 216 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3329.jpg', alt:'Кадр 217 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3330.jpg', alt:'Кадр 218 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3331.jpg', alt:'Кадр 219 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3332.jpg', alt:'Кадр 220 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3336.jpg', alt:'Кадр 221 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3337.jpg', alt:'Кадр 222 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3338.jpg', alt:'Кадр 223 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3339.jpg', alt:'Кадр 224 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3340.jpg', alt:'Кадр 225 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3341.jpg', alt:'Кадр 226 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3344.jpg', alt:'Кадр 227 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3345.jpg', alt:'Кадр 228 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3346.jpg', alt:'Кадр 229 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3348.jpg', alt:'Кадр 230 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3349.jpg', alt:'Кадр 231 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3351.jpg', alt:'Кадр 232 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3353.jpg', alt:'Кадр 233 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3354.jpg', alt:'Кадр 234 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3357.jpg', alt:'Кадр 235 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3360.jpg', alt:'Кадр 236 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3361.jpg', alt:'Кадр 237 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3363.jpg', alt:'Кадр 238 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3364.jpg', alt:'Кадр 239 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3365.jpg', alt:'Кадр 240 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3366.jpg', alt:'Кадр 241 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3367.jpg', alt:'Кадр 242 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3371.jpg', alt:'Кадр 243 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3372.jpg', alt:'Кадр 244 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3373.jpg', alt:'Кадр 245 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3374.jpg', alt:'Кадр 246 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3375.jpg', alt:'Кадр 247 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3376.jpg', alt:'Кадр 248 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3377.jpg', alt:'Кадр 249 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3378.jpg', alt:'Кадр 250 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3379.jpg', alt:'Кадр 251 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3380.jpg', alt:'Кадр 252 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3381.jpg', alt:'Кадр 253 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3382.jpg', alt:'Кадр 254 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3388.jpg', alt:'Кадр 255 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3389.jpg', alt:'Кадр 256 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3391.jpg', alt:'Кадр 257 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3392.jpg', alt:'Кадр 258 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3393.jpg', alt:'Кадр 259 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3394.jpg', alt:'Кадр 260 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3395.jpg', alt:'Кадр 261 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3397.jpg', alt:'Кадр 262 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3398.jpg', alt:'Кадр 263 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3399.jpg', alt:'Кадр 264 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3400.jpg', alt:'Кадр 265 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3402.jpg', alt:'Кадр 266 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3403.jpg', alt:'Кадр 267 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3404.jpg', alt:'Кадр 268 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3405.jpg', alt:'Кадр 269 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3406.jpg', alt:'Кадр 270 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3407.jpg', alt:'Кадр 271 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3410.jpg', alt:'Кадр 272 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3411.jpg', alt:'Кадр 273 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3413.jpg', alt:'Кадр 274 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3414.jpg', alt:'Кадр 275 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3415.jpg', alt:'Кадр 276 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3416.jpg', alt:'Кадр 277 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3417.jpg', alt:'Кадр 278 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3418.jpg', alt:'Кадр 279 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3422.jpg', alt:'Кадр 280 из фотоотчёта 2026'},
      {src:'/images/report-2026/IMG_3423.jpg', alt:'Кадр 281 из фотоотчёта 2026'}
    ],
    albumUrl: 'https://yadi.sk/d/q1wA7-uUI-yGsA',
    day: [
      {time:'11:00', text:'Встречаем гостей, открывается ярмарка'},
      {time:'12:00', text:'Торжественное открытие фестиваля'},
      {time:'12:00–13:30', text:'Команды лепят и варят, идёт конкурс скоростной лепки'},
      {time:'13:30', text:'Команды представляют свои блюда на сцене'},
      {time:'14:00', text:'Дегустация, оценка профессионального и народного жюри'},
      {time:'14:30', text:'Награждение победителей'}
    ],
    nominations: [
      {title:'Классический пельмень', text:'традиционные рецепты с мясной начинкой'},
      {title:'Пельмень дальневосточный', text:'дары моря и дикоросы Приморья'},
      {title:'Нежный вареник', text:'ягоды, творог, картошка, капуста, грибы'},
      {title:'Авторский взгляд', text:'самые необычные пельмени и вареники'},
      {title:'Лучшая презентация', text:'артистизм команды на сцене'},
      {title:'Скоростная лепка', text:'кто больше и аккуратнее слепит за отведённое время'}
    ],
    extras: ['Концерт на сценической поляне', 'Станции: бои подушками, канат, ходули, «Царевна Несмеяна»', 'Две фотозоны: из берёзы и сена и нейрофотозона в образах старорусских героев', 'Ярмарка мастеров', 'Своя фестивальная валюта для станций и фотозоны', 'Гимн фестиваля «Пельмень Варень»'],
    partnersTitle: 'Нам помогали в 2026',
    partners: [
      {name:'Щедрая поляна', src:'/images/season/partner-shchedraya-polyana.webp', url:''},
      {name:'Проект «Лица»', src:'/images/partner/2.webp', url:''},
      {name:'Семечки «Джинн»', src:'/images/partner/3.webp', url:''},
      {name:'Центр «Мой бизнес»', src:'/images/partner/4.webp', url:''},
      {name:'МТС', src:'/images/partner/5.webp', url:''}
    ]
  },
  articles: [{slug:'tickets-on-site', title:'Как купить билет на «Пельмень Варень»', description:'Продажа билетов на площадке и информация перед поездкой.', text:'В новом сезоне билеты будут продаваться только на площадке фестиваля. Оформлять онлайн-заказ заранее не нужно.\n\nСтоимость входа, способы оплаты и часы работы кассы пока не объявлены. Эти сведения добавим после утверждения.\n\nПеред поездкой проверьте дату, адрес и условия посещения в разделе для гостей. Цены из материалов прошлого сезона не подтверждают стоимость входа на новый фестиваль.', published:true}]
};

// Персонажи фестиваля (фирменный стиль, не редактируются).
const mascots = [
  {name:'Пельмешка', src:'mascot-pelmeshka', text:'Классика. Надёжный, домашний, всегда к месту.'},
  {name:'Варенька Вишневич', src:'mascot-varenka', text:'Нежная душа со сладкой начинкой.'},
  {name:'Гёдзик', src:'mascot-gedzik', text:'Хрустит снаружи, мягкий внутри.'},
  {name:'Доктор Момо', src:'mascot-momo', text:'Мудрец из Непала, готовится на пару.'},
  {name:'Хинкалидзе', src:'mascot-hinkalidze', text:'Щедрый, полон бульона и сюрпризов.'}
];

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paragraphs = text => text.split(/\n\s*\n/).filter(Boolean).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('');
// Текст статьи: пустая строка — новый абзац; короткая строка без точки в конце — подзаголовок; строки с «•» или «- » — список.
function richText(text) {
  return text.split(/\n\s*\n/).map(b=>b.trim()).filter(Boolean).map(block=>{
    const lines=block.split('\n').map(l=>l.trim()).filter(Boolean);
    if(lines.length===1&&lines[0].length<=90&&!/[.!?:;…,»)"]$/.test(lines[0])&&!/^(•|- )/.test(lines[0]))return `<h2>${esc(lines[0])}</h2>`;
    let html='',list=[],para=[];
    const flush=()=>{if(para.length){html+=`<p>${para.map(esc).join('<br>')}</p>`;para=[];}if(list.length){html+=`<ul>${list.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>`;list=[];}};
    for(const line of lines){const m=line.match(/^(?:•|- )\s*(.+)$/);if(m){if(para.length){const p=para;para=[];html+=`<p>${p.map(esc).join('<br>')}</p>`;}list.push(m[1]);}else{if(list.length)flush();para.push(line);}}
    flush();
    return html;
  }).join('');
}

// Проверки. Сообщения называют поле, чтобы в редакторе было понятно, что исправить.
const fail = message => { throw Error(message); };
function str(v, max, label, optional=false) {
  if (optional && (v === undefined || v === null || (typeof v === 'string' && !v.trim()))) return '';
  if (typeof v !== 'string' || !v.trim()) fail(`Заполните поле «${label}».`);
  if (v.length > max) fail(`Поле «${label}» длиннее ${max} символов.`);
  return v.trim();
}
const IMAGE_SRC = /^\/images\/(?!.*\.\.)[A-Za-z0-9_\-./]+\.(?:webp|png|jpe?g|gif)$/;
function image(v, label, optional=false) {
  const value = str(v, 300, label, optional);
  if (value && !IMAGE_SRC.test(value)) fail(`«${label}»: нужен файл из папки сайта /images.`);
  return value;
}
function link(v, label) {
  const value = str(v, 500, label, true);
  if (value && !/^https:\/\/[^\s"'<>]+$/.test(value)) fail(`«${label}»: ссылка должна начинаться с https://`);
  return value;
}
function list(v, max, label, item) {
  if (v === undefined) return [];
  if (!Array.isArray(v)) fail(`Неверный список «${label}».`);
  if (v.length > max) fail(`В списке «${label}» не больше ${max} пунктов.`);
  return v.map((x, i) => item(x || {}, i + 1));
}
function validateArchive(a) {
  if (!a || typeof a !== 'object') return structuredClone(defaults.archive);
  const photo = a.photo || {};
  return {
    facts: list(a.facts, 4, 'Факты', (f,n)=>({value:str(f.value,40,`Факт ${n}: крупно`), text:str(f.text,160,`Факт ${n}: пояснение`)})),
    photo: {src:image(photo.src,'Главное фото',true), alt:str(photo.alt,300,'Описание главного фото',true), caption:str(photo.caption,300,'Подпись к главному фото',true)},
    gallery: list(a.gallery ?? defaults.archive.gallery, MAX_GALLERY_PHOTOS, 'Фотоальбом', (g,n)=>({src:image(g.src,`Фото ${n}`), alt:str(g.alt,300,`Фото ${n}: описание`,true)})),
    albumUrl: link(a.albumUrl ?? defaults.archive.albumUrl, 'Ссылка на все фото и видео'),
    day: list(a.day, 6, 'Как прошёл день', (d,n)=>({time:str(d.time,20,`День, пункт ${n}: время`), text:str(d.text,160,`День, пункт ${n}: что происходило`)})),
    nominations: list(a.nominations, 12, 'Номинации', (x,n)=>({title:str(x.title,80,`Номинация ${n}: название`), text:str(x.text,200,`Номинация ${n}: пояснение`,true)})),
    extras: list(a.extras, 12, 'Ещё в программе', (x,n)=>str(typeof x==='string'?x:'',200,`Программа, пункт ${n}`)),
    partnersTitle: str(a.partnersTitle ?? defaults.archive.partnersTitle, 120, 'Заголовок партнёров'),
    partners: list(a.partners, 24, 'Партнёры', (p,n)=>({name:str(p.name,120,`Партнёр ${n}: название`), src:image(p.src,`Партнёр ${n}: логотип`), url:link(p.url,`Партнёр ${n}: сайт`)}))
  };
}
function validate(input) {
  const data={revision:input.revision,title:str(input.title,180,'Заголовок для поиска'),description:str(input.description,500,'Описание для поиска'),heading:str(input.heading,250,'Заголовок главной'),lead:str(input.lead,3000,'Вступление')};
  if(!Number.isInteger(data.revision)||data.revision<0)fail('Неверная версия документа.');
  if(!Array.isArray(input.sections)||input.sections.length!==4)fail('Нужны четыре раздела главной.');
  data.sections=defaults.sections.map((base,i)=>({id:base.id,title:str(input.sections[i].title,250,`Раздел «${base.title}»: заголовок`),text:str(input.sections[i].text,20000,`Раздел «${base.title}»: текст`)}));
  data.archive=validateArchive(input.archive);
  if(!Array.isArray(input.articles)||input.articles.length>100)fail('Допустимо до 100 статей.');
  const slugs=new Set();
  data.articles=input.articles.map((a,i)=>{const n=`Статья ${i+1}`;const slug=str(a.slug,100,`${n}: адрес`);if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))fail(`${n}: адрес — только латиница, цифры и дефис.`);if(slugs.has(slug))fail(`${n}: такой адрес уже есть у другой статьи.`);slugs.add(slug);if(typeof a.published!=='boolean')fail(`${n}: неверный статус.`);return {slug,title:str(a.title,180,`${n}: заголовок`),description:str(a.description,500,`${n}: краткое описание`),text:str(a.text,50000,`${n}: текст`),published:a.published};});
  return data;
}
function createStore(file) {
  const read=()=>fs.existsSync(file)?validate(JSON.parse(fs.readFileSync(file,'utf8'))):structuredClone(defaults);
  const save=input=>{const data=validate(input);if(data.revision!==read().revision){const error=Error('Данные изменились в другой вкладке. Перезагрузите редактор перед сохранением.');error.status=409;throw error;}data.revision++;fs.mkdirSync(path.dirname(file),{recursive:true});const tmp=file+'.tmp';fs.writeFileSync(tmp,JSON.stringify(data,null,2),'utf8');fs.renameSync(tmp,file);return data;};
  return {read,save};
}

const section = (data,id) => data.sections.find(s=>s.id===id);
const articleCards = articles => articles.map(a=>`<li class="article-card"><a href="/articles/${a.slug}/"><span class="article-card__title">${esc(a.title)}</span><span class="article-card__text">${esc(a.description)}</span></a></li>`).join('');

function renderReport(a) {
  const gallery = a.gallery;
  const album = a.albumUrl ? `<p class="album"><a class="button report__album" href="${esc(a.albumUrl)}">Все фото и видео на Яндекс Диске</a></p>` : '';
  const photos = `<ul class="gallery">${gallery.map((g,i)=>`<li><a href="${esc(g.src)}" data-report-photo aria-label="Открыть фото ${i+1}: ${esc(g.alt)}"><img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy" decoding="async"><span class="report__caption">${esc(g.alt)}</span></a></li>`).join('')}</ul>`;
  const viewer = `<dialog class="photo-viewer" aria-label="Просмотр фотоотчёта"><div class="photo-viewer__tools"><p class="photo-viewer__count" aria-live="polite"></p><button type="button" data-close autofocus>Закрыть ×</button></div><img class="photo-viewer__image" alt=""><div class="photo-viewer__navigation"><button type="button" data-previous aria-label="Предыдущее фото">← Назад</button><a data-original target="_blank" rel="noopener">Открыть снимок</a><button type="button" data-next aria-label="Следующее фото">Далее →</button></div></dialog><script src="/information-gallery.js" defer></script>`;
  return `<section class="block report-block" id="photo-report" aria-labelledby="report-title"><div class="report"><h2 id="report-title">Фотоотчёт 2026</h2><p class="report__date">16 мая · Лукьяновка, у подножия Пидана</p>${gallery.length ? photos : ''}${album}${gallery.length ? viewer : ''}</div></section>`;
}

function renderPast(past, a) {
  const facts = a.facts.length ? `<dl class="facts">${a.facts.map(f=>`<div><dt>${esc(f.value)}</dt><dd>${esc(f.text)}</dd></div>`).join('')}</dl>` : '';
  const photo = a.photo.src ? `<figure class="photo"><img src="${esc(a.photo.src)}" alt="${esc(a.photo.alt)}" loading="lazy">${a.photo.caption?`<figcaption>${esc(a.photo.caption)}</figcaption>`:''}</figure>` : '';
  const day = a.day.length ? `<h3 class="sub">Как прошёл день</h3><p class="note">Пока команды лепили, день складывался, как пельмень: от начинки до последнего защипа.</p><ol class="day">${a.day.map((d,i)=>`<li><img src="/images/season/stage-${i+1}.webp" width="420" height="286" alt="" loading="lazy"><time>${esc(d.time)}</time><span>${esc(d.text)}</span></li>`).join('')}</ol>` : '';
  const noms = a.nominations.length ? `<div><h3 class="sub">Номинации</h3><ul class="nominations">${a.nominations.map(n=>`<li><strong>${esc(n.title)}</strong>${n.text?` — ${esc(n.text)}`:''}</li>`).join('')}</ul></div>` : '';
  const extras = a.extras.length ? `<div><h3 class="sub">Ещё в программе</h3><ul class="extras">${a.extras.map(e=>`<li>${esc(e)}</li>`).join('')}</ul></div>` : '';
  return `<section class="block past" id="past"><div class="past__intro"><h2>${esc(past.title)}</h2>${paragraphs(past.text)}</div>${facts}${photo}${day}${noms||extras?`<div class="past__columns">${noms}${extras}</div>`:''}</section>`;
}

function renderHome(data, published) {
  const about=section(data,'about'), program=section(data,'program'), past=section(data,'past'), visit=section(data,'visit'), a=data.archive;
  const relatives=published.find(x=>x.slug==='pelmeni-gyoza-khinkali-momo');
  return `
<section class="hero" aria-labelledby="hero-title">
  <span class="hero__flowers" aria-hidden="true"></span>
  <div class="hero__inner">
    <div class="hero__text">
      <span class="wordmark" role="img" aria-label="Пельмень Варень"></span>
      <h1 id="hero-title">${esc(data.heading)}</h1>
      <p class="hero__lead">${esc(data.lead)}</p>
      <div class="hero__actions">
        <a class="button button--milk" href="#photo-report">Фотоотчёт 2026</a>
        <a class="button button--line" href="#visit">Информация гостям</a>
      </div>
    </div>
    <img class="hero__mascot" src="/images/season/mascot-pelmeshka.webp" width="420" height="604" alt="Пельмешка — персонаж фестиваля">
  </div>
</section>
<div class="rushnik" aria-hidden="true"></div>

${renderReport(a)}

<section class="block about" id="about">
  <div class="about__text">
    <h2>${esc(about.title)}</h2>
    ${paragraphs(about.text)}
  </div>
  <img class="about__mascot" src="/images/season/mascot-pelmeshka.webp" width="420" height="604" alt="Пельмешка — главный персонаж фестиваля" loading="lazy">
</section>

${renderPast(past, a)}

<section class="block characters" id="characters" aria-labelledby="characters-title">
  <h2 id="characters-title">Какой ты пельмень?</h2>
  <p class="note">Персонажи фестиваля. В квизе прошлого сезона гости узнавали, на кого из них похожи.${relatives?` <a href="/articles/${relatives.slug}/">Чем они отличаются на самом деле</a>`:''}</p>
  <ul class="mascots">${mascots.map(m=>`<li><img src="/images/season/${m.src}.webp" alt="" loading="lazy"><strong>${esc(m.name)}</strong><span>${esc(m.text)}</span></li>`).join('')}</ul>
</section>

<section class="block season" id="program">
  <h2>${esc(program.title)}</h2>
  ${paragraphs(program.text)}
</section>

<section class="block visit" id="visit">
  <div class="visit__text">
    <h2>${esc(visit.title)}</h2>
    ${paragraphs(visit.text)}
  </div>
  <figure class="photo photo--small">
    <img src="/images/season/venue-aerial.webp" width="1400" height="788" alt="Поляна и парковка центра активного отдыха «Подножие Пидана» с высоты" loading="lazy">
    <figcaption>Площадка первого фестиваля с высоты. Где пройдёт новый сезон, сообщим отдельно.</figcaption>
  </figure>
</section>

${published.length?`<section class="block articles" aria-labelledby="articles-title">
  <h2 id="articles-title">Почитать</h2>
  <ul class="article-list">${articleCards(published.slice(0,6))}</ul>
  <p><a class="more" href="/articles/">Все статьи</a></p>
</section>`:''}

${a.partners.length?`<section class="block partners" aria-labelledby="partners-title">
  <h2 id="partners-title">${esc(a.partnersTitle)}</h2>
  <ul class="partner-list">${a.partners.map(p=>{const img=`<img src="${esc(p.src)}" alt="${esc(p.name)}" loading="lazy">`;return `<li>${p.url?`<a href="${esc(p.url)}" rel="noopener">${img}</a>`:img}</li>`;}).join('')}</ul>
</section>`:''}`;
}

function render(data,route,base='') {
  if(!data.archive)data={...data,archive:structuredClone(defaults.archive)};
  let title=data.title,description=data.description,body;
  const published=data.articles.filter(a=>a.published);
  if(route==='/')body=renderHome(data,published);
  else if(route==='/articles/'){title='Статьи о фестивале «Пельмень Варень»';description='Материалы о фестивале, пельменях и варениках.';body=`<section class="block page-head"><h1>Статьи</h1><p class="note">О фестивале, пельменях, варениках и их родственниках.</p></section><section class="block">${published.length?`<ul class="article-list">${articleCards(published)}</ul>`:'<p>Материалы готовятся.</p>'}</section>`;}
  else {
    const article=published.find(a=>route===`/articles/${a.slug}/`);if(!article)return null;
    title=article.title;description=article.description;
    const more=published.filter(a=>a!==article).slice(0,3);
    body=`<article class="block article"><p class="crumbs"><a href="/articles/">Все статьи</a></p><h1>${esc(article.title)}</h1><p class="article__lead">${esc(article.description)}</p><div class="article__body">${richText(article.text)}</div></article>${more.length?`<section class="block articles"><h2>Ещё почитать</h2><ul class="article-list">${articleCards(more)}</ul></section>`:''}`;
  }
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#f2eadf"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">${base?`<link rel="canonical" href="${esc(base+route)}"><meta property="og:image" content="${esc(base+'/images/season/mascot-pelmeshka.webp')}">`:''}<link rel="icon" href="/images/logo.webp"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&family=Cormorant+SC:wght@400;600;700&display=swap"><link rel="stylesheet" href="/information.css"></head><body${route==='/'?' class="home"':''}><a class="skip-link" href="#main">К содержимому</a><header class="topbar"><a class="brand" href="/"><img src="/images/season/mascot-pelmeshka.webp" width="420" height="604" alt=""><span>Пельмень Варень</span></a><nav class="nav" aria-label="Главная навигация"><a class="nav__report" href="/#photo-report">Фотоотчёт</a><a href="/#about">О фестивале</a><a href="/#past">Как это было</a><a href="/#program">Новый сезон</a><a href="/#visit">Гостям</a><a href="/articles/">Статьи</a></nav></header><main id="main">${body}</main><footer class="footer"><div class="rushnik" aria-hidden="true"></div><div class="footer__inner"><span class="wordmark wordmark--small" role="img" aria-label="Пельмень Варень"></span><p>Приморский гастрофестиваль пельменей и вареников. Билеты продаются только на площадке фестиваля.</p><nav aria-label="Ссылки в подвале"><a href="/#past">Как это было</a><a href="/#visit">Гостям</a><a href="/articles/">Статьи</a></nav></div></footer></body></html>`;
}
module.exports={defaults,validate,createStore,render,richText};
