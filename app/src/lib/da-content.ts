/* DayAxis content: i18n dictionary, recipes, exercises, tips, trades, emergency. */

import type { Cat, Lang, Worker } from "./da-types";

/* ============================= i18n ============================= */
export const LANGS: { id: Lang; label: string; native: string }[] = [
  { id: "en", label: "English", native: "English" },
  { id: "ru", label: "Русский", native: "Русский" },
  { id: "hi", label: "हिन्दी", native: "हिन्दी" },
  { id: "ur", label: "اردو", native: "اردو" },
  { id: "es", label: "Español", native: "Español" },
  { id: "ar", label: "العربية", native: "العربية" },
];

type Dict = Record<string, string>;
const D: Record<Lang, Dict> = {
  en: {
    tagline: "Your daily life, gently under control",
    open: "Open the toolkit",
    loading: "Warming up your command center…",
    nav_dash: "Dashboard", nav_plan: "Plan", nav_kitchen: "Kitchen", nav_move: "Move",
    nav_work: "Work", nav_assist: "Assist", nav_me: "Me",
    good_morning: "Good morning", good_afternoon: "Good afternoon", good_evening: "Good evening",
    today_progress: "Today's progress",
    done: "Done", remaining: "Remaining", postponed: "Postponed", deleted: "Deleted",
    tasks_done_today: "tasks finished today",
    add_task: "Add a task…", add_first: "Add your first task", quick_add: "Quick add",
    speak: "Say it", task_voice_hint: "Tap and speak your task",
    suggest_next: "Nice job! Want to add one more important thing?",
    already_done: "Already done. Adding it anyway?",
    mark_done: "Mark done", undo: "Undo",
    postpone: "Postpone", postpone_day: "Postpone a day", delete: "Delete", restore: "Restore",
    edit: "Edit", details: "Details", close: "Close", cancel: "Cancel", save: "Save",
    title: "Title", notes: "Notes", category: "Category", time: "Time", member: "For",
    repeat: "Repeat", repeat_none: "No repeat", repeat_weekly: "Every week", repeat_custom: "Every N days",
    weekdays: "Repeats on", days_interval: "Days interval", date: "Date", checklist: "Checklist",
    add_check_item: "Add step…", no_time: "No fixed time",
    no_tasks_today: "Nothing planned yet. Add something small and win the day.",
    plan_today: "Today's tasks", plan_week: "Week", plan_month: "Month", plan_history: "History",
    export_csv: "CSV (Google Sheets)", export_pdf: "PDF report", export_json: "Backup JSON",
    import_json: "Restore backup", email_export: "Send to email",
    history_desc: "Every task, completion and postponement of the last 30 days as a clean blueprint.",
    open_sheets: "Open with Google Sheets",
    kitchen: "Kitchen", quick_meals: "Quick meals", servings: "Servings",
    calc_nutrition: "Nutrition per serving", total_for: "Total for",
    protein: "Protein", carbs: "Carbs", fat: "Fat", kcal: "Calories", vitamins: "Vitamins & minerals",
    diet_filters: "Diet", fast_only: "Fast (<20 min)", none_match: "No dishes match these filters.",
    show_steps: "How to cook", hide_steps: "Hide steps",
    decide_note: "Plan today's meals in 5 seconds - pick a dish, set servings, see the nutrition.",
    move: "Move", pick_age: "Pick the age group", exercises: "Exercises & games",
    mins: "min", intensity: "Intensity", easy: "Easy", medium: "Medium", tough: "Tough",
    correct_form: "Correct form", steps: "Steps", how_to: "How to do it",
    kids: "Kids 4-12", teens: "Teens 13-17", adults: "Adults 18-55", seniors: "Seniors 55+",
    move_note: "Home workouts and games for every age - no equipment needed.",
    work: "Workforce", find_worker: "Find a worker", my_profile: "I'm a worker",
    search_worker: "Trade, name or place…", location_filter: "Nearest places first", sort_best: "Best rated",
    sort_experienced: "Most experienced", sort_jobs: "Most jobs done",
    contact: "Contact", quick_chat: "Quick chat (email)", direct_call: "Call", video_proof: "Video proof",
    reviews: "Reviews", no_reviews: "No reviews yet. Be the first!",
    review_post: "Post a review", your_rating: "Your rating", logged_as: "You are browsing as",
    register_worker: "Register as a worker", edit_profile: "Edit my profile", delete_profile: "Delete profile",
    your_work_status: "Work status", availability: "Availability", rate: "Rate", experience_years: "Years of experience",
    full_name: "Full name", phone: "Phone", email: "Email", trade: "Trade", location: "Location",
    bio: "About", video_url: "Video proof (link)",
    work_history: "My work history", saved: "Profile saved", deleted_profile: "Profile deleted.",
    work_note: "Find a trusted local worker in seconds - or register to earn with your skills.",
    your_reviews: "Your reviews", export_resume: "Export history (CSV/PDF)",
    assist: "Smart help", ask_text: "Ask anything or upload a photo…",
    scan_photo: "Scan a photo", scan_hint: "DayAxis reads the photo, detects the topic and answers instantly.",
    scanning: "Reading the image…", scanned_done: "Here's what I found:",
    tips_title: "Instant tips & hacks", emergency: "Emergency", sos: "SOS",
    quick_email: "Quick email", quick_sms: "Quick SMS",
    police: "Police", med: "Ambulance", fire: "Fire brigade", universal: "Universal emergency",
    tip_general: "Small daily hacks that save minutes and calm.",
    me: "My space", members: "Family & guests", add_member: "Add guest", switch_to: "Switch to",
    view_mode: "Dashboard view", view_cards: "Cards", view_list: "List", view_compact: "Compact",
    theme: "Theme", light: "Light", dark: "Dark", language: "Language",
    reminders: "Reminders", enable_notifications: "Browser notifications",
    voice_reminders: "Voice reminders (task name is spoken)", reminder_lead: "Remind minutes before",
    pref_changed: "Saved",
    data: "Your data", data_note: "Everything is stored securely and syncs when you sign in.",
    signup: "Create account", login: "Sign in", logout: "Sign out", passcode: "Passcode (6+ chars)",
    email_ph: "you@example.com", account_note: "Optional: an account syncs your home across devices.",
    feedback: "Feedback & ratings", feedback_note: "Help us improve DayAxis.",
    send_feedback: "Send feedback", thanks_feedback: "Thank you! Your words shape DayAxis.",
    avg_rating: "Average rating", from: "from", feedbacks: "reviews",
    about: "DayAxis is a daily-life toolkit for busy people: one calm place for tasks, reminders, meals, movement, trusted workers and smart help.",
    next: "Next", prev: "Prev", today: "Today", add: "Add", search: "Search", clear: "Clear",
    sure_delete: "Delete this item?", deleted_tasks: "Deleted tasks", empty_deleted: "Nothing in trash.",
    empty: "Nothing here yet.",
    all_good: "All good!",
    past_7: "Last 7 days",
    emergency_dial: "Tap to call",
    quick_actions: "Quick actions",
    guest: "Guest",
    task_saved: "Task saved", task_done: "Done!", added: "Added",
    welcome: "Welcome to DayAxis",
  },
  ru: {
    tagline: "Ваша ежедневная жизнь - спокойно под контролем",
    open: "Открыть панель",
    loading: "Готовим ваш командный центр…",
    nav_dash: "Главная", nav_plan: "План", nav_kitchen: "Кухня", nav_move: "Спорт",
    nav_work: "Мастера", nav_assist: "Помощь", nav_me: "Мой дом",
    good_morning: "Доброе утро", good_afternoon: "Добрый день", good_evening: "Добрый вечер",
    today_progress: "Прогресс дня",
    done: "Сделано", remaining: "Осталось", postponed: "Отложено", deleted: "Удалено",
    tasks_done_today: "задач выполнено сегодня",
    add_task: "Добавить задачу…", add_first: "Добавьте первую задачу", quick_add: "Быстрое добавление",
    speak: "Скажите голосом", task_voice_hint: "Нажмите и проговорите задачу",
    suggest_next: "Отлично! Добавим ещё одно важное дело?",
    already_done: "Уже сделано. Добавить всё равно?",
    mark_done: "Выполнено", undo: "Отменить",
    postpone: "Отложить", postpone_day: "На день", delete: "Удалить", restore: "Восстановить",
    edit: "Изменить", details: "Подробно", close: "Закрыть", cancel: "Отмена", save: "Сохранить",
    title: "Название", notes: "Заметки", category: "Категория", time: "Время", member: "Для кого",
    repeat: "Повтор", repeat_none: "Без повтора", repeat_weekly: "Каждую неделю", repeat_custom: "Каждые N дней",
    weekdays: "Повторять по дням", days_interval: "Интервал в днях", date: "Дата", checklist: "Чек-лист",
    add_check_item: "Добавить шаг…", no_time: "Без времени",
    no_tasks_today: "Пока ничего нет. Добавьте маленькое дело - и день под контролем.",
    plan_today: "Задачи дня", plan_week: "Неделя", plan_month: "Месяц", plan_history: "История",
    export_csv: "CSV (Google Sheets)", export_pdf: "PDF-отчёт", export_json: "Резервная копия",
    import_json: "Восстановить из копии", email_export: "Отправить на почту",
    history_desc: "Каждая задача, выполнение и перенос за 30 дней - чистым «чертежом».",
    open_sheets: "Открыть в Google Sheets",
    kitchen: "Кухня", quick_meals: "Быстрые блюда", servings: "Порции",
    calc_nutrition: "Питание на порцию", total_for: "Итого на",
    protein: "Белки", carbs: "Углеводы", fat: "Жиры", kcal: "Калории", vitamins: "Витамины и минералы",
    diet_filters: "Рацион", fast_only: "Быстро (<20 мин)", none_match: "Ничего не нашлось под фильтры.",
    show_steps: "Как готовить", hide_steps: "Скрыть шаги",
    decide_note: "План питания за 5 секунд: выберите блюдо, порции - и сразу виден состав.",
    move: "Спорт", pick_age: "Выберите возраст", exercises: "Упражнения и игры",
    mins: "мин", intensity: "Нагрузка", easy: "Легко", medium: "Средне", tough: "Интенсивно",
    correct_form: "Правильная техника", steps: "Шаги", how_to: "Как выполнять",
    kids: "Дети 4-12", teens: "Подростки 13-17", adults: "Взрослые 18-55", seniors: "55+",
    move_note: "Домашние тренировки и игры для любого возраста - без инвентаря.",
    work: "Мастера", find_worker: "Найти мастера", my_profile: "Я мастер",
    search_worker: "Профессия, имя или город…", location_filter: "Сначала ближайшие", sort_best: "По рейтингу",
    sort_experienced: "По опыту", sort_jobs: "По числу работ",
    contact: "Связаться", quick_chat: "Сообщение (email)", direct_call: "Позвонить", video_proof: "Видео-резюме",
    reviews: "Отзывы", no_reviews: "Отзывов пока нет. Будьте первым!",
    review_post: "Оставить отзыв", your_rating: "Ваша оценка", logged_as: "Вы в сети как",
    register_worker: "Зарегистрироваться мастером", edit_profile: "Изменить профиль", delete_profile: "Удалить профиль",
    your_work_status: "Статус", availability: "Доступность", rate: "Оплата", experience_years: "Опыт, лет",
    full_name: "Имя", phone: "Телефон", email: "Email", trade: "Профессия", location: "Город",
    bio: "О себе", video_url: "Видео-резюме (ссылка)",
    work_history: "Моя история работ", saved: "Профиль сохранён", deleted_profile: "Профиль удалён.",
    work_note: "Найдите проверенного мастера рядом за секунды - или зарабатывайте своими навыками.",
    your_reviews: "Ваши отзывы", export_resume: "Скачать историю (CSV/PDF)",
    assist: "Умная помощь", ask_text: "Спросите о чём угодно или загрузите фото…",
    scan_photo: "Сканировать фото", scan_hint: "DayAxis читает изображение, определяет тему и отвечает мгновенно.",
    scanning: "Читаю изображение…", scanned_done: "Вот что я вижу:",
    tips_title: "Советы и лайфхаки", emergency: "Экстренная помощь", sos: "SOS",
    quick_email: "Быстрое письмо", quick_sms: "Быстрое SMS",
    police: "Полиция", med: "Скорая", fire: "Пожарные", universal: "Единый номер",
    tip_general: "Мелкие ежедневные лайфхаки, которые экономят минуты и нервы.",
    me: "Мой дом", members: "Семья и гости", add_member: "Добавить гостя", switch_to: "Переключиться на",
    view_mode: "Вид панели", view_cards: "Карточки", view_list: "Список", view_compact: "Компактно",
    theme: "Тема", light: "Светлая", dark: "Тёмная", language: "Язык",
    reminders: "Напоминания", enable_notifications: "Уведомления браузера",
    voice_reminders: "Голосовые (название задачи озвучивается)", reminder_lead: "Напоминать за минут",
    pref_changed: "Сохранено",
    data: "Ваши данные", data_note: "Всё хранится надёжно и синхронизируется после входа.",
    signup: "Создать аккаунт", login: "Войти", logout: "Выйти", passcode: "Код доступа (6+ симв.)",
    email_ph: "you@example.com", account_note: "Необязательно: аккаунт синхронизирует дом между устройствами.",
    feedback: "Отзывы о приложении", feedback_note: "Помогите нам сделать DayAxis лучше.",
    send_feedback: "Отправить отзыв", thanks_feedback: "Спасибо! Ваши слова меняют DayAxis.",
    avg_rating: "Средняя оценка", from: "из", feedbacks: "оценок",
    about: "DayAxis - инструмент для занятых людей: одно спокойное место для задач, напоминаний, еды, спорта, мастеров и умной помощи.",
    next: "Далее", prev: "Назад", today: "Сегодня", add: "Добавить", search: "Поиск", clear: "Сброс",
    sure_delete: "Удалить этот пункт?", deleted_tasks: "Удалённые задачи", empty_deleted: "Корзина пуста.",
    empty: "Пока пусто.",
    all_good: "Всё сделано!",
    past_7: "Последние 7 дней",
    emergency_dial: "Нажмите, чтобы позвонить",
    quick_actions: "Быстрые действия",
    guest: "Гость",
    task_saved: "Задача сохранена", task_done: "Готово!", added: "Добавлено",
    welcome: "Добро пожаловать в DayAxis",
  },
  hi: {
    tagline: "आपकी रोज़ की ज़िंदगी, आसानी से काबू में", open: "टूलकिट खोलें",
    loading: "आपका कमांड सेंटर तैयार हो रहा है…",
    nav_dash: "डैशबोर्ड", nav_plan: "प्लान", nav_kitchen: "रसोई", nav_move: "कसरत",
    nav_work: "मिस्त्री", nav_assist: "मदद", nav_me: "मेरा घर",
    good_morning: "सुप्रभात", good_afternoon: "नमस्ते", good_evening: "शुभ संध्या",
    today_progress: "आज की प्रगति", done: "पूर्ण", remaining: "बाकी", postponed: "टाला गया", deleted: "हटाया",
    tasks_done_today: "आज पूर्ण किए", add_task: "काम जोड़ें…", add_first: "पहला काम जोड़ें",
    quick_add: "त्वरित जोड़", speak: "बोलकर कहें", task_voice_hint: "दबाएँ और काम बोलें",
    suggest_next: "बढ़िया! एक और ज़रूरी काम जोड़ें?", already_done: "पहले से पूर्ण है। फिर भी जोड़ें?",
    mark_done: "पूर्ण", undo: "वापस", postpone: "टालें", postpone_day: "एक दिन", delete: "हटाएँ", restore: "वापस लाएँ",
    edit: "बदलें", details: "विवरण", close: "बंद", cancel: "रद्द", save: "सहेजें",
    title: "नाम", notes: "नोट", category: "श्रेणी", time: "समय", member: "किसके लिए",
    repeat: "दोहराव", repeat_none: "कोई नहीं", repeat_weekly: "हर हफ़्ते", repeat_custom: "हर N दिन",
    weekdays: "किन दिनों", days_interval: "अंतर (दिन)", date: "तारीख़", checklist: "चेकलिस्ट",
    add_check_item: "कदम जोड़ें…", no_time: "समय नहीं",
    no_tasks_today: "अभी कुछ नहीं। छोटा काम जोड़ें और दिन जीतें।",
    plan_today: "आज के काम", plan_week: "सप्ताह", plan_month: "महीना", plan_history: "इतिहास",
    export_csv: "CSV (Google Sheets)", export_pdf: "PDF रिपोर्ट", export_json: "बैकअप",
    import_json: "बैकअप लोड करें", email_export: "ईमेल भेजें",
    history_desc: "30 दिनों का हर काम, पूर्णता और टालना - साफ रिपोर्ट में।",
    open_sheets: "Google Sheets में खोलें", kitchen: "रसोई", quick_meals: "झटपट भोजन",
    servings: "सर्विंग", calc_nutrition: "प्रति सर्विंग पोषण", total_for: "कुल",
    protein: "प्रोटीन", carbs: "कार्ब्स", fat: "वसा", kcal: "कैलोरी", vitamins: "विटामिन",
    diet_filters: "आहार", fast_only: "तेज़ (<20 मिनट)", none_match: "कुछ नहीं मिला।",
    show_steps: "बनाने का तरीका", hide_steps: "छिपाएँ",
    decide_note: "5 सेकंड में आज का खाना तय करें - व्यंजन और सर्विंग चुनें।",
    move: "कसरत", pick_age: "आयु वर्ग चुनें", exercises: "व्यायाम और खेल",
    mins: "मिनट", intensity: "कठिनाई", easy: "आसान", medium: "मध्यम", tough: "कठिन",
    correct_form: "सही तरीका", steps: "कदम", how_to: "कैसे करें",
    kids: "बच्चे 4-12", teens: "किशोर 13-17", adults: "वयस्क 18-55", seniors: "वरिष्ठ 55+",
    move_note: "हर उम्र के लिए घरेलू व्यायाम - बिना उपकरण।",
    work: "मिस्त्री", find_worker: "मिस्त्री खोजें", my_profile: "मैं मिस्त्री हूँ",
    search_worker: "पेशा, नाम या शहर…", location_filter: "पहले पास वाले", sort_best: "रेटिंग से",
    sort_experienced: "अनुभव से", sort_jobs: "काम संख्या से",
    contact: "संपर्क", quick_chat: "चैट (ईमेल)", direct_call: "कॉल", video_proof: "वीडियो",
    reviews: "समीक्षाएँ", no_reviews: "अभी कोई समीक्षा नहीं।",
    review_post: "समीक्षा दें", your_rating: "रेटिंग", logged_as: "आप हैं",
    register_worker: "मिस्त्री बनें", edit_profile: "प्रोफ़ाइल बदलें", delete_profile: "प्रोफ़ाइल हटाएँ",
    your_work_status: "स्थिति", availability: "उपलब्धता", rate: "दर", experience_years: "अनुभव (साल)",
    full_name: "पूरा नाम", phone: "फ़ोन", email: "ईमेल", trade: "पेशा", location: "शहर",
    bio: "परिचय", video_url: "वीडियो लिंक",
    work_history: "मेरा काम-इतिहास", saved: "प्रोफ़ाइल सहेजी", deleted_profile: "प्रोफ़ाइल हटाई गई।",
    work_note: "भरोसेमंद मिस्त्री सेकंडों में खोजें - या अपने कौशल से कमाएँ।",
    your_reviews: "आपकी समीक्षाएँ", export_resume: "इतिहास डाउनलोड करें",
    assist: "स्मार्ट मदद", ask_text: "कुछ भी पूछें या फोटो डालें…",
    scan_photo: "फोटो स्कैन करें", scan_hint: "DayAxis फोटो पढ़ता है और तुरंत जवाब देता है।",
    scanning: "फोटो पढ़ रहे हैं…", scanned_done: "यह मिला:",
    tips_title: "टिप्स और लाइफहैक", emergency: "आपातकाल", sos: "SOS",
    quick_email: "ईमेल", quick_sms: "SMS", police: "पुलिस", med: "एम्बुलेंस", fire: "फायर ब्रिगेड",
    universal: "यूनिवर्सल नंबर", tip_general: "रोज़ के छोटे हैक - मिनट बचाएँ।",
    me: "मेरा घर", members: "परिवार और मेहमान", add_member: "मेहमान जोड़ें", switch_to: "बदलें",
    view_mode: "व्यू", view_cards: "कार्ड", view_list: "सूची", view_compact: "संक्षिप्त",
    theme: "थीम", light: "लाइट", dark: "डार्क", language: "भाषा",
    reminders: "रिमाइंडर", enable_notifications: "ब्राउज़र सूचनाएँ",
    voice_reminders: "आवाज़ रिमाइंडर (काम का नाम बोलकर)", reminder_lead: "कितने मिनट पहले",
    pref_changed: "सहेजा", data: "आपका डेटा", data_note: "सब सुरक्षित; साइन-इन पर सिंक होता है।",
    signup: "अकाउंट बनाएँ", login: "साइन इन", logout: "साइन आउट", passcode: "पासकोड (6+)",
    email_ph: "you@example.com", account_note: "वैकल्पिक: अकाउंट से डेटा सभी डिवाइस पर।",
    feedback: "फ़ीडबैक", feedback_note: "DayAxis को बेहतर बनाने में मदद करें।",
    send_feedback: "भेजें", thanks_feedback: "धन्यवाद! आपकी बात दिन बदलती है।",
    avg_rating: "औसत रेटिंग", from: "में से", feedbacks: "रेटिंग",
    about: "DayAxis व्यस्त लोगों के लिए: काम, रिमाइंडर, खाना, कसरत, मिस्त्री और मदद - एक जगह।",
    next: "आगे", prev: "पीछे", today: "आज", add: "जोड़ें", search: "खोजें", clear: "साफ़",
    sure_delete: "हटाएँ?", deleted_tasks: "हटाए गए", empty_deleted: "कचरा खाली है।",
    empty: "खाली है।", all_good: "सब पूर्ण!", past_7: "पिछले 7 दिन",
    emergency_dial: "कॉल करने के लिए दबाएँ", quick_actions: "त्वरित कार्य",
    guest: "मेहमान", task_saved: "काम सहेजा", task_done: "पूर्ण!", added: "जोड़ा",
    welcome: "DayAxis में स्वागत है",
  },
  ur: {
    tagline: "آپ کی روزمرہ زندگی، آسانی سے قابو میں", open: "ٹول کٹ کھولیں",
    loading: "آپ کا کمانڈ سینٹر تیار ہو رہا ہے…",
    nav_dash: "ڈیش بورڈ", nav_plan: "پلان", nav_kitchen: "باورچی خانہ", nav_move: "ورزش",
    nav_work: "کاریگر", nav_assist: "مدد", nav_me: "میرا گھر",
    good_morning: "صبح بخیر", good_afternoon: "دوپہر بخیر", good_evening: "شام بخیر",
    today_progress: "آج کی پیش رفت", done: "مکمل", remaining: "باقی", postponed: "مؤخر", deleted: "حذف",
    tasks_done_today: "آج مکمل کام", add_task: "کام شامل کریں…", add_first: "پہلا کام شامل کریں",
    quick_add: "فوری شامل", speak: "بول کر کہیں", task_voice_hint: "دبائیں اور کام بولیں",
    suggest_next: "شاباش! ایک اور اہم کام شامل کریں؟", already_done: "پہلے ہی مکمل۔ پھر بھی شامل کریں؟",
    mark_done: "مکمل", undo: "واپس", postpone: "مؤخر کریں", postpone_day: "ایک دن", delete: "حذف", restore: "بحال",
    edit: "ترمیم", details: "تفصیل", close: "بند", cancel: "منسوخ", save: "محفوظ",
    title: "عنوان", notes: "نوٹ", category: "زمرہ", time: "وقت", member: "کس کے لیے",
    repeat: "تکرار", repeat_none: "کوئی نہیں", repeat_weekly: "ہر ہفتے", repeat_custom: "ہر N دن",
    weekdays: "کن دنوں", days_interval: "وقفہ (دن)", date: "تاریخ", checklist: "چیک لسٹ",
    add_check_item: "قدم شامل کریں…", no_time: "وقت مقرر نہیں",
    no_tasks_today: "ابھی کچھ نہیں۔ چھوٹا کام شامل کریں اور دن جیتیں۔",
    plan_today: "آج کے کام", plan_week: "ہفتہ", plan_month: "مہینہ", plan_history: "تاریخ",
    export_csv: "CSV (Google Sheets)", export_pdf: "PDF رپورٹ", export_json: "بیک اپ",
    import_json: "بیک اپ لوڈ", email_export: "ای میل بھیجیں",
    history_desc: "30 دن کے ہر کام اور مکمل ہونے کی صاف رپورٹ۔",
    open_sheets: "Google Sheets میں کھولیں", kitchen: "باورچی خانہ", quick_meals: "فوری کھانے",
    servings: "سرونگ", calc_nutrition: "فی سرونگ غذائیت", total_for: "کل",
    protein: "پروٹین", carbs: "کاربس", fat: "چربی", kcal: "کیلوریز", vitamins: "وٹامنز",
    diet_filters: "غذا", fast_only: "تیز (<20 منٹ)", none_match: "کچھ نہیں ملا۔",
    show_steps: "بنانے کا طریقہ", hide_steps: "چھپائیں",
    decide_note: "5 سیکنڈ میں آج کا کھانا طے کریں - ڈش اور سرونگ چنیں۔",
    move: "ورزش", pick_age: "عمر گروپ چنیں", exercises: "ورزشیں اور کھیل",
    mins: "منٹ", intensity: "مشکل", easy: "آسان", medium: "درمیان", tough: "سخت",
    correct_form: "صحیح طریقہ", steps: "اقدام", how_to: "کیسے کریں",
    kids: "بچے 4-12", teens: "نوجوان 13-17", adults: "بالغ 18-55", seniors: "سینئر 55+",
    move_note: "ہر عمر کے لیے گھریلو ورزش - بغیر آلات۔",
    work: "کاریگر", find_worker: "کاریگر تلاش کریں", my_profile: "میں کاریگر ہوں",
    search_worker: "پیشہ، نام یا شہر…", location_filter: "پہلے قریبی", sort_best: "ریٹنگ سے",
    sort_experienced: "تجربے سے", sort_jobs: "کاموں سے",
    contact: "رابطہ", quick_chat: "چیٹ (ای میل)", direct_call: "کال", video_proof: "ویڈیو",
    reviews: "جائزے", no_reviews: "ابھی کوئی جائزہ نہیں۔",
    review_post: "جائزہ دیں", your_rating: "ریٹنگ", logged_as: "آپ ہیں",
    register_worker: "کاریگر بنیں", edit_profile: "پروفائل بدلیں", delete_profile: "پروفائل حذف",
    your_work_status: "حالت", availability: "دستیابی", rate: "شرح", experience_years: "تجربہ (سال)",
    full_name: "پورا نام", phone: "فون", email: "ای میل", trade: "پیشہ", location: "شہر",
    bio: "تعارف", video_url: "ویڈیو لنک",
    work_history: "میرا کام", saved: "پروفائل محفوظ", deleted_profile: "پروفائل حذف ہوئی۔",
    work_note: "بھروسہ مند کاریگر فوراً تلاش کریں - یا اپنی مہارت سے کمائیں۔",
    your_reviews: "آپ کے جائزے", export_resume: "ہسٹری ڈاؤن لوڈ",
    assist: "سمارٹ مدد", ask_text: "کچھ بھی پوچھیں یا تصویر ڈالیں…",
    scan_photo: "تصویر اسکین", scan_hint: "DayAxis تصویر پڑھ کر فوراً جواب دیتا ہے۔",
    scanning: "تصویر پڑھ رہے ہیں…", scanned_done: "یہ ملا:",
    tips_title: "ٹپس اور ہیکس", emergency: "ہنگامی مدد", sos: "SOS",
    quick_email: "ای میل", quick_sms: "SMS", police: "پولیس", med: "ایمبولینس", fire: "فائر بریگیڈ",
    universal: "یونیورسل نمبر", tip_general: "روزانہ کی چھوٹی ہیکس۔",
    me: "میرا گھر", members: "خاندان اور مہمان", add_member: "مہمان شامل", switch_to: "تبدیل",
    view_mode: "وائو", view_cards: "کارڈ", view_list: "فہرست", view_compact: "مختصر",
    theme: "تھیم", light: "روشن", dark: "تاریک", language: "زبان",
    reminders: "یاد دہانی", enable_notifications: "براؤزر اطلاعیں",
    voice_reminders: "آواز یاد دہانی", reminder_lead: "کتنے منٹ پہلے",
    pref_changed: "محفوظ", data: "آپ کا ڈیٹا", data_note: "سب محفوظ؛ سائن اِن پر ہم آہنگ۔",
    signup: "اکاؤنٹ بنائیں", login: "سائن اِن", logout: "سائن آؤٹ", passcode: "پاس کوڈ (6+)",
    email_ph: "you@example.com", account_note: "اختیاری: اکاؤنٹ سے ہر ڈیوائس پر ڈیٹا۔",
    feedback: "رائے", feedback_note: "DayAxis بہتر بنانے میں مدد کریں۔",
    send_feedback: "بھیجیں", thanks_feedback: "شکریہ! آپ کی رائے اہم ہے۔",
    avg_rating: "اوسط ریٹنگ", from: "میں سے", feedbacks: "ریٹنگز",
    about: "DayAxis مصروف لوگوں کے لیے: کام، یاد دہانی، کھانا، ورزش، کاریگر اور مدد ایک جگہ۔",
    next: "آگے", prev: "پیچھے", today: "آج", add: "شامل", search: "تلاش", clear: "صاف",
    sure_delete: "حذف کریں؟", deleted_tasks: "حذف شدہ", empty_deleted: "کچرا خالی ہے۔",
    empty: "خالی۔", all_good: "سب مکمل!", past_7: "پچھلے 7 دن",
    emergency_dial: "کال کے لیے دبائیں", quick_actions: "فوری اقدامات",
    guest: "مہمان", task_saved: "کام محفوظ", task_done: "مکمل!", added: "شامل",
    welcome: "DayAxis میں خوش آمدید",
  },
  es: {
    tagline: "Tu día a día, bajo control con calma", open: "Abrir el panel",
    loading: "Preparando tu centro de control…",
    nav_dash: "Panel", nav_plan: "Plan", nav_kitchen: "Cocina", nav_move: "Moverte",
    nav_work: "Pro", nav_assist: "Ayuda", nav_me: "Mi casa",
    good_morning: "Buenos días", good_afternoon: "Buenas tardes", good_evening: "Buenas noches",
    today_progress: "Progreso de hoy", done: "Hechas", remaining: "Pendientes", postponed: "Aplazadas", deleted: "Borradas",
    tasks_done_today: "tareas terminadas hoy", add_task: "Añadir tarea…", add_first: "Añade tu primera tarea",
    quick_add: "Añadir rápido", speak: "Dilo en voz alta", task_voice_hint: "Toca y di tu tarea",
    suggest_next: "¡Bien hecho! ¿Añadimos otra cosa importante?",
    already_done: "Ya estaba hecha. ¿La añadimos igualmente?",
    mark_done: "Hecho", undo: "Deshacer", postpone: "Aplazar", postpone_day: "Un día", delete: "Borrar", restore: "Restaurar",
    edit: "Editar", details: "Detalles", close: "Cerrar", cancel: "Cancelar", save: "Guardar",
    title: "Título", notes: "Notas", category: "Categoría", time: "Hora", member: "Para",
    repeat: "Repetir", repeat_none: "Sin repetición", repeat_weekly: "Cada semana", repeat_custom: "Cada N días",
    weekdays: "Se repite", days_interval: "Intervalo en días", date: "Fecha", checklist: "Lista de pasos",
    add_check_item: "Añadir paso…", no_time: "Sin hora fija",
    no_tasks_today: "Nada por hoy. Añade algo pequeño y gana el día.",
    plan_today: "Tareas de hoy", plan_week: "Semana", plan_month: "Mes", plan_history: "Historial",
    export_csv: "CSV (Google Sheets)", export_pdf: "Informe PDF", export_json: "Copia de seguridad",
    import_json: "Restaurar copia", email_export: "Enviar por correo",
    history_desc: "Cada tarea, logro y aplazamiento de los últimos 30 días, como un plano limpio.",
    open_sheets: "Abrir en Google Sheets",
    kitchen: "Cocina", quick_meals: "Platos rápidos", servings: "Raciones",
    calc_nutrition: "Nutrición por ración", total_for: "Total para",
    protein: "Proteína", carbs: "Carbs", fat: "Grasa", kcal: "Calorías", vitamins: "Vitaminas y minerales",
    diet_filters: "Dieta", fast_only: "Rápido (<20 min)", none_match: "Nada coincide con estos filtros.",
    show_steps: "Cómo cocinar", hide_steps: "Ocultar pasos",
    decide_note: "Planifica la comida en 5 segundos: elige plato y raciones, mira la nutrición.",
    move: "Moverte", pick_age: "Elige el grupo de edad", exercises: "Ejercicios y juegos",
    mins: "min", intensity: "Intensidad", easy: "Suave", medium: "Media", tough: "Fuerte",
    correct_form: "Forma correcta", steps: "Pasos", how_to: "Cómo hacerlo",
    kids: "Niños 4-12", teens: "Adolescentes 13-17", adults: "Adultos 18-55", seniors: "Mayores 55+",
    move_note: "Entrenos caseros para cada edad, sin material.",
    work: "Profesionales", find_worker: "Buscar profesional", my_profile: "Soy profesional",
    search_worker: "Oficio, nombre o ciudad…", location_filter: "Primero los cercanos", sort_best: "Mejor valorados",
    sort_experienced: "Más experiencia", sort_jobs: "Más trabajos",
    contact: "Contactar", quick_chat: "Chat (email)", direct_call: "Llamar", video_proof: "Prueba en vídeo",
    reviews: "Reseñas", no_reviews: "Aún sin reseñas. ¡Sé el primero!",
    review_post: "Publicar reseña", your_rating: "Tu valoración", logged_as: "Estás como",
    register_worker: "Registrarme como profesional", edit_profile: "Editar perfil", delete_profile: "Borrar perfil",
    your_work_status: "Estado", availability: "Disponibilidad", rate: "Tarifa", experience_years: "Años de experiencia",
    full_name: "Nombre completo", phone: "Teléfono", email: "Email", trade: "Oficio", location: "Ciudad",
    bio: "Sobre ti", video_url: "Vídeo de prueba (enlace)",
    work_history: "Mi historial", saved: "Perfil guardado", deleted_profile: "Perfil borrado.",
    work_note: "Encuentra un profesional de confianza al instante - o gana con tu oficio.",
    your_reviews: "Tus reseñas", export_resume: "Descargar historial",
    assist: "Ayuda inteligente", ask_text: "Pregunta lo que sea o sube una foto…",
    scan_photo: "Escanear foto", scan_hint: "DayAxis lee la imagen, detecta el tema y responde al instante.",
    scanning: "Leyendo la imagen…", scanned_done: "Esto es lo que veo:",
    tips_title: "Consejos y trucos", emergency: "Emergencias", sos: "SOS",
    quick_email: "Email rápido", quick_sms: "SMS rápido",
    police: "Policía", med: "Ambulancia", fire: "Bomberos", universal: "Emergencia universal",
    tip_general: "Pequeños trucos diarios que ahorran minutos y nervios.",
    me: "Mi espacio", members: "Familia e invitados", add_member: "Añadir invitado", switch_to: "Cambiar a",
    view_mode: "Vista del panel", view_cards: "Tarjetas", view_list: "Lista", view_compact: "Compacta",
    theme: "Tema", light: "Claro", dark: "Oscuro", language: "Idioma",
    reminders: "Recordatorios", enable_notifications: "Notificaciones del navegador",
    voice_reminders: "Recordatorios de voz (se dice la tarea)", reminder_lead: "Avisar minutos antes",
    pref_changed: "Guardado",
    data: "Tus datos", data_note: "Todo se guarda seguro y se sincroniza al entrar.",
    signup: "Crear cuenta", login: "Entrar", logout: "Salir", passcode: "Código (6+ caracteres)",
    email_ph: "you@example.com", account_note: "Opcional: una cuenta sincroniza tu casa entre dispositivos.",
    feedback: "Opiniones", feedback_note: "Ayúdanos a mejorar DayAxis.",
    send_feedback: "Enviar opinión", thanks_feedback: "¡Gracias! Tus palabras mejoran DayAxis.",
    avg_rating: "Valoración media", from: "de", feedbacks: "valoraciones",
    about: "DayAxis es un kit de vida diaria para gente ocupada: tareas, recordatorios, comida, movimiento, profesionales y ayuda inteligente.",
    next: "Siguiente", prev: "Anterior", today: "Hoy", add: "Añadir", search: "Buscar", clear: "Limpiar",
    sure_delete: "¿Borrar este elemento?", deleted_tasks: "Tareas borradas", empty_deleted: "La papelera está vacía.",
    empty: "Nada por aquí todavía.",
    all_good: "¡Todo hecho!",
    past_7: "Últimos 7 días",
    emergency_dial: "Toca para llamar",
    quick_actions: "Acciones rápidas",
    guest: "Invitado",
    task_saved: "Tarea guardada", task_done: "¡Hecho!", added: "Añadido",
    welcome: "Bienvenido a DayAxis",
  },
  ar: {
    tagline: "حياتك اليومية، تحت السيطرة بهدوء", open: "افتح الأدوات",
    loading: "نُجهّز مركز القيادة الخاص بك…",
    nav_dash: "اللوحة", nav_plan: "الخطة", nav_kitchen: "المطبخ", nav_move: "الحركة",
    nav_work: "الحرفيون", nav_assist: "مساعدة", nav_me: "منزلي",
    good_morning: "صباح الخير", good_afternoon: "مساء الخير", good_evening: "مساء الخير",
    today_progress: "تقدم اليوم", done: "منجز", remaining: "متبقٍ", postponed: "مؤجل", deleted: "محذوف",
    tasks_done_today: "مهام أُنجزت اليوم", add_task: "أضف مهمة…", add_first: "أضف أول مهمة",
    quick_add: "إضافة سريعة", speak: "قلها صوتياً", task_voice_hint: "اضغط وقل مهمتك",
    suggest_next: "أحسنت! هل نضيف شيئاً مهماً آخر؟", already_done: "مكتملة سابقاً. أضيفها رغم ذلك؟",
    mark_done: "إنجاز", undo: "تراجع", postpone: "تأجيل", postpone_day: "يوماً", delete: "حذف", restore: "استعادة",
    edit: "تعديل", details: "التفاصيل", close: "إغلاق", cancel: "إلغاء", save: "حفظ",
    title: "العنوان", notes: "ملاحظات", category: "الفئة", time: "الوقت", member: "لأجل",
    repeat: "تكرار", repeat_none: "بدون تكرار", repeat_weekly: "كل أسبوع", repeat_custom: "كل N يوم",
    weekdays: "يتكرر في", days_interval: "الفاصل بالأيام", date: "التاريخ", checklist: "قائمة خطوات",
    add_check_item: "أضف خطوة…", no_time: "بدون وقت",
    no_tasks_today: "لا شيء اليوم. أضف مهمة صغيرة واربح اليوم.",
    plan_today: "مهام اليوم", plan_week: "الأسبوع", plan_month: "الشهر", plan_history: "السجل",
    export_csv: "CSV (Google Sheets)", export_pdf: "تقرير PDF", export_json: "نسخة احتياطية",
    import_json: "استعادة نسخة", email_export: "إرسال بالبريد",
    history_desc: "كل مهمة وإنجاز وتأجيل خلال 30 يوماً كمخطط نظيف.",
    open_sheets: "فتح في Google Sheets",
    kitchen: "المطبخ", quick_meals: "وجبات سريعة", servings: "حصص",
    calc_nutrition: "التغذية لكل حصة", total_for: "الإجمالي لـ",
    protein: "بروتين", carbs: "كربوهيدرات", fat: "دهون", kcal: "سعرات", vitamins: "فيتامينات",
    diet_filters: "نظام غذائي", fast_only: "سريع (<20 دقيقة)", none_match: "لا توجد أطباق مطابقة.",
    show_steps: "طريقة الطهي", hide_steps: "إخفاء الخطوات",
    decide_note: "خطط طعام اليوم في 5 ثوانٍ: اختر الطبق والحصص.",
    move: "الحركة", pick_age: "اختر الفئة العمرية", exercises: "تمارين وألعاب",
    mins: "دقيقة", intensity: "الشدة", easy: "سهل", medium: "متوسط", tough: "قوي",
    correct_form: "الطريقة الصحيحة", steps: "خطوات", how_to: "كيف تؤدي",
    kids: "أطفال 4-12", teens: "مراهقون 13-17", adults: "بالغون 18-55", seniors: "كبار 55+",
    move_note: "تمارين منزلية لكل الأعمار، بدون معدات.",
    work: "الحرفيون", find_worker: "ابحث عن حرفي", my_profile: "أنا حرفي",
    search_worker: "مهنة أو اسم أو مدينة…", location_filter: "الأقرب أولاً", sort_best: "الأعلى تقييماً",
    sort_experienced: "الأكثر خبرة", sort_jobs: "الأكثر عملاً",
    contact: "تواصل", quick_chat: "محادثة (بريد)", direct_call: "اتصال", video_proof: "فيديو إثبات",
    reviews: "تقييمات", no_reviews: "لا تقييمات بعد. كن الأول!",
    review_post: "نشر تقييم", your_rating: "تقييمك", logged_as: "أنت الآن",
    register_worker: "سجّل كحرفي", edit_profile: "تعديل الملف", delete_profile: "حذف الملف",
    your_work_status: "الحالة", availability: "التوفر", rate: "الأجر", experience_years: "سنوات الخبرة",
    full_name: "الاسم الكامل", phone: "الهاتف", email: "البريد", trade: "المهنة", location: "المدينة",
    bio: "نبذة", video_url: "فيديو إثبات (رابط)",
    work_history: "سجل عملي", saved: "تم حفظ الملف", deleted_profile: "تم حذف الملف.",
    work_note: "جد حرفياً موثوقاً بثوانٍ - أو اكسب بمهاراتك.",
    your_reviews: "تقييماتك", export_resume: "تنزيل السجل",
    assist: "مساعدة ذكية", ask_text: "اسأل أي شيء أو ارفع صورة…",
    scan_photo: "مسح صورة", scan_hint: "DayAxis يقرأ الصورة ويجيب فوراً.",
    scanning: "أقرأ الصورة…", scanned_done: "إليك ما وجدت:",
    tips_title: "نصائح وحيل", emergency: "طوارئ", sos: "SOS",
    quick_email: "بريد سريع", quick_sms: "رسالة سريعة",
    police: "الشرطة", med: "إسعاف", fire: "مطافئ", universal: "رقم الطوارئ",
    tip_general: "حيل يومية صغيرة توفر الدقائق والأعصاب.",
    me: "مساحتي", members: "العائلة والضيوف", add_member: "إضافة ضيف", switch_to: "التبديل إلى",
    view_mode: "عرض اللوحة", view_cards: "بطاقات", view_list: "قائمة", view_compact: "مضغوط",
    theme: "المظهر", light: "فاتح", dark: "داكن", language: "اللغة",
    reminders: "تذكيرات", enable_notifications: "إشعارات المتصفح",
    voice_reminders: "تذكيرات صوتية (يُتلى اسم المهمة)", reminder_lead: "تذكير قبل دقائق",
    pref_changed: "تم الحفظ",
    data: "بياناتك", data_note: "كل شيء محفوظ بأمان ويتمتزامن عند الدخول.",
    signup: "إنشاء حساب", login: "دخول", logout: "خروج", passcode: "رمز الدخول (6+ أحرف)",
    email_ph: "you@example.com", account_note: "اختياري: الحساب يزامن منزلك بين الأجهزة.",
    feedback: "الملاحظات", feedback_note: "ساعدنا في تحسين DayAxis.",
    send_feedback: "إرسال", thanks_feedback: "شكراً! كلماتك تحسّن DayAxis.",
    avg_rating: "متوسط التقييم", from: "من", feedbacks: "تقييم",
    about: "DayAxis مجموعة أدوات يومية للمشغولين: مهام، تذكيرات، طعام، حركة، حرفيون ومساعدة ذكية.",
    next: "التالي", prev: "السابق", today: "اليوم", add: "إضافة", search: "بحث", clear: "مسح",
    sure_delete: "حذف هذا العنصر؟", deleted_tasks: "مهام محذوفة", empty_deleted: "المهملات فارغة.",
    empty: "لا شيء بعد.",
    all_good: "كل شيء منجز!",
    past_7: "آخر 7 أيام",
    emergency_dial: "اضغط للاتصال",
    quick_actions: "إجراءات سريعة",
    guest: "ضيف",
    task_saved: "تم حفظ المهمة", task_done: "أُنجزت!", added: "أُضيفت",
    welcome: "أهلاً بك في DayAxis",
  },
};

export const t = (lang: Lang, key: string): string =>
  D[lang][key] ?? MIND_D[lang]?.[key] ?? CAT_D[lang]?.[key] ?? EXTRA_D[lang]?.[key] ?? CAT_D.en[key] ?? MIND_D.en[key] ?? EXTRA_D.en[key] ?? D.en[key] ?? key;

/* category + helper labels (shared by dashboard, task modal, assistant) */
const CAT_D: Record<Lang, Record<string, string>> = {
  en: {
    cat_all: "All", cat_meal: "Meals", cat_medicine: "Medicine", cat_childcare: "Kids & parents",
    cat_exercise: "Exercise", cat_family: "Family", cat_break: "Breaks", cat_custom: "Custom",
    cat_general: "Tips", mind_breath: "Breathing", mind_guide: "Guided", mind_focus: "Focus", mind_kids: "Kids",
  },
  ru: {
    cat_all: "Все", cat_meal: "Приём пищи", cat_medicine: "Лекарства", cat_childcare: "Дети и родители",
    cat_exercise: "Спорт", cat_family: "Семья", cat_break: "Отдых", cat_custom: "Своё",
    cat_general: "Советы", mind_breath: "Дыхание", mind_guide: "Гид", mind_focus: "Фокус", mind_kids: "Дети",
  },
  hi: {
    cat_all: "सभी", cat_meal: "भोजन", cat_medicine: "दवा", cat_childcare: "बच्चे और माता-पिता",
    cat_exercise: "व्यायाम", cat_family: "परिवार", cat_break: "आराम", cat_custom: "अन्य",
    cat_general: "टिप्स", mind_breath: "साँस", mind_guide: "निर्देशित", mind_focus: "फोकस", mind_kids: "बच्चे",
  },
  ur: {
    cat_all: "تمام", cat_meal: "کھانا", cat_medicine: "دوا", cat_childcare: "بچے اور والدین",
    cat_exercise: "ورزش", cat_family: "خاندان", cat_break: "آرام", cat_custom: "دیگر",
    cat_general: "ٹپس", mind_breath: "سانس", mind_guide: "رہنمائی", mind_focus: "فوکس", mind_kids: "بچے",
  },
  es: {
    cat_all: "Todas", cat_meal: "Comidas", cat_medicine: "Medicinas", cat_childcare: "Niños y padres",
    cat_exercise: "Ejercicio", cat_family: "Familia", cat_break: "Descanso", cat_custom: "Otra",
    cat_general: "Trucos", mind_breath: "Respiración", mind_guide: "Guiada", mind_focus: "Enfoque", mind_kids: "Infantil",
  },
  ar: {
    cat_all: "الكل", cat_meal: "وجبات", cat_medicine: "أدوية", cat_childcare: "الأطفال والوالدان",
    cat_exercise: "رياضة", cat_family: "العائلة", cat_break: "راحة", cat_custom: "أخرى",
    cat_general: "نصائح", mind_breath: "تنفس", mind_guide: "موجّهة", mind_focus: "تركيز", mind_kids: "أطفال",
  },
};

/* ============================= categories ============================= */
export const CATS: { id: Cat; color: string }[] = [
  { id: "meal", color: "#b3541e" },
  { id: "medicine", color: "#1e6e9e" },
  { id: "childcare", color: "#8a5bb1" },
  { id: "exercise", color: "#2e7d4f" },
  { id: "family", color: "#b3568b" },
  { id: "break", color: "#8a6d1e" },
  { id: "custom", color: "#4a5a80" },
];

/* ============================= recipes ============================= */
export interface Ing {
  i: string; q: number; u: string; k: number; p: number; c: number; f: number;
}
export interface Recipe {
  id: string; title: string; mins: number; diets: string[]; img: string;
  serves: number; ing: Ing[]; steps: string[]; vit: string;
}

const R = (
  id: string, title: string, mins: number, diets: string[], img: string,
  serves: number, ing: Ing[], steps: string[], vit: string,
): Recipe => ({ id, title, mins, diets, img, serves, ing, steps, vit });

export const RECIPES: Recipe[] = [
  R("oatmeal", "Oatmeal with berries", 12, ["veg", "kids"], "https://images.unsplash.com/photo-1517673132405-a56a62b18caf", 1, [
    { i: "Oats", q: 50, u: "g", k: 187, p: 6.5, c: 33, f: 3.5 },
    { i: "Milk 2.5%", q: 200, u: "ml", k: 100, p: 6.4, c: 9.6, f: 4 },
    { i: "Berries", q: 80, u: "g", k: 42, p: 0.7, c: 10, f: 0.3 },
    { i: "Honey", q: 10, u: "g", k: 30, p: 0, c: 8, f: 0 },
  ], [
    "Bring milk to a gentle boil, add oats and stir.",
    "Cook 5-7 min on low heat, stirring.",
    "Top with berries and honey. Eat warm.",
  ], "B1, Manganese, Iron, Fiber"),
  R("avocado-toast", "Egg & avocado toast", 10, ["veg", "high-protein"], "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d", 1, [
    { i: "Bread (wholegrain)", q: 60, u: "g", k: 160, p: 6, c: 26, f: 3 },
    { i: "Egg", q: 1, u: "pc", k: 72, p: 6.3, c: 0.4, f: 4.8 },
    { i: "Avocado", q: 70, u: "g", k: 112, p: 1.4, c: 6, f: 10 },
    { i: "Lemon juice", q: 5, u: "g", k: 1, p: 0, c: 0.3, f: 0 },
  ], [
    "Toast the bread, boil or fry the egg.",
    "Mash avocado with lemon and a pinch of salt.",
    "Spread on toast, add the egg on top.",
  ], "B6, C, E, Folate, Potassium"),
  R("chicken-bowl", "Chicken rice bowl", 25, ["high-protein"], "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", 1, [
    { i: "Chicken breast", q: 150, u: "g", k: 248, p: 46, c: 0, f: 5.4 },
    { i: "Rice (cooked)", q: 180, u: "g", k: 216, p: 4.5, c: 48, f: 0.4 },
    { i: "Broccoli", q: 100, u: "g", k: 34, p: 2.8, c: 7, f: 0.4 },
    { i: "Soy sauce", q: 15, u: "g", k: 8, p: 1.3, c: 0.8, f: 0 },
    { i: "Olive oil", q: 5, u: "g", k: 44, p: 0, c: 0, f: 5 },
  ], [
    "Season chicken with pepper, pan-fry 6-7 min per side.",
    "Steam broccoli 4 min.",
    "Plate rice, sliced chicken and broccoli, splash soy sauce.",
  ], "B3, B6, Selenium, Zinc"),
  R("lentil-soup", "Red lentil soup", 30, ["vegan"], "https://images.unsplash.com/photo-1547592166-23ac45744acd", 2, [
    { i: "Red lentils", q: 80, u: "g", k: 283, p: 19.6, c: 50, f: 0.8 },
    { i: "Onion", q: 60, u: "g", k: 24, p: 0.7, c: 5.6, f: 0 },
    { i: "Carrot", q: 70, u: "g", k: 29, p: 0.7, c: 6.8, f: 0.1 },
    { i: "Curry powder", q: 4, u: "g", k: 14, p: 0.6, c: 2.4, f: 0.6 },
    { i: "Olive oil", q: 6, u: "g", k: 53, p: 0, c: 0, f: 6 },
  ], [
    "Sauté diced onion and carrot in oil 4 min.",
    "Add lentils, curry, 700 ml water. Simmer 20 min.",
    "Blend lightly, salt to taste.",
  ], "Iron, Folate, B1, Potassium"),
  R("stirfry", "Veggie stir-fry", 18, ["vegan", "fast"], "https://images.unsplash.com/photo-1512058564366-18510be2db19", 1, [
    { i: "Mixed vegetables", q: 300, u: "g", k: 90, p: 4, c: 18, f: 0.6 },
    { i: "Tofu", q: 100, u: "g", k: 76, p: 8, c: 2, f: 4.8 },
    { i: "Soy sauce", q: 15, u: "g", k: 8, p: 1.3, c: 0.8, f: 0 },
    { i: "Sesame oil", q: 5, u: "g", k: 44, p: 0, c: 0, f: 5 },
  ], [
    "High heat, oil in wok, add veggies 5 min stirring.",
    "Add tofu cubes, soy sauce, 2 more min.",
  ], "C, A, K, Antioxidants"),
  R("pasta-tomato", "Pasta with tomato & basil", 20, ["veg", "fast", "kids"], "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9", 2, [
    { i: "Pasta", q: 200, u: "g", k: 700, p: 24, c: 140, f: 3 },
    { i: "Tomato sauce", q: 200, u: "g", k: 84, p: 3, c: 16, f: 0.4 },
    { i: "Basil", q: 5, u: "g", k: 1, p: 0.1, c: 0.2, f: 0 },
    { i: "Parmesan", q: 20, u: "g", k: 84, p: 7.4, c: 0.8, f: 5.5 },
  ], [
    "Boil pasta 8-10 min, drain.",
    "Warm tomato sauce, mix with pasta.",
    "Top with basil and parmesan.",
  ], "Lycopene, B-group, Calcium"),
  R("parfait", "Yogurt berry parfait", 5, ["veg", "no-cook", "kids"], "https://images.unsplash.com/photo-1488477181946-6428a0291777", 1, [
    { i: "Greek yogurt", q: 180, u: "g", k: 133, p: 17, c: 6, f: 4 },
    { i: "Granola", q: 30, u: "g", k: 130, p: 3.5, c: 22, f: 4 },
    { i: "Berries", q: 70, u: "g", k: 37, p: 0.6, c: 9, f: 0.3 },
  ], [
    "Layer yogurt, granola, berries in a glass.",
    "Repeat once. Ready in 1 minute.",
  ], "Calcium, Probiotics, B12"),
  R("fish-greens", "Grilled fish & greens", 20, ["high-protein"], "https://images.unsplash.com/photo-1467003909585-2f8a72700288", 1, [
    { i: "White fish fillet", q: 180, u: "g", k: 160, p: 34, c: 0, f: 2 },
    { i: "Spinach", q: 100, u: "g", k: 23, p: 2.9, c: 3.6, f: 0.4 },
    { i: "Lemon", q: 15, u: "g", k: 4, p: 0.1, c: 1.4, f: 0 },
    { i: "Olive oil", q: 6, u: "g", k: 53, p: 0, c: 0, f: 6 },
  ], [
    "Brush fish with oil, grill 4 min per side.",
    "Sauté spinach 2 min with lemon.",
    "Serve fish over greens.",
  ], "D, B12, Omega-3, Iron"),
  R("chickpea-curry", "Chickpea curry", 30, ["vegan"], "https://images.unsplash.com/photo-1631452180519-c014fe946bc7", 2, [
    { i: "Chickpeas (cooked)", q: 240, u: "g", k: 328, p: 17.5, c: 55, f: 5.5 },
    { i: "Tomato puree", q: 150, u: "g", k: 60, p: 2, c: 12, f: 0.4 },
    { i: "Onion", q: 80, u: "g", k: 32, p: 0.9, c: 7.5, f: 0 },
    { i: "Coconut milk", q: 60, u: "ml", k: 138, p: 1.2, c: 3, f: 14 },
  ], [
    "Sauté onion 4 min, add puree and spices.",
    "Add chickpeas and coconut milk, simmer 12 min.",
    "Serve with rice or bread.",
  ], "Fiber, Folate, Iron, Magnesium"),
  R("pancakes", "Banana oat pancakes", 15, ["veg", "kids"], "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445", 2, [
    { i: "Banana", q: 150, u: "g", k: 134, p: 1.6, c: 34, f: 0.5 },
    { i: "Oats (ground)", q: 80, u: "g", k: 300, p: 10.4, c: 53, f: 5.6 },
    { i: "Egg", q: 1, u: "pc", k: 72, p: 6.3, c: 0.4, f: 4.8 },
    { i: "Milk", q: 60, u: "ml", k: 30, p: 1.9, c: 2.9, f: 1.2 },
  ], [
    "Mash banana, mix with oats, egg and milk.",
    "Fry small pancakes 2 min per side on low heat.",
    "Serve with fruit.",
  ], "B6, Potassium, Fiber"),
  R("bake", "Broccoli potato bake", 35, ["veg", "family"], "https://images.unsplash.com/photo-1546548970-71785318a17b", 3, [
    { i: "Potatoes", q: 400, u: "g", k: 320, p: 8, c: 72, f: 0.4 },
    { i: "Broccoli", q: 200, u: "g", k: 68, p: 5.6, c: 14, f: 0.8 },
    { i: "Cheese", q: 60, u: "g", k: 240, p: 15, c: 3.6, f: 19 },
    { i: "Milk", q: 100, u: "ml", k: 50, p: 3.2, c: 4.8, f: 2 },
  ], [
    "Slice potatoes, boil 8 min.",
    "Layer potatoes and broccoli in a dish.",
    "Pour milk, top with cheese, bake 20 min at 200 °C.",
  ], "C, K, Calcium, B6"),
  R("energy-bites", "Nut & fruit energy bites", 10, ["veg", "no-cook", "snack"], "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea", 4, [
    { i: "Dates", q: 100, u: "g", k: 280, p: 2.2, c: 75, f: 0.1 },
    { i: "Almonds", q: 50, u: "g", k: 289, p: 10.6, c: 10, f: 25 },
    { i: "Oats", q: 40, u: "g", k: 150, p: 5.2, c: 26, f: 2.8 },
    { i: "Cocoa", q: 8, u: "g", k: 18, p: 1.5, c: 3, f: 1 },
  ], [
    "Blend all ingredients into a sticky mass.",
    "Roll into 8-10 balls.",
    "Chill 20 min, store in fridge.",
  ], "E, Magnesium, Iron, Antioxidants"),
];

export const DIETS = ["veg", "vegan", "high-protein", "kids", "no-cook", "fast", "family", "snack"];

export const sumNut = (
  ing: Ing[], factor: number,
): { k: number; p: number; c: number; f: number } => {
  const s = { k: 0, p: 0, c: 0, f: 0 };
  for (const it of ing) {
    s.k += it.k * factor; s.p += it.p * factor; s.c += it.c * factor; s.f += it.f * factor;
  }
  return { k: Math.round(s.k), p: Math.round(s.p * 10) / 10, c: Math.round(s.c), f: Math.round(s.f * 10) / 10 };
};

/* ============================= exercises ============================= */
export type Group = "kids" | "teens" | "adults" | "seniors";
export interface Exercise {
  id: string; group: Group; title: string; mins: number; lvl: 1 | 2 | 3;
  pose: string; steps: string[];
}
export const EXERCISES: Exercise[] = [
  // kids
  { id: "k1", group: "kids", title: "Animal walk race", mins: 8, lvl: 1, pose: "bear", steps: ["Walk like a bear - hands and feet on the floor", "Race a sibling or parent across the room", "3 rounds, rest 30 s between"] },
  { id: "k2", group: "kids", title: "Balloon keep-up", mins: 6, lvl: 1, pose: "jump", steps: ["Keep a balloon in the air", "Only feet and knees allowed in round 2", "Count how many touches in 2 minutes"] },
  { id: "k3", group: "kids", title: "Frog jumps", mins: 7, lvl: 2, pose: "squat", steps: ["Squat down low like a frog", "Jump forward as far as you can", "10 jumps, then hop back"] },
  { id: "k4", group: "kids", title: "Simon says stretch", mins: 5, lvl: 1, pose: "reach", steps: ["One person calls moves: tree, star, bridge", "Hold each pose 10 seconds", "A giggle reset - start over"] },
  // teens
  { id: "t1", group: "teens", title: "Push-up ladder", mins: 10, lvl: 3, pose: "plank", steps: ["Do 5 push-ups, rest 30 s", "Then 7, then 9 - work up the ladder", "Keep a straight line from head to heels"] },
  { id: "t2", group: "teens", title: "Squat holds", mins: 8, lvl: 2, pose: "squat", steps: ["Feet shoulder-width, sit back like a chair", "Hold 30 s, rest 20 s", "3 rounds; hands forward for balance"] },
  { id: "t3", group: "teens", title: "Mountain climbers", mins: 6, lvl: 3, pose: "plank", steps: ["Start in plank, drive knees to chest fast", "30 s on, 30 s off", "4 rounds; keep hips low"] },
  { id: "t4", group: "teens", title: "Standing lunges", mins: 9, lvl: 2, pose: "lunge", steps: ["Step forward, lower back knee to floor", "10 each leg, 3 rounds", "Push through the front heel to rise"] },
  // adults
  { id: "a1", group: "adults", title: "Quick energy plank", mins: 6, lvl: 2, pose: "plank", steps: ["Plank 20 s, rest 20 s", "Add side planks 15 s each side", "Repeat 4 rounds"] },
  { id: "a2", group: "adults", title: "Back-saver stretch", mins: 5, lvl: 1, pose: "reach", steps: ["Child's pose 30 s", "Cat-cow 10 reps slowly", "Feel the spine open up"] },
  { id: "a3", group: "adults", title: "Glute bridge", mins: 7, lvl: 2, pose: "bridge", steps: ["Lie down, feet planted, lift hips up", "Squeeze glutes at the top 2 s", "15 reps, 3 rounds"] },
  { id: "a4", group: "adults", title: "Jumping jacks", mins: 5, lvl: 2, pose: "jump", steps: ["1 min jacks, 30 s rest", "4 rounds; land softly"] },
  // seniors
  { id: "s1", group: "seniors", title: "Chair sit-to-stand", mins: 6, lvl: 1, pose: "chair", steps: ["Sit tall, stand up slowly using legs", "Sit back down gently", "8 reps, hold the chair back for safety"] },
  { id: "s2", group: "seniors", title: "Wall push-ups", mins: 6, lvl: 1, pose: "wall", steps: ["Face a wall, hands on it at shoulder height", "Bend elbows, bring chest to wall", "12 slow reps"] },
  { id: "s3", group: "seniors", title: "Marching in place", mins: 5, lvl: 1, pose: "march", steps: ["March gently, lifting knees 10 cm", "Swing arms lightly", "1 min, rest, 2 more rounds"] },
  { id: "s4", group: "seniors", title: "Seated side stretch", mins: 4, lvl: 1, pose: "reach", steps: ["Sit tall in a chair", "Reach one arm overhead, lean gently", "Hold 15 s each side, breathe"] },
];

export const GROUPS: { id: Group; key: string }[] = [
  { id: "kids", key: "kids" }, { id: "teens", key: "teens" },
  { id: "adults", key: "adults" }, { id: "seniors", key: "seniors" },
];

/* ============================= tips & smart answers ============================= */
export interface Tip { id: string; cat: Cat | "general"; title: string; body: string; }
export const TIPS: Tip[] = [
  { id: "t1", cat: "meal", title: "Prep produce once", body: "Wash and chop vegetables right after shopping. Cooking then takes 5 minutes, not 25." },
  { id: "t2", cat: "meal", title: "The 2-plate rule", body: "Half plate vegetables, quarter protein, quarter carbs. No counting needed." },
  { id: "t3", cat: "meal", title: "Freeze extra portions", body: "Cook double, freeze half. Bad days get a zero-effort dinner." },
  { id: "t4", cat: "medicine", title: "Pair meds with a habit", body: "Attach medicine time to something you never skip: brushing teeth, morning coffee. Hard to forget." },
  { id: "t5", cat: "medicine", title: "Keep a visible organizer", body: "A weekly pill box in the kitchen works better than any app alert." },
  { id: "t6", cat: "medicine", title: "Never 'double later'", body: "Missed a dose? Never take two together unless the doctor says so. Write it down for the next visit." },
  { id: "t7", cat: "childcare", title: "The 20-minute wind-down", body: "20 quiet minutes before bed - no screens - builds the sleep routine for the whole week." },
  { id: "t8", cat: "childcare", title: "Homework first, screen later", body: "Make the finish line a reward, not the starting line. Consistency beats negotiation." },
  { id: "t9", cat: "childcare", title: "Let kids choose 2 of 3", body: "Give choices you can live with: 'apple or banana? now or in 10 minutes?' Ownership kills fights." },
  { id: "t10", cat: "exercise", title: "The 10-minute rule", body: "Tell yourself: just 10 minutes. Starting is the hardest part; most sessions run longer." },
  { id: "t11", cat: "exercise", title: "Stack movement on chores", body: "Squats while the kettle boils, calf raises at the sink. Movement finds you." },
  { id: "t12", cat: "family", title: "One shared calendar", body: "One family calendar, one color per person. Fewer 'did you forget?' conversations." },
  { id: "t13", cat: "family", title: "The weekly 15-minute check-in", body: "Sunday: 15 minutes, who needs what next week. It removes a whole layer of stress." },
  { id: "t14", cat: "break", title: "The 52/17 rhythm", body: "Work 52 minutes, break 17. The break is not a luxury, it is the mechanism." },
  { id: "t15", cat: "break", title: "Look far away", body: "Every 20 minutes look at something 20 feet away for 20 seconds. Eyes and focus thank you." },
  { id: "t16", cat: "general", title: "The 2-minute inbox", body: "Things that take under 2 minutes: do them immediately. Everything else gets a slot." },
  { id: "t17", cat: "general", title: "One important thing", body: "Each morning choose ONE task that matters most. Do it before opening social media." },
  { id: "t18", cat: "general", title: "Set the scene the night before", body: "Clothes, bag, keys, first task - decided at night. Mornings become automatic." },
];

/* keyword matching for the lightbulb search is implemented in smartReply below */

export function smartReply(q: string, lang: Lang): { answer: string; tip?: Tip } {
  const s = q.toLowerCase();
  const match = (re: RegExp) => re.test(s);
  let cat: Cat | "general" | null = null;
  if (match(/meal|food|cook|recipe|breakfast|lunch|dinner|hungry|еда|готов|рецепт|завтрак|обед|ужин|کھان|کھانا|खाना|भोजन/i)) cat = "meal";
  else if (match(/medicin|pill|dose|disease|doctor|health|лекар|табл|бол|دوا|дوا|दवा/i)) cat = "medicine";
  else if (match(/child|kids|school|homework|sleep|baby|ребен|child|дети|школ|урок|بچ|बच्च|स्कूल/i)) cat = "childcare";
  else if (match(/exercise|workout|sport|fitness|train|спорт|трен|ورزش|ورزش|व्यायाम/i)) cat = "exercise";
  else if (match(/family|wife|husband|mom|parent|семь|семья|ma|خاندان|परिवार/i)) cat = "family";
  else if (match(/break|rest|tired|stress|anxious|отдых|устал|стресс|آرام|تھک|आराम/i)) cat = "break";
  else if (match(/save|time|hack|tip|quick|econom|быстр|эконом|لائیف ہیک|टिप/i)) cat = "general";
  const pool = cat ? TIPS.filter((x) => x.cat === cat) : TIPS.filter((x) => x.cat === "general");
  const tip = pool[Math.floor(Math.random() * pool.length)];
  const catLabel = cat ? t(lang, `cat_${cat}`) : t(lang, "tip_general");
  return {
    answer: `${t(lang, "scanned_done")} ${catLabel} ${t(lang, "assist")}. ${tip.title}: ${tip.body}`,
    tip,
  };
}

/* ============================= workforce ============================= */
export const TRADES = [
  "Electrician", "Plumber", "Cleaner", "Delivery", "Handyman", "Carpenter",
  "Gardener", "Cook / Chef", "Tutor", "Legal help", "IT repair", "Driver",
  "Babysitter", "Laundry", "Accountant", "Painter",
];

export const EMERGENCY: { key: string; label: string; cls: string; num: string; icon: string }[] = [
  { key: "sos", label: "SOS", cls: "sos", num: "112", icon: "sos" },
  { key: "med", label: "Ambulance / Медицина", cls: "med", num: "103", icon: "med" },
  { key: "police", label: "Police", cls: "police", num: "102", icon: "police" },
  { key: "fire", label: "Fire brigade", cls: "fire", num: "101", icon: "fire" },
];

/* seed workers (first sync fills the marketplace) */
export const SEED_WORKERS: Omit<Worker, "id" | "rating" | "review_count">[] = [
  { owner_home: null, name: "Arman Bekov", trade: "Electrician", location: "Almaty", phone: "+7 700 111 2233", email: "arman.elec@example.com", experience_years: 12, bio: "Licensed electrician, safe wiring and repairs, works evenings too.", video_url: "", status: "available", availability: "now", rate: "from $15/hr", jobs_done: 214, created_at: "" },
  { owner_home: null, name: "Olga Petrova", trade: "Cleaner", location: "Moscow", phone: "+7 900 222 3344", email: "olga.clean@example.com", experience_years: 6, bio: "Deep cleaning and move-out cleaning, eco products, 4.9 avg rating.", video_url: "", status: "available", availability: "today", rate: "$12/hr", jobs_done: 320, created_at: "" },
  { owner_home: null, name: "Dinesh Kumar", trade: "Plumber", location: "Mumbai", phone: "+91 98 0000 1122", email: "dinesh.plumb@example.com", experience_years: 9, bio: "Leaks, installs, water heaters. 24/7 emergency visits.", video_url: "", status: "available", availability: "now", rate: "from ₹400", jobs_done: 412, created_at: "" },
  { owner_home: null, name: "Maria Garcia", trade: "Tutor", location: "Madrid", phone: "+34 600 123 456", email: "maria.tutor@example.com", experience_years: 7, bio: "Math and physics tutor for school and university, online or home.", video_url: "", status: "busy", availability: "week", rate: "€18/hr", jobs_done: 156, created_at: "" },
  { owner_home: null, name: "Sergey Volkov", trade: "Handyman", location: "Saint Petersburg", phone: "+7 911 333 4455", email: "sergey.hm@example.com", experience_years: 15, bio: "Furniture assembly, shelving, small repairs. Fast and tidy.", video_url: "", status: "available", availability: "today", rate: "from $10/hr", jobs_done: 508, created_at: "" },
  { owner_home: null, name: "Fatima Ali", trade: "Cook / Chef", location: "Dubai", phone: "+971 50 123 4567", email: "fatima.chef@example.com", experience_years: 10, bio: "Home chef: family meals, diet menus, event cooking with fresh ingredients.", video_url: "", status: "offline", availability: "week", rate: "from AED 60", jobs_done: 98, created_at: "" },
  { owner_home: null, name: "James O'Connor", trade: "IT repair", location: "London", phone: "+44 7700 900123", email: "james.it@example.com", experience_years: 5, bio: "Laptop, phone and router rescue - remote or at your door.", video_url: "", status: "available", availability: "now", rate: "£20/hr", jobs_done: 264, created_at: "" },
  { owner_home: null, name: "Asel Nurpeisova", trade: "Legal help", location: "Astana", phone: "+7 701 555 6677", email: "asel.legal@example.com", experience_years: 8, bio: "Contracts, tenant rights, family law consultations. First consult free.", video_url: "", status: "available", availability: "today", rate: "from $20/hr", jobs_done: 143, created_at: "" },
];

export const SEED_REVIEWS: { worker_i: number; by: string; rating: number; text: string }[] = [
  { worker_i: 0, by: "Marat", rating: 5, text: "Came same day, fixed everything, left it clean. Highly recommend." },
  { worker_i: 0, by: "Julia", rating: 4, text: "Professional and honest about costs." },
  { worker_i: 1, by: "The Smiths", rating: 5, text: "House never looked better. On time and very thorough." },
  { worker_i: 2, by: "Rahul", rating: 5, text: "Fixed a tricky leak fast. Fair price." },
  { worker_i: 3, by: "Carmen", rating: 5, text: "My daughter's grades went up in a month. Patient teacher." },
  { worker_i: 4, by: "Ivan", rating: 5, text: "Assembled a whole flat's furniture in one day. Legend." },
  { worker_i: 5, by: "Sara", rating: 5, text: "Cooked for our dinner party - everyone asked for her contact." },
  { worker_i: 6, by: "Tom", rating: 4, text: "Fixed my laptop in 40 minutes, explained what happened." },
  { worker_i: 7, by: "Dana", rating: 5, text: "Clear advice, fair fee, quick response." },
];

/* ============================= mind & sleep ============================= */
export interface MindSession {
  id: string;
  kind: "breath" | "guide" | "focus" | "kids";
  titleKey: string;
  mins: number;
  pattern: { in: number; hold: number; out: number; hold2: number }[];
  stepsKey: ("settle" | "notice" | "close")[];
}

export const MIND_SESSIONS: MindSession[] = [
  { id: "reset3", kind: "breath", titleKey: "s1", mins: 3, pattern: [{ in: 4, hold: 4, out: 4, hold2: 0 }], stepsKey: ["settle"] },
  { id: "sleep5", kind: "breath", titleKey: "s2", mins: 5, pattern: [{ in: 4, hold: 7, out: 8, hold2: 0 }], stepsKey: ["settle", "close"] },
  { id: "focus10", kind: "focus", titleKey: "s3", mins: 10, pattern: [{ in: 4, hold: 2, out: 4, hold2: 0 }], stepsKey: ["settle", "notice"] },
  { id: "body8", kind: "guide", titleKey: "s4", mins: 8, pattern: [{ in: 4, hold: 2, out: 6, hold2: 0 }], stepsKey: ["settle", "notice", "close"] },
  { id: "stress5", kind: "breath", titleKey: "s5", mins: 5, pattern: [{ in: 4, hold: 4, out: 4, hold2: 4 }], stepsKey: ["settle", "close"] },
  { id: "kids4", kind: "kids", titleKey: "s6", mins: 4, pattern: [{ in: 3, hold: 2, out: 3, hold2: 0 }], stepsKey: ["settle", "close"] },
];

export const WIND_IDS = ["wind1", "wind2", "wind3", "wind4", "wind5"];

export const SLEEP_TIPS: string[] = [
  "Keep the same bedtime and wake time even on weekends. The body loves rhythm.",
  "Eat the last big meal 3 hours before bed. A light snack is fine.",
  "Daylight in the morning, dim light in the evening - light sets your clock.",
  "If you cannot sleep after 20 minutes, get up and do something calm, then return.",
  "A cool room (16-19 C) falls asleep faster than a warm one.",
];

const MIND_D: Record<Lang, Record<string, string>> = {
  en: {
    nav_mind: "Mind", mind_meditate: "Meditate", mind_sleep: "Sleep", mind_sessions: "Guided sessions",
    mind_min: "min", mind_start: "Start", mind_cancel: "Cancel", mind_finished: "Session complete",
    mind_mood: "How do you feel now?", mind_saved: "Logged", mind_weekly: "This week", mind_logs: "Recent sessions",
    mind_noise: "Sound", mind_none: "Silence", mind_rain: "Rain", mind_pink: "Soft noise",
    mind_phase_in: "Breathe in", mind_phase_hold: "Hold", mind_phase_out: "Breathe out", mind_phase_hold2: "Hold",
    mind_step1: "Settle in, close your eyes, soften your hands.",
    mind_step2: "Thoughts will come. Notice them, let them pass.",
    mind_step3: "Gently return. Open your eyes when ready.",
    sleep_bedtime: "Bedtime goal", sleep_wake: "Wake goal", sleep_duration: "Planned sleep",
    sleep_log: "Log last night", sleep_to_bed: "Went to bed", sleep_woke: "Woke up",
    sleep_add: "Save night", sleep_week: "Last 7 nights (hours)", sleep_tips: "Sleep hygiene",
    sleep_wind: "Wind-down checklist",
    s1: "Quick reset", s2: "4-7-8 sleep breath", s3: "Focus 10", s4: "Body scan", s5: "Stress reset", s6: "Kids balloon",
    wind1: "Screens off 30 min before bed", wind2: "Dim the lights", wind3: "Cool, dark, quiet room",
    wind4: "No caffeine after lunch", wind5: "Same bedtime every night",
    mind_tonight: "Tonight", mind_times: "sessions",
  },
  ru: {
    nav_mind: "Покой", mind_meditate: "Медитации", mind_sleep: "Сон", mind_sessions: "Сессии с голосом",
    mind_min: "мин", mind_start: "Начать", mind_cancel: "Отмена", mind_finished: "Сессия завершена",
    mind_mood: "Как вы себя чувствуете?", mind_saved: "Записано", mind_weekly: "За неделю", mind_logs: "Недавние",
    mind_noise: "Звук", mind_none: "Тишина", mind_rain: "Дождь", mind_pink: "Шум",
    mind_phase_in: "Вдох", mind_phase_hold: "Задержка", mind_phase_out: "Выдох", mind_phase_hold2: "Задержка",
    mind_step1: "Устройтесь удобно, закройте глаза, расслабьте руки.",
    mind_step2: "Мысли будут приходить. Замечайте и отпускайте их.",
    mind_step3: "Мягко вернитесь. Откройте глаза, когда готовы.",
    sleep_bedtime: "Ложимся в", sleep_wake: "Встаём в", sleep_duration: "Плановый сон",
    sleep_log: "Записать вчерашний сон", sleep_to_bed: "Лёг в", sleep_woke: "Проснулся в",
    sleep_add: "Сохранить", sleep_week: "Последние 7 ночей (часы)", sleep_tips: "Гигиена сна",
    sleep_wind: "Ритуал перед сном",
    s1: "Быстрый ресет", s2: "Дыхание 4-7-8", s3: "Фокус 10", s4: "Сканирование тела", s5: "Сброс стресса", s6: "Шарик для детей",
    wind1: "Экраны выключены за 30 мин", wind2: "Приглушите свет", wind3: "Прохладно, темно, тихо",
    wind4: "Без кофеина после обеда", wind5: "Ложиться в одно время",
    mind_tonight: "Вечер", mind_times: "сессий",
  },
  hi: {
    nav_mind: "मन", mind_meditate: "ध्यान", mind_sleep: "नींद", mind_sessions: "निर्देशित सत्र",
    mind_min: "मिनट", mind_start: "शुरू", mind_cancel: "रद्द", mind_finished: "सत्र पूर्ण",
    mind_mood: "अब कैसा महसूस करते हैं?", mind_saved: "सहेजा", mind_weekly: "इस हफ्ते", mind_logs: "हाल के",
    mind_noise: "ध्वनि", mind_none: "शांति", mind_rain: "बारिश", mind_pink: "मुलायम शोर",
    mind_phase_in: "साँस लें", mind_phase_hold: "रोकें", mind_phase_out: "साँस छोड़ें", mind_phase_hold2: "रोकें",
    mind_step1: "आराम से बैठें, आँखें बंद करें, हाथ ढीले करें।",
    mind_step2: "विचार आएँगे। उन्हें देखें और जाने दें।",
    mind_step3: "धीरे से लौटें। तैयार होने पर आँखें खोलें।",
    sleep_bedtime: "सोने का लक्ष्य", sleep_wake: "जागने का लक्ष्य", sleep_duration: "योजनाबद्ध नींद",
    sleep_log: "कल की नींद जोड़ें", sleep_to_bed: "सोए", sleep_woke: "जागे",
    sleep_add: "सहेजें", sleep_week: "पिछली 7 रातें (घंटे)", sleep_tips: "नींद की आदतें",
    sleep_wind: "सोने से पहले की दिनचर्या",
    s1: "त्वरित रीसेट", s2: "साँस 4-7-8", s3: "फोकस 10", s4: "बॉडी स्कैन", s5: "तनाव मुक्ति", s6: "बच्चों का गुब्बारा",
    wind1: "सोने से 30 मिनट पहले स्क्रीन बंद", wind2: "रोशनी कम करें", wind3: "ठंडा, अँधेरा, शांत कमरा",
    wind4: "दोपहर बाद कैफीन नहीं", wind5: "रोज़ एक ही समय सोएँ",
    mind_tonight: "आज रात", mind_times: "सत्र",
  },
  ur: {
    nav_mind: "ذہن", mind_meditate: "مراقبہ", mind_sleep: "نیند", mind_sessions: "رہنمائی سیشن",
    mind_min: "منٹ", mind_start: "شروع", mind_cancel: "منسوخ", mind_finished: "سیشن مکمل",
    mind_mood: "اب کیسا محسوس کرتے ہیں؟", mind_saved: "محفوظ", mind_weekly: "اس ہفتے", mind_logs: "حالیہ",
    mind_noise: "آواز", mind_none: "خاموشی", mind_rain: "بارش", mind_pink: "نرم شور",
    mind_phase_in: "سانس لیں", mind_phase_hold: "روکیں", mind_phase_out: "سانس چھوڑیں", mind_phase_hold2: "روکیں",
    mind_step1: "آرام سے بیٹھیں، آنکھیں بند کریں، ہاتھ ڈھیلے کریں۔",
    mind_step2: "خیالات آئیں گے۔ دیکھیں اور چھوڑ دیں۔",
    mind_step3: "آہستہ لوٹیں۔ تیار ہوں تو آنکھیں کھولیں۔",
    sleep_bedtime: "سونے کا وقت", sleep_wake: "جاگنے کا وقت", sleep_duration: "منصوبہ بند نیند",
    sleep_log: "کل کی نیند لکھیں", sleep_to_bed: "سوئے", sleep_woke: "جاگے",
    sleep_add: "محفوظ", sleep_week: "پچھلی 7 راتیں (گھنٹے)", sleep_tips: "نیند کی عادات",
    sleep_wind: "سونے سے پہلے کا معمول",
    s1: "فوری ری سیٹ", s2: "سانس 4-7-8", s3: "فوکس 10", s4: "باڈی اسکین", s5: "تناؤ کم کریں", s6: "بچوں کا غبارہ",
    wind1: "سونے سے 30 منٹ پہلے اسکرین بند", wind2: "روشنی کم کریں", wind3: "ٹھنڈا، اندھیرا، پرسکون کمرہ",
    wind4: "دوپہر کے بعد کیفین نہیں", wind5: "روزانہ ایک ہی وقت سونا",
    mind_tonight: "آج رات", mind_times: "سیشن",
  },
  es: {
    nav_mind: "Mente", mind_meditate: "Meditar", mind_sleep: "Dormir", mind_sessions: "Sesiones guiadas",
    mind_min: "min", mind_start: "Empezar", mind_cancel: "Cancelar", mind_finished: "Sesión completa",
    mind_mood: "¿Cómo te sientes ahora?", mind_saved: "Guardado", mind_weekly: "Esta semana", mind_logs: "Recientes",
    mind_noise: "Sonido", mind_none: "Silencio", mind_rain: "Lluvia", mind_pink: "Ruido suave",
    mind_phase_in: "Inhala", mind_phase_hold: "Mantén", mind_phase_out: "Exhala", mind_phase_hold2: "Mantén",
    mind_step1: "Siéntate cómodo, cierra los ojos, suelta las manos.",
    mind_step2: "Llegarán pensamientos. Obsérvalos y déjalos pasar.",
    mind_step3: "Vuelve con calma. Abre los ojos cuando quieras.",
    sleep_bedtime: "Hora de acostarse", sleep_wake: "Hora de despertar", sleep_duration: "Sueño planificado",
    sleep_log: "Registrar anoche", sleep_to_bed: "Me acosté", sleep_woke: "Me desperté",
    sleep_add: "Guardar", sleep_week: "Últimas 7 noches (horas)", sleep_tips: "Higiene del sueño",
    sleep_wind: "Rutina de relajación",
    s1: "Reinicio rápido", s2: "Respiración 4-7-8", s3: "Enfoque 10", s4: "Escaneo corporal", s5: "Antiestrés", s6: "Globo para niños",
    wind1: "Sin pantallas 30 min antes", wind2: "Baja las luces", wind3: "Habitación fresca, oscura, quieta",
    wind4: "Sin cafeína tras el almuerzo", wind5: "Misma hora cada noche",
    mind_tonight: "Esta noche", mind_times: "sesiones",
  },
  ar: {
    nav_mind: "الذهن", mind_meditate: "تأمل", mind_sleep: "النوم", mind_sessions: "جلسات موجّهة",
    mind_min: "دقيقة", mind_start: "ابدأ", mind_cancel: "إلغاء", mind_finished: "اكتملت الجلسة",
    mind_mood: "كيف تشعر الآن؟", mind_saved: "حُفظ", mind_weekly: "هذا الأسبوع", mind_logs: "الأخيرة",
    mind_noise: "صوت", mind_none: "صمت", mind_rain: "مطر", mind_pink: "ضوضاء ناعمة",
    mind_phase_in: "شهيق", mind_phase_hold: "احبس", mind_phase_out: "زفير", mind_phase_hold2: "احبس",
    mind_step1: "اجلس براحة، أغمض عينيك، أرخِ يديك.",
    mind_step2: "ستأتي الأفكار. لاحظها ودعها تمر.",
    mind_step3: "عُد بهدوء. افتح عينيك متى استعدت.",
    sleep_bedtime: "وقت النوم", sleep_wake: "وقت الاستيقاظ", sleep_duration: "النوم المخطط",
    sleep_log: "سجّل الليلة الماضية", sleep_to_bed: "نمتَ", sleep_woke: "استيقظتَ",
    sleep_add: "احفظ", sleep_week: "آخر 7 ليالٍ (ساعات)", sleep_tips: "نظافة النوم",
    sleep_wind: "روتين ما قبل النوم",
    s1: "إعادة ضبط سريعة", s2: "تنفس 4-7-8", s3: "تركيز 10", s4: "مسح الجسم", s5: "تخفيف التوتر", s6: "بالون الأطفال",
    wind1: "إيقاف الشاشات قبل 30 دقيقة", wind2: "اخفض الإضاءة", wind3: "غرفة باردة مظلمة هادئة",
    wind4: "لا كافيين بعد الغداء", wind5: "نفس الموعد كل ليلة",
    mind_tonight: "الليلة", mind_times: "جلسات",
  },
};

/* ============================= listen library ============================= */
export interface ListenItem {
  id: string;
  kind: "noise" | "music" | "speech";
  key: string;
}

export const LISTEN: ListenItem[] = [
  { id: "silence", kind: "noise", key: "ls_silence" },
  { id: "rain", kind: "noise", key: "ls_rain" },
  { id: "soft", kind: "noise", key: "ls_soft" },
  { id: "music", kind: "music", key: "ls_music" },
  { id: "poem", kind: "speech", key: "ls_poem" },
  { id: "theme", kind: "speech", key: "ls_theme" },
  { id: "story", kind: "speech", key: "ls_story" },
  { id: "motivation", kind: "speech", key: "ls_motivation" },
  { id: "belief", kind: "speech", key: "ls_belief" },
  { id: "strength", kind: "speech", key: "ls_strength" },
];

/* real spoken content: EN + RU, other languages fall back to EN */
export const LISTEN_TEXT: Record<string, Partial<Record<Lang, string>>> = {
  poem: {
    en: "Softly falls the evening now, all the deeds of day are done. Breathe the quiet, lay it down, tomorrow brings the sun.",
    ru: "Вечер мягко опускается, все дела уходят в тень. Вдохни покой и отпусти - утро принесёт свой день.",
  },
  theme: {
    en: "Close your eyes. You are at a still lake at dawn. Mist rests on the water, and nothing here needs an answer. You can stay as long as you like.",
    ru: "Закрой глаза. Ты на тихом озере на рассвете. Туман лежит на воде, и здесь ничто не требует ответа. Оставайся, сколько хочешь.",
  },
  story: {
    en: "A carpenter was asked how he cut a huge trunk so precisely. He said: I measure twice, cut once - and if it breaks, I learn something new. Today, whatever comes, measure twice before you decide. The wood always teaches. And you are the carpenter of this day.",
    ru: "Столяра спросили, как он так точно распиливает ствол. Он ответил: отмеряю дважды, режу один раз - а если сломаю, значит, узнал что-то новое. Сегодня, что бы ни случилось, отмеряй дважды, прежде чем решать. Дерево всегда учит. А ты - мастер этого дня.",
  },
  motivation: {
    en: "You do not need the perfect hour. You need the next five minutes, and the five after that. Starting small still moves the mountain. You have started before. You can start again. Now.",
    ru: "Тебе не нужен идеальный час. Нужны следующие пять минут, а потом ещё пять. Маленький шаг тоже двигает гору. Ты уже начинал - сможешь снова. Сейчас.",
  },
  belief: {
    en: "Whatever you carry today, it does not define you. You are still here, still trying, still growing. Hold that quietly, like a stone in your pocket. It is enough.",
    ru: "Что бы ты ни нёс сегодня, это не определяет тебя. Ты здесь, ты стараешься, ты растёшь. Подержи это тихо, как камешек в кармане. Этого достаточно.",
  },
  strength: {
    en: "Feel your feet on the ground, your back upright. Every breath in is strength arriving, every breath out is heaviness leaving. You have survived every hard day so far. This one will not break the streak.",
    ru: "Почувствуй ноги на земле, спину прямой. Каждый вдох - прибывающая сила, каждый выдох - уходящая усталость. Ты пережил каждый трудный день до этого. Этот не станет исключением.",
  },
};

export const LISTEN_TEXT_KEY: Record<string, (lang: Lang) => string> = {
  poem: (l) => LISTEN_TEXT.poem[l] ?? LISTEN_TEXT.poem.en ?? "",
  theme: (l) => LISTEN_TEXT.theme[l] ?? LISTEN_TEXT.theme.en ?? "",
  story: (l) => LISTEN_TEXT.story[l] ?? LISTEN_TEXT.story.en ?? "",
  motivation: (l) => LISTEN_TEXT.motivation[l] ?? LISTEN_TEXT.motivation.en ?? "",
  belief: (l) => LISTEN_TEXT.belief[l] ?? LISTEN_TEXT.belief.en ?? "",
  strength: (l) => LISTEN_TEXT.strength[l] ?? LISTEN_TEXT.strength.en ?? "",
};

/* ============================= emergency regions ============================= */
export interface Region {
  code: string;
  label: string;
  sos: string;
  med: string;
  pol: string;
  fire: string;
}

export const REGIONS: Region[] = [
  { code: "US", label: "United States", sos: "911", med: "911", pol: "911", fire: "911" },
  { code: "CA", label: "Canada", sos: "911", med: "911", pol: "911", fire: "911" },
  { code: "GB", label: "United Kingdom", sos: "999", med: "999", pol: "999", fire: "999" },
  { code: "EU", label: "European Union", sos: "112", med: "112", pol: "112", fire: "112" },
  { code: "DE", label: "Germany", sos: "112", med: "112", pol: "110", fire: "112" },
  { code: "FR", label: "France", sos: "112", med: "15", pol: "17", fire: "18" },
  { code: "ES", label: "Spain", sos: "112", med: "061", pol: "091", fire: "112" },
  { code: "IN", label: "India", sos: "112", med: "108", pol: "100", fire: "101" },
  { code: "PK", label: "Pakistan", sos: "1122", med: "115", pol: "15", fire: "16" },
  { code: "RU", label: "Russia", sos: "112", med: "103", pol: "102", fire: "101" },
  { code: "KZ", label: "Kazakhstan", sos: "112", med: "103", pol: "102", fire: "101" },
  { code: "AE", label: "United Arab Emirates", sos: "999", med: "998", pol: "999", fire: "997" },
  { code: "SA", label: "Saudi Arabia", sos: "911", med: "997", pol: "999", fire: "998" },
  { code: "BR", label: "Brazil", sos: "190", med: "192", pol: "190", fire: "193" },
  { code: "AU", label: "Australia", sos: "000", med: "000", pol: "000", fire: "000" },
  { code: "JP", label: "Japan", sos: "110", med: "119", pol: "110", fire: "119" },
  { code: "CN", label: "China", sos: "120", med: "120", pol: "110", fire: "119" },
  { code: "TR", label: "Turkey", sos: "112", med: "112", pol: "155", fire: "110" },
];

export function detectRegion(): string {
  try {
    const lang = navigator.language || "";
    const cc = (lang.split("-")[1] || "").toUpperCase();
    const known = new Set(REGIONS.map((r) => r.code));
    if (known.has(cc)) return cc;
    const langMap: Record<string, string> = { en: "US", ru: "RU", hi: "IN", ur: "PK", es: "ES", ar: "AE", de: "DE", fr: "FR", pt: "BR", zh: "CN", ja: "JP", tr: "TR" };
    const base = (lang.split("-")[0] || "").toLowerCase();
    if (langMap[base]) return langMap[base];
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("Almaty") || tz.includes("Qostanay")) return "KZ";
    if (tz.includes("Moscow") || tz.includes("Yekaterinburg")) return "RU";
    if (tz === "America/New_York" || tz.startsWith("America/")) return "US";
  } catch { /* ignore */ }
  return "US";
}

/* ============================= plans ============================= */
export interface Plan { id: string; price: number; }
export const PLANS: Plan[] = [
  { id: "weekly", price: 1.95 },
  { id: "monthly", price: 4.45 },
  { id: "yearly", price: 30 },
];

/* ============================= home SOS blueprint ============================= */
export interface BlueprintProblem { issue: string; steps: string[]; }
export interface BlueprintSection { tradeKey: string; svg: string; problems: BlueprintProblem[]; }
export const BLUEPRINT: BlueprintSection[] = [
  {
    tradeKey: "trade_electric", svg: "breaker",
    problems: [
      { issue: "No power in one room", steps: ["Open the breaker box and find the tripped switch", "Push it fully OFF, then fully ON", "Unplug appliances one by one; if it trips again instantly, stop and call an electrician"] },
      { issue: "A socket feels warm or smells", steps: ["Switch that circuit OFF at the box", "Do not use the socket", "Call an electrician before the next use"] },
    ],
  },
  {
    tradeKey: "trade_plumb", svg: "pipe",
    problems: [
      { issue: "Leak under the sink", steps: ["Close the little angle valve under the sink", "Put a bucket under the drip and dry the cabinet", "Replace the hose, or call a plumber today"] },
      { issue: "Blocked drain", steps: ["Remove standing water with a cup", "Pour 1/2 cup of baking soda, then boiling vinegar; wait 15 minutes", "Plunge hard; if still blocked, call a plumber"] },
    ],
  },
  {
    tradeKey: "trade_clean", svg: "spray",
    problems: [
      { issue: "Spill on the carpet", steps: ["Blot with paper towels - never rub", "Mild soap with cold water, blot again", "Heavy grease: cover with salt, vacuum after an hour"] },
      { issue: "Mold in a corner", steps: ["Open the window and ventilate", "Spray vinegar or diluted bleach, wipe after 10 minutes", "Fix leaks so it does not return"] },
    ],
  },
  {
    tradeKey: "trade_hand", svg: "wrench",
    problems: [
      { issue: "Door hinge keeps squeaking", steps: ["Lift the pin out with a screwdriver", "Oil the pin, open and close a few times", "Tighten the screws gently, not to the max"] },
      { issue: "A shelf fell down", steps: ["Remove the shelf and mark the holes level", "Use wall plugs that match your wall type", "Heavy items go into studs, not plaster"] },
    ],
  },
  {
    tradeKey: "trade_legal", svg: "scales",
    problems: [
      { issue: "A contract question", steps: ["Never sign under pressure", "Read it twice and note unclear clauses", "Ask a legal adviser, taking the contract copy with you"] },
      { issue: "Tenant rights issue", steps: ["Save every message and receipt", "Check the tenant law for your city", "Advise with a legal adviser before replying in writing"] },
    ],
  },
  {
    tradeKey: "trade_delivery", svg: "box",
    problems: [
      { issue: "Package shown delivered, not here", steps: ["Check neighbours' doors and the building office", "Ask the carrier for the GPS proof photo", "Submit a claim in the app with the tracking number"] },
      { issue: "Damaged delivery", steps: ["Film the box before opening", "Photograph the damage with the label visible", "Claim immediately with photos attached"] },
    ],
  },
];

/* ============================= EXTRA labels ============================= */
const EXTRA_D: Record<Lang, Record<string, string>> = {
  en: {
    ls_silence: "Silence", ls_rain: "Rain", ls_soft: "Soft noise", ls_music: "Peaceful music",
    ls_poem: "Poem", ls_theme: "Theme", ls_story: "Story", ls_motivation: "Motivation",
    ls_belief: "Belief", ls_strength: "Strength", ls_music_note: "soft tones, no words",
    plans_title: "Plans & pricing", plan_free_trial: "7-day free trial", plan_no_card: "no card required",
    plan_weekly: "$1.95 / week", plan_monthly: "$4.45 / month", plan_yearly: "$30 / year (2.5 per month)",
    plan_start_trial: "Start free trial", plan_trial_active: "Free trial", trial_days_left: "days left",
    plan_subscribe: "Subscribe", plan_active: "Active", plan_pending: "Payment pending",
    plan_none: "No active plan", plan_expired: "Trial ended",
    payment_note: "The plans and prices are live. Payment opens as soon as the owner connects the payment provider in settings.",
    sponsored: "Sponsored", sponsor_slot: "This slot is free for your sponsor - add your first ad.",
    sponsor_title: "Sponsor ads", sponsor_note: "Ads appear at the bottom of your dashboard. You control the content and see every click.",
    ad_title: "Ad title", ad_tagline: "One-liner", ad_link: "Target link (https://...)",
    ad_add: "Add ad", ad_manage: "Manage ads", sponsor_stats: "clicks",
    no_workers: "No registered workers yet",
    no_workers_note: "Be the first and register your profile - or use the smart guide below while the list fills up.",
    blueprint_open: "Open the Home SOS blueprint (PDF)",
    blueprint_title: "Home SOS: what to do right now",
    blueprint_note: "A printed, image-based guide for common household problems - keep it near the family board.",
    preview_public: "How customers see you", create_profile_cta: "Register your public profile to appear in search",
    trade_electric: "Electricity", trade_plumb: "Plumbing", trade_clean: "Cleaning",
    trade_hand: "Handyman", trade_legal: "Legal", trade_delivery: "Delivery",
    bp_steps: "Do this now", bp_pro: "Still stuck? Call a registered worker from DayAxis.",
  },
  ru: {
    ls_silence: "Тишина", ls_rain: "Дождь", ls_soft: "Шум", ls_music: "Спокойная музыка",
    ls_poem: "Стихотворение", ls_theme: "Тематический фон", ls_story: "История", ls_motivation: "Мотивация",
    ls_belief: "Убеждение", ls_strength: "Сила", ls_music_note: "мягкие тона, без слов",
    plans_title: "Тарифы и цены", plan_free_trial: "7 дней бесплатно", plan_no_card: "карта не нужна",
    plan_weekly: "1.95 $ / неделя", plan_monthly: "4.45 $ / месяц", plan_yearly: "30 $ / год (2.5 $ в месяц)",
    plan_start_trial: "Начать бесплатно", plan_trial_active: "Пробный период", trial_days_left: "дней осталось",
    plan_subscribe: "Оформить", plan_active: "Активен", plan_pending: "Оплата ожидается",
    plan_none: "Нет активного тарифа", plan_expired: "Пробный период закончился",
    payment_note: "Тарифы и цены уже работают. Оплата включится, когда владелец подключит платёжного провайдера в настройках.",
    sponsored: "Партнёрский блок", sponsor_slot: "Этот слот свободен для вашего спонсора - добавьте первое объявление.",
    sponsor_title: "Партнёрские объявления", sponsor_note: "Объявления показываются внизу вашей панели. Вы управляете содержанием и видите каждый клик.",
    ad_title: "Заголовок", ad_tagline: "Слоган", ad_link: "Ссылка (https://...)",
    ad_add: "Добавить", ad_manage: "Управление", sponsor_stats: "кликов",
    no_workers: "Пока нет зарегистрированных мастеров",
    no_workers_note: "Станьте первым и зарегистрируйте профиль - или откройте умную памятку ниже, пока список пуст.",
    blueprint_open: "Открыть памятку «Дом: SOS» (PDF)",
    blueprint_title: "Дом: SOS - что делать прямо сейчас",
    blueprint_note: "Печатная памятка с картинками для частых бытовых проблем - повесьте у семейной доски.",
    preview_public: "Как вас видят клиенты", create_profile_cta: "Создайте публичный профиль, чтобы вас находили в поиске",
    trade_electric: "Электричество", trade_plumb: "Сантехника", trade_clean: "Уборка и порядок",
    trade_hand: "Мастер на час", trade_legal: "Юридические вопросы", trade_delivery: "Доставка",
    bp_steps: "Сделайте сейчас", bp_pro: "Не помогло? Обратитесь к проверенному мастеру из DayAxis.",
  },
  hi: {
    ls_silence: "शांति", ls_rain: "बारिश", ls_soft: "मुलायम शोर", ls_music: "शांत संगीत",
    ls_poem: "कविता", ls_theme: "थीम", ls_story: "कहानी", ls_motivation: "प्रेरणा",
    ls_belief: "विश्वास", ls_strength: "शक्ति", ls_music_note: "मुलायम धुन, बिना शब्द",
    plans_title: "योजनाएँ", plan_free_trial: "7 दिन मुफ़्त", plan_no_card: "कार्ड ज़रूरी नहीं",
    plan_weekly: "1.95 $ / हफ़्ता", plan_monthly: "4.45 $ / माह", plan_yearly: "30 $ / साल",
    plan_start_trial: "मुफ़्त शुरू करें", plan_trial_active: "मुफ़्त परीक्षण", trial_days_left: "दिन बाकी",
    plan_subscribe: "सदस्यता", plan_active: "सक्रिय", plan_pending: "भुगतान लंबित",
    plan_none: "कोई योजना नहीं", plan_expired: "परीक्षण समाप्त",
    payment_note: "योजनाएँ तैयार हैं। मालिक भुगतान जोड़ते ही चेकआउट खुलेगा।",
    sponsored: "प्रायोजित", sponsor_slot: "यह स्लॉट आपके प्रायोजक के लिए खाली है।",
    sponsor_title: "प्रायोजक विज्ञापन", sponsor_note: "विज्ञापन आपके डैशबोर्ड के नीचे दिखते हैं।",
    ad_title: "शीर्षक", ad_tagline: "एक पंक्ति", ad_link: "लिंक (https://...)",
    ad_add: "जोड़ें", ad_manage: "प्रबंधन", sponsor_stats: "क्लिक",
    no_workers: "अभी कोई मिस्त्री पंजीकृत नहीं",
    no_workers_note: "पहले बनें और प्रोफ़ाइल बनाएँ - या नीचे स्मार्ट गाइड खोलें।",
    blueprint_open: "घर SOS गाइड खोलें (PDF)",
    blueprint_title: "घर SOS: अभी क्या करें",
    blueprint_note: "चित्रों वाली छपी गाइड - परिवार बोर्ड के पास रखें।",
    preview_public: "ग्राहक आपको ऐसे देखते हैं", create_profile_cta: "खोज में आने के लिए प्रोफ़ाइल बनाएँ",
    trade_electric: "बिजली", trade_plumb: "नलसाज़ी", trade_clean: "सफ़ाई",
    trade_hand: "हैंडीमैन", trade_legal: "कानूनी", trade_delivery: "डिलीवरी",
    bp_steps: "अभी करें", bp_pro: "फिर भी नहीं? DayAxis से मिस्त्री बुलाएँ।",
  },
  ur: {
    ls_silence: "خاموشی", ls_rain: "بارش", ls_soft: "نرم شور", ls_music: "پرسکون موسیقی",
    ls_poem: "نظم", ls_theme: "تھیم", ls_story: "کہانی", ls_motivation: "تحریک",
    ls_belief: "یقین", ls_strength: "طاقت", ls_music_note: "نرم لہجے، بغیر الفاظ",
    plans_title: "منصوبے", plan_free_trial: "7 دن مفت", plan_no_card: "کارڈ کی ضرورت نہیں",
    plan_weekly: "1.95 $ / ہفتہ", plan_monthly: "4.45 $ / مہینہ", plan_yearly: "30 $ / سال",
    plan_start_trial: "مفت شروع کریں", plan_trial_active: "مفت آزمائش", trial_days_left: "دن باقی",
    plan_subscribe: "سبسکرائب", plan_active: "فعال", plan_pending: "ادائیگی زیر التوا",
    plan_none: "کوئی منصوبہ نہیں", plan_expired: "آزمائش ختم",
    payment_note: "منصوبے تیار ہیں۔ مالک ادائیگی جوڑتے ہی چیک آؤٹ کھلے گا۔",
    sponsored: "اسپانسر شدہ", sponsor_slot: "یہ سلاٹ آپ کے اسپانسر کے لیے خالی ہے۔",
    sponsor_title: "اسپانسر اشتہارات", sponsor_note: "اشتہارات آپ کے ڈیش بورڈ کے نیچے دکھتے ہیں۔",
    ad_title: "عنوان", ad_tagline: "ایک سطر", ad_link: "لنک (https://...)",
    ad_add: "شامل", ad_manage: "انتظام", sponsor_stats: "کلکس",
    no_workers: "ابھی کوئی کاریگر رجسٹرڈ نہیں",
    no_workers_note: "پہلے بنیں اور پروفائل بنائیں - یا نیچے سمارٹ گائیڈ کھولیں۔",
    blueprint_open: "گھر SOS گائیڈ کھولیں (PDF)",
    blueprint_title: "گھر SOS: ابھی کیا کریں",
    blueprint_note: "تصویروں والی چھپی گائیڈ - خاندانی بورڈ کے پاس رکھیں۔",
    preview_public: "گاہک آپ کو ایسے دیکھتے ہیں", create_profile_cta: "تلاش میں آنے کے لیے پروفائل بنائیں",
    trade_electric: "بجلی", trade_plumb: "پلمبنگ", trade_clean: "صفائی",
    trade_hand: "ہینڈی مین", trade_legal: "قانونی", trade_delivery: "ڈیلیوری",
    bp_steps: "ابھی کریں", bp_pro: "پھر بھی نہیں؟ DayAxis سے کاریگر بلائیں۔",
  },
  es: {
    ls_silence: "Silencio", ls_rain: "Lluvia", ls_soft: "Ruido suave", ls_music: "Música tranquila",
    ls_poem: "Poema", ls_theme: "Tema", ls_story: "Historia", ls_motivation: "Motivación",
    ls_belief: "Creencia", ls_strength: "Fuerza", ls_music_note: "tonos suaves, sin palabras",
    plans_title: "Planes y precios", plan_free_trial: "Prueba gratis 7 días", plan_no_card: "sin tarjeta",
    plan_weekly: "1.95 $ / semana", plan_monthly: "4.45 $ / mes", plan_yearly: "30 $ / año",
    plan_start_trial: "Empezar gratis", plan_trial_active: "Prueba gratis", trial_days_left: "días restantes",
    plan_subscribe: "Suscribirse", plan_active: "Activo", plan_pending: "Pago pendiente",
    plan_none: "Sin plan activo", plan_expired: "Prueba terminada",
    payment_note: "Los planes ya están activos. El cobro se abre al conectar el proveedor en ajustes.",
    sponsored: "Patrocinado", sponsor_slot: "Este espacio está libre para tu patrocinador.",
    sponsor_title: "Anuncios patrocinados", sponsor_note: "Los anuncios aparecen abajo en tu panel. Tú controlas el contenido.",
    ad_title: "Título", ad_tagline: "Frase", ad_link: "Enlace (https://...)",
    ad_add: "Añadir", ad_manage: "Gestionar", sponsor_stats: "clics",
    no_workers: "Aún no hay profesionales registrados",
    no_workers_note: "Sé el primero y registra tu perfil - o abre la guía inteligente de abajo.",
    blueprint_open: "Abrir la guía SOS del hogar (PDF)",
    blueprint_title: "Hogar SOS: qué hacer ahora",
    blueprint_note: "Guía impresa con imágenes - guárdala cerca de la pizarra familiar.",
    preview_public: "Cómo te ven los clientes", create_profile_cta: "Registra tu perfil público para aparecer en la búsqueda",
    trade_electric: "Electricidad", trade_plumb: "Fontanería", trade_clean: "Limpieza",
    trade_hand: "Manitas", trade_legal: "Legal", trade_delivery: "Entrega",
    bp_steps: "Hazlo ahora", bp_pro: "¿Aún atascado? Contacta a un profesional de DayAxis.",
  },
  ar: {
    ls_silence: "صمت", ls_rain: "مطر", ls_soft: "ضوضاء ناعمة", ls_music: "موسيقى هادئة",
    ls_poem: "قصيدة", ls_theme: "موضوع", ls_story: "قصة", ls_motivation: "تحفيز",
    ls_belief: "إيمان", ls_strength: "قوة", ls_music_note: "نغمات ناعمة بلا كلمات",
    plans_title: "الخطط والأسعار", plan_free_trial: "تجربة مجانية 7 أيام", plan_no_card: "بدون بطاقة",
    plan_weekly: "1.95 $ / أسبوع", plan_monthly: "4.45 $ / شهر", plan_yearly: "30 $ / سنة",
    plan_start_trial: "ابدأ مجاناً", plan_trial_active: "تجربة مجانية", trial_days_left: "أيام متبقية",
    plan_subscribe: "اشترك", plan_active: "نشط", plan_pending: "دفع قيد الانتظار",
    plan_none: "لا خطة نشطة", plan_expired: "انتهت التجربة",
    payment_note: "الخطط جاهزة. يفتح الدفع عند ربط المزود في الإعدادات.",
    sponsored: "مُموَّل", sponsor_slot: "هذه المساحة خالية لراعيكم.",
    sponsor_title: "إعلانات الرعاة", sponsor_note: "تظهر الإعلانات أسفل لوحتكم. أنتم تتحكمون بالمحتوى.",
    ad_title: "العنوان", ad_tagline: "سطر واحد", ad_link: "الرابط (https://...)",
    ad_add: "إضافة", ad_manage: "إدارة", sponsor_stats: "نقرات",
    no_workers: "لا حرفيون مسجلون بعد",
    no_workers_note: "كن الأول وسجّل ملفك - أو افتح الدليل الذكي أدناه.",
    blueprint_open: "افتح دليل SOS المنزلي (PDF)",
    blueprint_title: "المنزل SOS: ماذا تفعل الآن",
    blueprint_note: "دليل مطبوع بالصور - احفظه قرب لوحة العائلة.",
    preview_public: "كيف يراك العملاء", create_profile_cta: "سجّل ملفك العام لتظهر في البحث",
    trade_electric: "كهرباء", trade_plumb: "سباكة", trade_clean: "تنظيف",
    trade_hand: "حرفي منزلي", trade_legal: "قانوني", trade_delivery: "توصيل",
    bp_steps: "افعلها الآن", bp_pro: "لا يزال عالقاً؟ استعن بحرفي من DayAxis.",
  },
};