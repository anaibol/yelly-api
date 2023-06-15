import { PrismaClient } from '@prisma/client'

const countries = [
  {
    id: '4ca7959d-6719-4f98-8f4e-b4f1c42161ab',
    code: 'af',
  },
  {
    id: '34b92990-1df7-4f10-bbd4-f020681fd5bb',
    code: 'za',
  },
  {
    id: 'c0a40f84-d8b4-4f08-be01-667f1817232c',
    code: 'al',
  },
  {
    id: '9f43ca29-7eff-4f12-abc6-74f355365b8d',
    code: 'dz',
  },
  {
    id: '56808c22-17d0-4fc7-9908-e97e2e4cbe92',
    code: 'de',
  },
  {
    id: '8754b65c-9c89-4fd6-889e-3393df44c2d4',
    code: 'ad',
  },
  {
    id: 'aef20c65-f412-4faa-a7e7-9ccbb411bfac',
    code: 'ao',
  },
  {
    id: '353d17c0-a2f3-4fa2-9ef0-5e043d6aab13',
    code: 'sa',
  },
  {
    id: '2008e2ad-7333-4f57-9a59-4a071707c928',
    code: 'ar',
  },
  {
    id: '9399349f-0326-4fed-9cd5-7a7765d80d42',
    code: 'am',
  },
  {
    id: '88da149e-c3c9-4f80-869f-84d088fe5674',
    code: 'au',
  },
  {
    id: '4663cc44-1e10-4f39-ab93-8b419b7fe6ee',
    code: 'at',
  },
  {
    id: 'e35ee726-9242-4f65-b130-5ec43ca4023b',
    code: 'az',
  },
  {
    id: '2b1dc2e0-53ae-4f6d-bf67-365524c874c1',
    code: 'bh',
  },
  {
    id: 'e543e516-50b6-4f34-8c90-5322f7af82d5',
    code: 'bd',
  },
  {
    id: '95b03915-91d4-4f4f-8113-5febdfdb83cd',
    code: 'bb',
  },
  {
    id: '3fed0422-8ac2-4fa9-8fa5-327646461088',
    code: 'be',
  },
  {
    id: '77d8cd5e-d461-4f5f-9167-b1e912c7e359',
    code: 'bj',
  },
  {
    id: 'c12dec08-dbe0-4f6b-85bc-58a74ded14a5',
    code: 'by',
  },
  {
    id: 'd461f722-c25e-4f62-a71a-f64603402a4b',
    code: 'bo',
  },
  {
    id: '36f9ef95-ddf5-4fcd-ae56-72953505a3a4',
    code: 'ba',
  },
  {
    id: 'aa2ff000-970f-4f0e-ad6d-9f36cfd6b329',
    code: 'bw',
  },
  {
    id: 'f87f2b0c-8355-4f31-b5e8-8a7f54fde609',
    code: 'br',
  },
  {
    id: '58bcf768-0243-4f8f-94d3-ea8c4a85ba93',
    code: 'bg',
  },
  {
    id: '3f0100ea-6321-4f33-90f1-634e896e6536',
    code: 'bf',
  },
  {
    id: '4051ed43-a197-4f90-9388-105d98b79c9f',
    code: 'bi',
  },
  {
    id: 'dcb7faa4-7750-4fa4-a741-b0debd094e38',
    code: 'kh',
  },
  {
    id: '7bcf08cc-236e-4ff4-80e2-36fa26953041',
    code: 'cm',
  },
  {
    id: '280e3679-9401-4f80-8df8-448814d81396',
    code: 'ca',
  },
  {
    id: '4dda49ea-34d5-4fa1-9fb8-5ceb76a27a01',
    code: 'cv',
  },
  {
    id: '42557e48-4ff9-4fad-9d48-626b5c16893f',
    code: 'cl',
  },
  {
    id: '3ff97410-cc8f-4f50-bd1e-d6d68c7c3997',
    code: 'cn',
  },
  {
    id: '47b9c2fc-665f-4f92-b4ca-c668fdb74625',
    code: 'co',
  },
  {
    id: '1ba8f079-7643-4f55-9d18-b5d10aeec301',
    code: 'km',
  },
  {
    id: '0739471c-d7bc-4f2e-af7b-7ece1366978a',
    code: 'kp',
  },
  {
    id: '02ad5333-a086-4f55-b65f-1b43ca51c00a',
    code: 'kr',
  },
  {
    id: '606d3ad3-f924-4fa0-8786-581a6fdc3aa4',
    code: 'ci',
  },
  {
    id: 'cfd0a705-8230-4feb-84b6-627dea15f32f',
    code: 'hr',
  },
  {
    id: '655c22fb-6705-4f32-84d3-2de21837aa8a',
    code: 'cu',
  },
  {
    code: 'cy',
    id: '0d3e3182-25a7-4aa0-8460-ed640c3be24c',
  },
  {
    id: '5357d4cf-f95f-4f17-8976-eee75c755495',
    code: 'dk',
  },
  {
    id: 'd45c9c04-b7f2-4f4a-92f7-8af412419629',
    code: 'dj',
  },
  {
    id: '067c2c7a-8a3b-4f0d-84ed-43e7510b9542',
    code: 'dm',
  },
  {
    id: 'a5869f68-a45b-4f2b-86d0-462a627d81a0',
    code: 'eg',
  },
  {
    id: '316a4edd-9657-4f40-adcb-cfa403924cde',
    code: 'sv',
  },
  {
    id: 'ffb127a9-57b8-4f3c-bac3-ba3b0d0cb65d',
    code: 'ae',
  },
  {
    id: '88b89fd1-5dd1-4f6e-a80b-5c14771df340',
    code: 'ec',
  },
  {
    id: '1aa65d1f-e4b5-4fe9-bef1-794945727e6c',
    code: 'es',
  },
  {
    id: '240a9ffe-c323-4f50-8465-e8db0c6ef63a',
    code: 'ee',
  },
  {
    id: '3f9664be-e0e4-4f46-b544-b8cb11505434',
    code: 'us',
  },
  {
    id: 'a45d04b7-3a8b-4f0d-8643-a0e66f4d5b86',
    code: 'et',
  },
  {
    id: '765e4e11-d1cd-4f19-b965-2a36bd85d55a',
    code: 'fi',
  },
  {
    id: 'e4eee8e7-2770-4fb0-97bb-4839b06ff37b',
    code: 'fr',
  },
  {
    id: '4bad7a49-23ba-4fd6-acfb-704af1f6ed9a',
    code: 'ga',
  },
  {
    id: '6982d2d5-86d4-4f17-88d9-93d16ddd5b5d',
    code: 'gm',
  },
  {
    id: '6f064ddf-9950-4fa1-84b8-3ccc35cd65ac',
    code: 'ge',
  },
  {
    id: '989d71ea-26a2-4fb5-80e5-06c3fec1b973',
    code: 'gh',
  },
  {
    id: 'd580e3b8-a923-4f4a-96f0-04d09d7b0659',
    code: 'gr',
  },
  {
    id: '8503d39f-e98d-4f06-be4a-ffa1731f1847',
    code: 'gp',
  },
  {
    id: 'fb7d9ee3-2f91-4f00-998d-041862171622',
    code: 'gt',
  },
  {
    id: '636b5af9-5e0f-4fdc-ae7e-f053fc686155',
    code: 'gg',
  },
  {
    id: 'd182d493-d30a-4fa4-b146-b7aa8467d272',
    code: 'gn',
  },
  {
    id: '8528ee0d-b495-4f7c-9d69-9ebb87b275bd',
    code: 'gq',
  },
  {
    id: '8f5e7d38-c2e1-4f60-b368-d95539b8f58a',
    code: 'gw',
  },
  {
    id: 'd9b5d369-dd25-4f9c-a2c1-57cddbb7e8f4',
    code: 'gf',
  },
  {
    id: 'f70336c6-2ef1-4f0e-9be6-ed5a80c2b2dd',
    code: 'ht',
  },
  {
    id: '37245a2e-7f5f-4f0f-96a4-1907f9aed4cf',
    code: 'hn',
  },
  {
    id: '24af8985-0aef-4f9a-afe3-22d7fc21d1cf',
    code: 'hk',
  },
  {
    id: 'a2deae0a-b04a-4f94-8d61-d3820fa89fdd',
    code: 'hu',
  },
  {
    id: 'f9dbc8b9-f880-4faa-98a8-0350786ebc6e',
    code: 'in',
  },
  {
    id: '2bdcd134-ed2e-4ffa-b042-73d7cab55232',
    code: 'id',
  },
  {
    id: '58ef55ec-482b-4f22-a805-d762ac39b1bd',
    code: 'iq',
  },
  {
    id: '10d8c0bc-65e8-4f73-88a7-30e2ce104ef1',
    code: 'ir',
  },
  {
    id: '48839ddc-ee89-4fd6-ba5a-a66c34fa418c',
    code: 'ie',
  },
  {
    id: '9c30d258-3cfd-4fe3-ba65-0ccdde3878b9',
    code: 'is',
  },
  {
    id: '739b1d01-9c48-4fc7-a3b2-5ed7abb9cc97',
    code: 'il',
  },
  {
    id: 'f2c60f03-f093-4f72-8070-8adf71edccac',
    code: 'it',
  },
  {
    id: '33518a05-5a35-4fa9-a0ab-962e8394727a',
    code: 'jm',
  },
  {
    id: '97effdca-2cd9-4f89-a3f0-76bb5a0f014b',
    code: 'jp',
  },
  {
    id: '03a363e5-b44d-4fde-bb09-01fafb028634',
    code: 'jo',
  },
  {
    id: '11f24f92-5519-4fba-ae44-dd74d4882147',
    code: 'ke',
  },
  {
    id: '21777489-5bb2-4f69-90b8-f65f3159c98b',
    code: 'kg',
  },
  {
    id: '5561f928-175a-4f36-89d7-bc314f36ba1b',
    code: 'kw',
  },
  {
    id: 'e47e878f-19f1-4f1e-80b4-989e1df83ee3',
    code: 'la',
  },
  {
    id: '43cdf524-a466-4fc5-89c1-b0b66240ad62',
    code: 'ls',
  },
  {
    id: 'aa87066d-9818-4f5e-ad88-459d1984b004',
    code: 'lv',
  },
  {
    id: 'e88d5dca-1298-4f8f-9d8c-c246f66016b4',
    code: 'lb',
  },
  {
    id: '33312352-e426-4f2f-ac98-01540928b9b7',
    code: 'ly',
  },
  {
    id: '30532e43-3953-4fda-8ccf-69bd18a934fb',
    code: 'lt',
  },
  {
    id: '332c16cd-9282-4f0c-b198-14dea1e15090',
    code: 'lu',
  },
  {
    id: '142f9156-623e-4f85-8d56-d8259e1f1d0f',
    code: 'mk',
  },
  {
    id: 'a13c45e2-d2ef-4f51-a921-31373f9a67cf',
    code: 'mg',
  },
  {
    id: '42aa99ec-bdc5-4fd6-aacc-b6a2c755d2ed',
    code: 'my',
  },
  {
    id: '148a3dbd-c0ab-4f74-b2e6-55ee406560a0',
    code: 'ml',
  },
  {
    id: 'e2d6a120-b76f-4f4e-b5db-dbc169e7f0ea',
    code: 'mt',
  },
  {
    id: '2371fc82-e63d-4fa1-8897-12ee1f4a536a',
    code: 'ma',
  },
  {
    id: '4f2947fc-0d2d-4f45-a432-7e785c2ef576',
    code: 'mq',
  },
  {
    id: 'a269adb9-08ad-4f8a-bb5f-2f042abaaccd',
    code: 'mu',
  },
  {
    id: '6687e1dc-e8a6-4f0e-9dad-98755b97d48a',
    code: 'mr',
  },
  {
    id: '12deed2b-58c8-4f6e-97ff-29f3c6251cc3',
    code: 'yt',
  },
  {
    id: '78fc3a37-0909-4ffa-b5d8-052d67dac3b1',
    code: 'mx',
  },
  {
    id: 'bea79c2c-14c4-4f66-a503-afc477aa9c86',
    code: 'md',
  },
  {
    id: '3bb738d4-8704-4f07-a72b-5d2f1c1b5419',
    code: 'mc',
  },
  {
    id: '6436a3a6-d30b-4f98-b9fe-2e4d0c8ae0e5',
    code: 'mn',
  },
  {
    id: '6a877329-4bd8-4f3b-8017-7e76bab7138b',
    code: 'me',
  },
  {
    id: '36970d6a-a80a-4fa4-9917-71b49823dc55',
    code: 'mz',
  },
  {
    id: 'a1d751dd-38c1-4f86-84db-b80a4c2d9768',
    code: 'np',
  },
  {
    id: '8b05b998-eacb-4fcb-b728-6ffe101c4a29',
    code: 'ni',
  },
  {
    id: '5d8c90c6-a5e6-4f95-8ab3-8020b6bfeef4',
    code: 'ne',
  },
  {
    id: '566dc6f7-0632-4fbb-abeb-5fa8d9cbced7',
    code: 'ng',
  },
  {
    id: '4fd4705c-71a5-4f6e-a85e-2a5de2febb33',
    code: 'no',
  },
  {
    id: '745edc60-5036-4f72-ae3f-368f43f56dc9',
    code: 'nc',
  },
  {
    id: '07fe0a31-715a-4f99-b013-9a78d091e701',
    code: 'nz',
  },
  {
    id: '0015f5a2-46da-4230-afc1-1ccd9e82e3e4',
    code: 'om',
  },
  {
    id: '42d4d500-0199-4fae-ac15-978035d31337',
    code: 'ug',
  },
  {
    id: '56949438-23b6-4fd7-9034-48946a33617a',
    code: 'uz',
  },
  {
    id: '4f047423-36cd-4f94-8309-517f9861ff33',
    code: 'pk',
  },
  {
    id: '90ecbff5-2ac6-4f10-bdab-117ebd00830c',
    code: 'pa',
  },
  {
    id: 'c2a324a6-3232-4fd3-92fe-d8d145d151c7',
    code: 'pg',
  },
  {
    id: '29c5e335-21ee-4f7f-a2ea-6b1ae2e49894',
    code: 'py',
  },
  {
    id: 'de84de4a-c9b1-4fd9-8623-12b4fefecdd6',
    code: 'nl',
  },
  {
    id: '4a474a73-f4ab-4f3b-a070-19a9bbba60a8',
    code: 'pe',
  },
  {
    id: '99298b2f-9fcd-4f96-9064-e7a2a5066d31',
    code: 'ph',
  },
  {
    id: '24ec770a-aa1e-4fa4-a0c5-180a1ba160eb',
    code: 'pl',
  },
  {
    id: 'da7fb748-8e08-4fa4-9e6d-b5f43ee41e76',
    code: 'pf',
  },
  {
    id: '68d69b62-f749-4f41-b42f-d4959b03423c',
    code: 'pt',
  },
  {
    id: '1da8ebb5-9cd5-4ea3-aa4f-5e92994010a1',
    code: 'pr',
  },
  {
    id: '043fffdd-39bf-4f46-becb-c49e8b14b4a9',
    code: 'qa',
  },
  {
    id: '475671bc-c9d1-4fe3-900f-9fa21584297a',
    code: 'cf',
  },
  {
    id: '626421e6-537f-4fc8-a202-32807e1f163b',
    code: 'cd',
  },
  {
    id: 'a9eca10f-4d14-4fe0-ba0b-972c9fab9888',
    code: 'do',
  },
  {
    id: 'f2ed5e43-8921-4f94-a13b-d5c2480f8865',
    code: 'cg',
  },
  {
    id: '53c8ea2f-9635-4f76-b9c0-32b3d58ba7fc',
    code: 're',
  },
  {
    id: '26d11c19-bf73-4f47-bacf-420d122fc3ca',
    code: 'ro',
  },
  {
    id: '2a9f826e-c71c-4fb1-9dad-4511ba75a460',
    code: 'gb',
  },
  {
    id: 'e56fd39a-4d96-4f26-8b22-0d0ba536abef',
    code: 'ru',
  },
  {
    id: '30880520-643a-4f9e-93d9-716ec012136f',
    code: 'rw',
  },
  {
    id: '10c6596a-27a0-4501-8e43-2ddf5a84f1bf',
    code: 'bl',
  },
  {
    id: '72f250af-c473-4f67-9aa8-a772378ce132',
    code: 'mf',
  },
  {
    id: '4bd9f8c5-d5e5-4f37-8012-5a358bd84477',
    code: 'pm',
  },
  {
    id: '4c401f4f-115b-4fab-95b7-d810810a8742',
    code: 'lc',
  },
  {
    id: '7c997357-37b8-4195-a4a6-1c51a5eb3ec3',
    code: 'ws',
  },
  {
    id: 'cfebc182-cd0f-4f53-858c-dd3c59a4fa7a',
    code: 'sn',
  },
  {
    id: '0e3e3230-6ea9-4fd4-a86e-7bdd4b259b08',
    code: 'rs',
  },
  {
    id: 'b0895814-46e8-4ff3-bb03-5d5891e58fa3',
    code: 'sc',
  },
  {
    id: 'a0ae2660-78f0-4f39-8897-8e70011a8d22',
    code: 'sg',
  },
  {
    id: 'a0772ad4-a329-4f77-86e0-ccab3a273c8d',
    code: 'sk',
  },
  {
    id: '220d197a-9de7-4fbf-88d7-ff03c0d495ec',
    code: 'si',
  },
  {
    id: '7a7f57d8-014f-4f52-8dbb-be34824c6b5b',
    code: 'so',
  },
  {
    id: '114e2175-68e2-4f95-8fb5-41dcf4f28576',
    code: 'sd',
  },
  {
    id: '9bd4222b-80a9-4f64-a0e7-fe01e2711da2',
    code: 'lk',
  },
  {
    id: '1958c03b-0a29-4fc3-968a-d308bd3542ce',
    code: 'se',
  },
  {
    id: '18c243ec-b20f-4fd8-aceb-395f2d84e8c9',
    code: 'ch',
  },
  {
    id: 'a047bbe6-286e-4f4e-980f-b7c7e305e7aa',
    code: 'sy',
  },
  {
    id: '8c4c3b83-e514-4f25-b21e-161d7de94a5e',
    code: 'tj',
  },
  {
    id: 'bab486ac-2295-4fd1-b463-2706f5629744',
    code: 'tw',
  },
  {
    id: '1de51d33-dd53-4f36-83de-c32108075dad',
    code: 'tz',
  },
  {
    id: '016d710c-7327-4f14-8ac0-305fba70f9c7',
    code: 'td',
  },
  {
    id: '8232e6ad-b9ac-4f06-88c5-1afbcd6b957d',
    code: 'cz',
  },
  {
    id: '3cf5cf57-eb5c-4f7a-b1ad-2dc6c31e2758',
    code: 'th',
  },
  {
    id: 'ac94a47c-089c-4a9e-ac71-39ebdb9f0848',
    code: 'bs',
  },
  {
    id: '36ed9f2c-883c-4fee-80b4-deb09ba8ba4a',
    code: 'tg',
  },
  {
    id: 'e7071554-16d9-4fa4-86fc-66e8d07e0977',
    code: 'tt',
  },
  {
    id: '1c1310ec-87ca-4fdb-a12a-1d12ddab105a',
    code: 'tn',
  },
  {
    id: '4e833898-5c80-4f80-8661-2b6f1e3390b7',
    code: 'tr',
  },
  {
    id: 'a0e3943a-eb91-4fed-a22f-1ac7f43ec92b',
    code: 'ua',
  },
  {
    id: '8e6e773b-7a25-4c9a-a058-0cabbeab47c9',
    code: 'uk',
  },
  {
    id: '7c1351f7-0702-4f20-a14c-2eba58f2c1c5',
    code: 'uy',
  },
  {
    id: '7b9e7477-ee37-4f34-ad6c-9c379e0954c4',
    code: 'vu',
  },
  {
    id: '721fd85d-8f60-4f32-a62c-b11601193819',
    code: 've',
  },
  {
    id: 'ba14fb2a-393b-4f4f-9e48-be76486e1fe5',
    code: 'vn',
  },
  {
    id: '21641dbc-bfc2-4fd7-8389-563e5165d1e0',
    code: 'ye',
  },
  {
    id: 'cd391027-6f0b-4fec-a57d-fc57509abc86',
    code: 'zm',
  },
  {
    id: 'ce090517-a08a-4ff8-a6c4-5ffd241c0feb',
    code: 'zw',
  },
]

async function main() {
  const prisma = new PrismaClient()

  countries.forEach(async (country) => {
    try {
      await prisma.country.update({ where: { id: country.id }, data: { code: country.code } })
    } catch (error) {
      console.log('error:', error)
    }
  })
}

main()
