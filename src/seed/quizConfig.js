export default {
  questions: [
    {
      id: 'fish',
      title: 'Какую рыбу хочешь ловить?',
      options: [
        { label: 'Щука', value: 'щука', icon: '🦈' },
        { label: 'Окунь', value: 'окунь', icon: '🐟' },
        { label: 'Карась', value: 'карась', icon: '🐠' },
        { label: 'Карп', value: 'карп', icon: '🎏' },
        { label: 'Плотва', value: 'плотва', icon: '🐡' },
        { label: 'Судак', value: 'судак', icon: '🐟' },
      ],
    },
    {
      id: 'place',
      title: 'Где будешь ловить?',
      options: [
        { label: 'Озеро', value: 'озеро', icon: '🏞️' },
        { label: 'Река (течение)', value: 'река', icon: '🌊' },
        { label: 'Пруд', value: 'пруд', icon: '💧' },
        { label: 'С берега', value: 'берег', icon: '🏖️' },
        { label: 'С лодки', value: 'лодка', icon: '🚣' },
      ],
    },
    {
      id: 'season',
      title: 'Когда планируешь ловить?',
      options: [
        { label: 'Весна', value: 'весна', icon: '🌸' },
        { label: 'Лето', value: 'лето', icon: '☀️' },
        { label: 'Осень', value: 'осень', icon: '🍂' },
      ],
    },
    {
      id: 'experience',
      title: 'Твой опыт?',
      options: [
        { label: 'Новичок', value: 'новичок', icon: '🌱' },
        { label: 'Есть опыт', value: 'опытный', icon: '🎯' },
      ],
    },
    {
      id: 'budget',
      title: 'Твой бюджет?',
      options: [
        { label: 'До 3 000 ₽', value: 3000, icon: '💰' },
        { label: '3 000 – 7 000 ₽', value: 7000, icon: '💰💰' },
        { label: '7 000 – 15 000 ₽', value: 15000, icon: '💰💰💰' },
        { label: 'Без ограничений', value: 999999, icon: '💎' },
      ],
    },
  ],
};
